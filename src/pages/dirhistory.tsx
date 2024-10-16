import { useEffect, useRef, useState } from 'react'
import { invoke } from '@tauri-apps/api/core'
import { getCurrentWindow } from '@tauri-apps/api/window'

import { getDirHistory } from '../commands/dirhistory'

export default function DirHistory() {
  let fullHistory = getDirHistory()
  let [dirs, setDirs] = useState(fullHistory)
  let [row, setRow] = useState(dirs.length - 1)
  const scrollRef = useRef<HTMLDivElement | null>(null)

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight
    }
  }, [dirs])

  // #region ------------------------- Event handlers -------------------------

  function updateFilter(evt: React.FormEvent) {
    let filterText = (evt.target as HTMLInputElement).value || ''
    let filteredDirs = fullHistory.filter(dir =>
      dir.toLowerCase().includes(filterText.toLowerCase())
    )
    setDirs(filteredDirs)
    setRow(filteredDirs.length - 1)
    console.log(`Dir History: found ${filteredDirs.length} entries`)
  }

  function checkKey(evt: React.KeyboardEvent) {
    let key = evt.key || evt.code
    let cancelEvent = true
    if (key == 'Enter') {
      invoke('send_response', { data: dirs[row] })
      getCurrentWindow().hide()
    } else if (key == 'ArrowUp') {
      // TODO ensure row is visible, update scrollTop if required
      if (row > 0) setRow(row - 1)
    } else if (key == 'ArrowDown') {
      // TODO ensure row is visible, update scrollTop if required
      if (row < dirs.length - 1) setRow(row + 1)
    } else if (key == 'PageUp') {
      // TODO page up
      // Requires computation of number of visible rows
      console.log('ToDo: page up')
    } else if (key == 'PageDown') {
      // TODO page down
      // Requires computation of number of visible rows
      console.log('ToDo: page down')
    } else {
      cancelEvent = false
    }
    if (cancelEvent) evt.preventDefault()
  }

  function selectDirectory(dir: string) {
    invoke('send_response', { data: dir })
    getCurrentWindow().hide()
  }

  // #region ------------------------- Component rendering -------------------------
  return (
    <div className="flex h-screen flex-col dark:bg-black">
      {/*------------------------- List of directories -------------------------*/}
      <div className="m-2 flex flex-grow flex-col-reverse overflow-auto rounded border border-gray-400 p-1 dark:bg-gray-800 dark:text-gray-200">
        <div ref={scrollRef}>
          {dirs.map((dir, idx) => (
            <a
              href="#"
              className={`${row == idx ? 'bg-blue-300 dark:bg-blue-600' : 'hover:bg-blue-100 dark:hover:bg-blue-800'} block border-t p-0.5 font-mono text-sm dark:border-gray-600`}
              key={idx}
              onClick={_ => selectDirectory(dir)}
            >
              {dir}
            </a>
          ))}
        </div>
      </div>

      {/*------------------------- Search box -------------------------*/}
      <input
        type="text"
        className="m-2 rounded border border-gray-400 p-1 font-mono focus:outline-none dark:bg-gray-800 dark:text-gray-200"
        autoFocus
        spellCheck="false"
        onInput={updateFilter}
        onKeyDown={checkKey}
      />
    </div>
  )
}
