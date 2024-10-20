import { useEffect, useState } from 'react'
import { highlight, ParserHighlight } from '../helpers/highlight'

type SyntaxHighlightProps = {
  line: string
}

export default function SyntaxHighlight(props: SyntaxHighlightProps) {
  let [parts, setParts] = useState<ParserHighlight[]>([])

  useEffect(() => {
    ;(async () => {
      setParts(await highlight(props.line))
    })()
  }, [])

  return (
    <>
      {parts.map((part, idx) => (
        <span className={`hl-${part.type}`} key={idx}>
          {props.line.substring(part.start, part.end)}
        </span>
      ))}
    </>
  )
}
