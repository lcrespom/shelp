import { getDirInfo } from '../commands/file-search'

type DirEntryProps = {
  line: string
  filterWords: string[]
}

export default function DirEntry(props: DirEntryProps) {
  let info = getDirInfo(props.line)
  return (
    <>
      {info.permissions} | {info.user} {info.group} | {info.size} | {info.date},{' '}
      {info.time.slice(0, -3)} | {info.name}
    </>
  )
}
