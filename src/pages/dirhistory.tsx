import { useState } from 'react'
import { getDirHistory } from '../commands/dirhistory'

let fullDirHistory = getDirHistory()

export default function DirHistory() {
  let [dirs, setDirs] = useState(fullDirHistory)

  function updateFilter(evt: React.FormEvent<HTMLInputElement>) {
    let filterText = ((evt.target as HTMLInputElement).value || '').toLowerCase()
    setDirs(fullDirHistory.filter(dir => dir.toLowerCase().includes(filterText)))
  }

  return (
    <div className="m-2">
      <h2>ToDo: Dir History</h2>
      <input className="form-control mb-2" onInput={updateFilter} />
      <div className="list-group">
        {dirs.map((dir, idx) => (
          <a href="#" className="list-group-item list-group-item-action" key={idx}>
            {dir}
          </a>
        ))}
      </div>
    </div>
  )
}
