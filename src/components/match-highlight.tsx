import { splitMatch } from '../helpers/multisearch'

type MatchHighlightProps = {
  line: string
  filterWords: string[]
}

export default function MatchHighlight(props: MatchHighlightProps) {
  if (props.filterWords.length == 0) return <>{props.line}</>
  let parts = splitMatch(props.line, props.filterWords)
  return <>{parts.map(part => (part.isMatch ? <i>{part.text}</i> : part.text))}</>
}
