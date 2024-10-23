import { getDirLines } from '../commands/file-search'
import DirEntry from '../components/dir-entry'
import SelectList from '../components/select-list'

export default function FileSearch() {
  return <SelectList list={getDirLines()} rowComponent={DirEntry} />
}
