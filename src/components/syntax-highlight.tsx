import { ParserHighlight } from '../helpers/highlight'

type SyntaxHighlightProps = {
  line: string
  highlightMap: Map<string, ParserHighlight[]>
}

export default function SyntaxHighlight(props: SyntaxHighlightProps) {
  let parts = props.highlightMap.get(props.line)
  return (
    <>
      {parts ? (
        parts.map((part, idx) => (
          <span key={idx}>
            <span className={`hl-${part.type}`}>
              {props.line.substring(part.start, part.end + 1)}
            </span>
            {parts[idx + 1]
              ? props.line.substring(part.end + 1, parts[idx + 1].start)
              : ''}
          </span>
        ))
      ) : (
        <b>{props.line}</b>
      )}
    </>
  )
}
