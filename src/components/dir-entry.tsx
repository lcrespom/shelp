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
    <div className="dir-entry flex">
      <span className="dir-permissions">{info.permissions}</span>
      <span className="dir-user">{info.user}</span>
      <span className="dir-group">{info.group}</span>
      <span className="dir-size">{info.size}</span>
      <span className="dir-date">
        {info.date} {info.time.slice(0, -3)}
      </span>
      <span className={`dir-file ${fileColor(info.permissions)}`}>{info.name}</span>
    </div>
  )
}
