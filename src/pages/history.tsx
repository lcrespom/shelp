import SelectList from '../components/select-list'

let history: string[] = []

export function setHistory(hist: string[]) {
  history = hist.filter((item, idx) => item && hist.indexOf(item) === idx)
}

export default function History() {
  return (
    <div className="history">
      <SelectList list={history} />
    </div>
  )
}
