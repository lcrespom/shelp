import SelectList from '../components/select-list'

let history: string[] = []

export function setHistory(hist: string[]) {
  // Remove empty lines and duplicates.
  // The list is reversed so that duplicates at removed at the start of the list.
  history = hist
    .reverse()
    .filter((item, idx) => item && hist.indexOf(item) === idx)
    .reverse()
}

export default function History() {
  return (
    <div className="history">
      <SelectList list={history} />
    </div>
  )
}
