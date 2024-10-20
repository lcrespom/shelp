import { getDirHistory } from '../commands/dirhistory'
import SelectList from '../components/select-list'

export default function DirHistory() {
  return (
    <div className="dirhistory">
      <SelectList list={getDirHistory().slice(0, -1)} />
    </div>
  )
}
