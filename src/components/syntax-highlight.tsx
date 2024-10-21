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
          <span className={`hl-${part.type}`} key={idx}>
            {props.line.substring(part.start, part.end + 2)}
          </span>
        ))
      ) : (
        <b>Line not found: {props.line}</b>
      )}
    </>
  )
}
