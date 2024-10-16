import { useEffect, useRef, useState } from 'react'
import { getDirHistory } from '../commands/dirhistory'

export default function DirHistory() {
  let fullHistory = getDirHistory()
  let [dirs, setDirs] = useState(fullHistory)
  const scrollRef = useRef<HTMLDivElement | null>(null)

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight
    }
  }, [dirs])

  function updateFilter(evt: React.FormEvent) {
    let filterText = (evt.target as HTMLInputElement).value || ''
    let filteredDirs = fullHistory.filter(dir =>
      dir.toLowerCase().includes(filterText.toLowerCase())
    )
    setDirs(filteredDirs)
    console.log(`Dir History: found ${filteredDirs.length} entries`)
  }

  return (
    <div className="flex h-screen flex-col dark:bg-black">
      {/*------------------------- List of directories -------------------------*/}
      <div className="m-2 flex flex-grow flex-col-reverse overflow-auto rounded border border-gray-400 p-1">
        <div ref={scrollRef} className="dark:bg-gray-800 dark:text-gray-200">
          {dirs.map((dir, idx) => (
            <a
              href="#"
              className="block border-t font-mono text-sm hover:bg-blue-500 dark:border-gray-600"
              key={idx}
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
      />
    </div>
  )
}
