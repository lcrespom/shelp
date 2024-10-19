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

function insideSegment(pos: number, segment: MatchSegment): boolean {
  return pos >= segment.from && pos <= segment.to
}

function findOverlap(src_segment: MatchSegment, segments: MatchSegment[]): number {
  for (let i = 0; i < segments.length; i++) {
    if (insideSegment(src_segment.from, segments[i])) return i
    if (insideSegment(src_segment.to, segments[i])) return i
  }
  return -1
}

function mergeSegmentPair(segA: MatchSegment, segB: MatchSegment): MatchSegment {
  return {
    from: Math.min(segA.from, segB.from),
    to: Math.max(segA.to, segB.to),
  }
}

export function mergeSegments(src: MatchSegment[]): MatchSegment[] {
  let dst: MatchSegment[] = []
  while (src.length > 0) {
    let src_segment = src.pop()
    if (!src_segment) break
    let overlapIdx = findOverlap(src_segment, dst)
    if (overlapIdx >= 0) {
      let dst_segment = dst[overlapIdx]
      dst.splice(overlapIdx, 1)
      src.push(mergeSegmentPair(src_segment, dst_segment))
    } else {
      dst.push(src_segment)
    }
  }
  return dst
}
