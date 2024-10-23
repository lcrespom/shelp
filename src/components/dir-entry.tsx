import { getDirInfo } from '../commands/file-search'

type DirEntryProps = {
  line: string
  filterWords: string[]
}

function fileColor(permissions: string) {
  if (permissions[0] == 'd') return 'hl-parameter'
  if (permissions.includes('x')) return 'hl-assignment'
  else return 'hl-program'
}

export default function DirEntry(props: DirEntryProps) {
  let info = getDirInfo(props.line)
  return (
    <div className="flex">
      <span className="hl-assignment w-26 overflow-x-clip pl-1 pr-2">
        {info.permissions}
      </span>
      <span className="hl-program w-14 overflow-x-clip pr-2 text-center font-sans">
        {info.user}
      </span>
      <span className="hl-program w-14 overflow-x-clip pr-2 text-center font-sans">
        {info.group}
      </span>
      <span className="hl-quote w-20 overflow-x-clip pr-4 text-right">{info.size}</span>
      <span className="hl-option w-36 overflow-x-clip whitespace-pre pr-4 text-right font-sans">
        {info.date} {info.time.slice(0, -3)}
      </span>
      {/* TODO: file hilight depending on permissions */}
      <span
        className={`overflow-x-clip overflow-ellipsis ${fileColor(info.permissions)}`}
      >
        {info.name}
      </span>
    </div>
  )
}
