import { useEffect, useRef, useState } from 'react'
import { invoke } from '@tauri-apps/api/core'
import { getCurrentWindow } from '@tauri-apps/api/window'
import { multiMatch, splitMatch } from '../helpers/multisearch'

type SelectListProps = {
  list: string[]
  selectFilter?: string
}

type MatchHighlightProps = {
  line: string
  filterText: string
}

let rowsPerPage = 25

function filterList(list: string[], filterText?: string) {
  if (!filterText) return list
  let words = filterText.split(' ')
  return list.filter(line => multiMatch(line, words))
}

function MatchHighlight(props: MatchHighlightProps) {
  if (!props.filterText) return <>{props.line}</>
  let parts = splitMatch(props.line, props.filterText.split(' '))
  return <>{parts.map(part => (part.isMatch ? <i>{part.text}</i> : part.text))}</>
}

export default function SelectList(props: SelectListProps) {
  // #region ------------------------- Setup -------------------------

  let [lines, setLines] = useState(filterList(props.list, props.selectFilter))
  let [row, setRow] = useState(lines.length - 1)
  let [filterText, setFilterText] = useState(props.selectFilter || '')
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
    let value = (evt.target as HTMLInputElement).value || ''
    let filteredLines = filterList(props.list, value)
    setLines(filteredLines)
    setRow(filteredLines.length - 1)
    setFilterText(value)
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
              <MatchHighlight line={line} filterText={filterText} />
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
        value={filterText}
        onInput={updateFilter}
        onKeyDown={checkKey}
      />
    </div>
  )
}
