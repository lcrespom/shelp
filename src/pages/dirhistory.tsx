import { useState } from 'react'
import { getDirHistory } from '../commands/dirhistory'

export default function DirHistory() {
  let [dirs, setDirs] = useState(getDirHistory())

  function updateFilter(evt: React.FormEvent) {
    let filterText = (evt.target as HTMLInputElement).value || ''
    let filteredDirs = getDirHistory().filter(dir =>
      dir.toLowerCase().includes(filterText.toLowerCase())
    )
    setDirs(filteredDirs)
    console.log(`Dir History: found ${filteredDirs.length} entries`)
  }

  return (
    <div>
      <h2 className="text-2xl">ToDo: Dir History</h2>
      <input
        type="text"
        className="mb-2 w-full rounded border border-gray-400 p-1 focus:outline-none"
        autoFocus
        spellCheck="false"
        onInput={updateFilter}
      />
      <div className="flex flex-col rounded border border-gray-400 p-1">
        {dirs.map((dir, idx) => (
          <a href="#" className="border-b font-mono text-sm hover:bg-blue-400" key={idx}>
            {dir}
          </a>
        ))}
      </div>
    </div>
  )
}
