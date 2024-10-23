import { getDirInfo } from '../commands/file-search'
import SelectList from '../components/select-list'

export default function FileSearch() {
  return <SelectList list={getDirInfo().map(di => di.name)} />
}
