import { ParserHighlight } from '../helpers/highlight'

type SyntaxHighlightProps = {
  line: string
  highlightMap: Map<string, ParserHighlight[]>
}

function textSegment(
  line: string,
  part: ParserHighlight,
  nextPart: ParserHighlight
): string {
  let txt = line.substring(part.start, part.end + 1)
  if (nextPart) txt += line.substring(part.end + 1, nextPart.start)
  return txt
}

export default function SyntaxHighlight(props: SyntaxHighlightProps) {
  let parts = props.highlightMap.get(props.line)
  return (
    <>
      {parts ? (
        parts.map((part, idx) => (
          <span className={`hl-${part.type}`} key={idx}>
            {textSegment(props.line, part, parts[idx + 1])}
          </span>
        ))
      ) : (
        <b>Line not found: {props.line}</b>
      )}
    </>
  )
}
