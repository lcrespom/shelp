export type MatchSegment = {
  from: number
  to: number
}

export function multiMatch(line: string, words: string[]) {
  let ltlc = line.toLowerCase()
  for (let w of words) {
    if (!ltlc.includes(w.toLowerCase())) return false
  }
  return true
}

export function multiSegments(line: string, words: string[]): MatchSegment[] {
  let ltlc = line.toLowerCase()
  let segments: MatchSegment[] = []
  for (let w of words) {
    let pos = 0
    do {
      pos = ltlc.indexOf(w.toLowerCase(), pos)
      if (pos >= 0) {
        segments.push({ from: pos, to: pos + w.length - 1 })
        pos += w.length
      }
    } while (pos >= 0)
  }
  return segments
}
