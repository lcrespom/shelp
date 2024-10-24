import { getDirInfo } from '../commands/file-search'
import MatchHighlight from './match-highlight'

type DirEntryProps = {
  line: string
  filterWords: string[]
}

function fileColor(permissions: string) {
  if (permissions[0] == 'd') return 'hl-parameter'
  if (permissions.includes('x')) return 'hl-assignment'
  else return 'hl-program'
}

// function AccessPermissions({ rwx }: { rwx: string }) {
//   return (
//     <>
//       <span className="hl-alias">{rwx[0]}</span>
//       <span className="hl-quote">{rwx[1]}</span>
//       <span className="hl-assignment">{rwx[2]}</span>
//     </>
//   )
// }

export default function DirEntry(props: DirEntryProps) {
  let info = getDirInfo(props.line)
  return (
    <div className="dir-entry flex">
      {/* <span className="dir-permissions">
        <span className="hl-parameter">{info.permissions[0]}</span>
        <AccessPermissions rwx={info.permissions.substring(1)} />
        <AccessPermissions rwx={info.permissions.substring(4)} />
        <AccessPermissions rwx={info.permissions.substring(7)} />
      </span> */}
      <span className="dir-permissions">{info.permissions}</span>
      <span className="dir-user">{info.user}</span>
      <span className="dir-group">{info.group}</span>
      <span className="dir-size">{info.size}</span>
      <span className="dir-date">
        {info.date} {info.time.slice(0, -3)}
      </span>
      <span className={`dir-file ${fileColor(info.permissions)}`}>
        <MatchHighlight line={info.name} filterWords={props.filterWords} />
      </span>
    </div>
  )
}
