export type MatchSegment = {
  from: number
  to: number
}

export type MatchItem = {
  text: string
  isMatch: boolean
}

export function splitWords(line: string): string[] {
  return sanitizeWords(line.split(' '))
}

/** Checks if a line contains all words in an array, case insensitive. */
export function multiMatch(line: string, words: string[]) {
  let ltlc = line.toLowerCase()
  for (let w of words) {
    if (!ltlc.includes(w.toLowerCase())) return false
  }
  return true
}

/** Looks for the appearance of one or more words inside a line, case insensitive.
 * Returns a list of segments (start and end of word) where the match is found.
 */
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
    // src_segment starts inside segments[i]
    if (insideSegment(src_segment.from, segments[i])) return i
    // src_segment ends inside segments[i]
    if (insideSegment(src_segment.to, segments[i])) return i
    // segments[i] is fully inside src_segment
    if (insideSegment(segments[i].from, src_segment)) return i
  }
  return -1
}

function mergeSegmentPair(segA: MatchSegment, segB: MatchSegment): MatchSegment {
  return {
    from: Math.min(segA.from, segB.from),
    to: Math.max(segA.to, segB.to),
  }
}

/** Merges an array of potentially overlapping segments.
 * Returns an array of merged segments, where there is no overlap between them.
 */
export function mergeSegments(src: MatchSegment[]): MatchSegment[] {
  let dst: MatchSegment[] = []
  while (src.length > 0) {
    // Pop a segment from the source array
    let src_segment = src.pop()
    if (!src_segment) break
    // Check if the source segment overlaps with a segment in the destination array
    let overlapIdx = findOverlap(src_segment, dst)
    if (overlapIdx >= 0) {
      // If it overlaps, merge it, remove the overlapping segment from the destination
      // array, and push the merged segment back to the source array.
      let dst_segment = dst[overlapIdx]
      dst.splice(overlapIdx, 1)
      src.push(mergeSegmentPair(src_segment, dst_segment))
    } else {
      // If the source segment does not overlap with any segment in the destination
      // array, it can be safely added to it.
      dst.push(src_segment)
    }
  }
  return dst
}

function sanitizeWords(words: string[]): string[] {
  // Remove duplicate entries
  return [
    ...new Set(
      // Remove empty words
      words.filter(w => !!w)
    ),
  ]
}

/** Splits a line into segments that either match one of the search words or don't. */
export function splitMatch(line: string, words: string[]): MatchItem[] {
  let items: MatchItem[] = []
  let segments = mergeSegments(multiSegments(line, words)).sort((a, b) => a.from - b.from)
  let pos = 0
  for (let segment of segments) {
    if (pos < segment.from) {
      items.push({ text: line.substring(pos, segment.from), isMatch: false })
    }
    items.push({ text: line.substring(segment.from, segment.to + 1), isMatch: true })
    pos = segment.to + 1
  }
  if (pos < line.length - 1) items.push({ text: line.substring(pos), isMatch: false })
  return items
}
