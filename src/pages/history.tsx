import { useEffect, useState } from 'react'
import SelectList from '../components/select-list'
import { highlight, ParserHighlight } from '../helpers/highlight'

type HighlightMap = Map<string, ParserHighlight[]>

let history: string[] = []
let selectFilter = ''
let highlightTable: HighlightMap

export async function setHistory(hist: string[], filter: string) {
  // Remove empty lines and duplicates.
  // The list is reversed so that duplicates at removed at the start of the list.
  history = hist
    .reverse()
    .filter((item, idx) => item && hist.indexOf(item) === idx)
    .reverse()
  selectFilter = filter
}

async function updateHighlights(history: string[]) {
  if (!highlightTable) highlightTable = new Map()
  for (let line of history) {
    if (highlightTable.get(line)) continue
    let segments = await highlight(line)
    highlightTable.set(line, segments)
  }
}

export default function History() {
  let [highlights, setHighlights] = useState<HighlightMap>(highlightTable)

  useEffect(() => {
    setTimeout(async () => {
      await updateHighlights(history)
      setHighlights(highlightTable)
    }, 0)
  }, [])

  return (
    <div className="history">
      <SelectList list={history} selectFilter={selectFilter} highlightMap={highlights} />
    </div>
  )
}
