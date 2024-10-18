import { useEffect, useRef, useState } from 'react'
import { invoke } from '@tauri-apps/api/core'
import { getCurrentWindow } from '@tauri-apps/api/window'

type SelectListProps = {
  list: string[]
}

let rowsPerPage = 25

export default function SelectList(props: SelectListProps) {
  // #region ------------------------- Setup -------------------------

  let [lines, setLines] = useState(props.list)
  let [row, setRow] = useState(lines.length - 1)
  const scrollRef = useRef<HTMLDivElement | null>(null)

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight
      let boxH = scrollRef.current.parentElement?.getBoundingClientRect().height || 800
      let rowElem = scrollRef.current.childNodes.item(0) as HTMLElement
      if (rowElem) {
        let rowH = rowElem.getBoundingClientRect().height
        rowsPerPage = Math.floor(boxH / rowH) - 1
        console.log({ boxH, rowH, rowsPerPage })
      }
    }
  }, [lines])

  // #region ------------------------- Event handlers -------------------------

  function updateFilter(evt: React.FormEvent) {
    let filterText = (evt.target as HTMLInputElement).value || ''
    let filteredLines = props.list.filter(line =>
      line.toLowerCase().includes(filterText.toLowerCase())
    )
    setLines(filteredLines)
    setRow(filteredLines.length - 1)
    console.log(`SelectList: found ${filteredLines.length} entries`)
  }

  function updateRow(steps: number) {
    let newRow = row + steps
    if (newRow < 0) newRow = 0
    else if (newRow >= lines.length) newRow = lines.length - 1
    if (row == newRow) return
    setRow(newRow)
    let rowElem = scrollRef.current?.childNodes.item(newRow) as HTMLElement
    rowElem.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'nearest' })
  }

  function selectLine(line: string) {
    invoke('send_response', { data: line })
    getCurrentWindow().hide()
  }

  function checkKey(evt: React.KeyboardEvent) {
    let key = evt.key || evt.code
    let cancelEvent = true
    if (key == 'Enter') {
      if (!lines || lines.length <= 0) return
      selectLine(lines[row])
    } else if (key == 'ArrowUp') {
      if (evt.metaKey) updateRow(-lines.length)
      else updateRow(-1)
    } else if (key == 'ArrowDown') {
      if (evt.metaKey) updateRow(lines.length)
      else updateRow(1)
    } else if (key == 'PageUp') {
      updateRow(-rowsPerPage)
    } else if (key == 'PageDown') {
      updateRow(rowsPerPage)
    } else {
      cancelEvent = false
    }
    if (cancelEvent) evt.preventDefault()
  }

  // #region ------------------------- Component rendering -------------------------
  return (
    <div className="flex h-screen flex-col">
      {/*------------------------- List -------------------------*/}
      <div className="selectlist-box">
        <div ref={scrollRef}>
          {lines.map((line, idx) => (
            <a
              href="#"
              className={`${row == idx ? 'selectlist-sel' : 'selectlist-hover'} selectlist-item`}
              key={idx}
              onClick={_ => selectLine(line)}
            >
              {line}
            </a>
          ))}
        </div>
      </div>

      {/*------------------------- Search box -------------------------*/}
      <input
        type="text"
        className="selectlist-input"
        autoFocus
        spellCheck="false"
        onInput={updateFilter}
        onKeyDown={checkKey}
      />
    </div>
  )
}
