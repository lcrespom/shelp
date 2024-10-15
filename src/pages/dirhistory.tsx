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
        className="w-full rounded border border-gray-400 p-1 focus:outline-none"
        autoFocus
        onInput={updateFilter}
      />
      <div className="flex flex-col">
        {dirs.map((dir, idx) => (
          <a href="#" className="list-group-item list-group-item-action" key={idx}>
            {dir}
          </a>
        ))}
      </div>
    </div>
  )
}
