import { ParserHighlight } from '../helpers/highlight'
import MatchHighlight from './match-highlight'

type SyntaxHighlightProps = {
  line: string
  highlightMap: Map<string, ParserHighlight[]>
  filterWords: string[]
}

export default function SyntaxHighlight(props: SyntaxHighlightProps) {
  let parts = props.highlightMap.get(props.line)
  return (
    <>
      {parts ? (
        parts.map((part, idx) => (
          <span key={idx}>
            <span className={`hl-${part.type}`}>
              <MatchHighlight
                line={props.line.substring(part.start, part.end + 1)}
                filterWords={props.filterWords}
              />
            </span>
            {parts[idx + 1] ? (
              <MatchHighlight
                line={props.line.substring(part.end + 1, parts[idx + 1].start)}
                filterWords={props.filterWords}
              />
            ) : (
              ''
            )}
          </span>
        ))
      ) : (
        <b>{props.line}</b>
      )}
    </>
  )
}
