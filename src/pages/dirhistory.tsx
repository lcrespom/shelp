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

  const dirListClasses = `
    m-2 flex flex-1 flex-col overflow-auto rounded border border-gray-400 p-1
    dark:bg-gray-800 dark:text-gray-200`
  const inputClasses = `
    m-2 rounded border border-gray-400 p-1 font-mono focus:outline-none
    dark:bg-gray-800 dark:text-gray-200`

  return (
    <div className="flex h-screen flex-col dark:bg-black">
      {/*------------------------- List of directories -------------------------*/}
      <div ref={scrollRef} className={dirListClasses}>
        {dirs.map((dir, idx) => (
          <a
            href="#"
            className="border-b font-mono text-sm last:border-b-0 hover:bg-blue-500"
            key={idx}
          >
            {dir}
          </a>
        ))}
      </div>

      {/*------------------------- Search box -------------------------*/}
      <input
        type="text"
        className={inputClasses}
        autoFocus
        spellCheck="false"
        onInput={updateFilter}
      />
    </div>
  )
}
