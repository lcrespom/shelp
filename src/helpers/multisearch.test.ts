import { expect, test } from 'vitest'
import { mergeSegments, multiMatch, multiSegments, splitMatch } from './multisearch'

const line = 'Lorem ipsum dolor sit amet'

// #region ------------------------- Multi Match -------------------------

test('Single match', _ => {
  expect(multiMatch(line, [])).toBe(true)
  expect(multiMatch(line, ['lorem'])).toBe(true)
  expect(multiMatch(line, ['lor'])).toBe(true)
  expect(multiMatch(line, ['AMET'])).toBe(true)
  expect(multiMatch(line, ['consectetur'])).toBe(false)
})

test('Multi match', _ => {
  expect(multiMatch(line, ['lorem', 'ipsum'])).toBe(true)
  expect(multiMatch(line, ['sit', 'ipsum'])).toBe(true)
  expect(multiMatch(line, ['lorem', 'adipliscit'])).toBe(false)
})

// #region ------------------------- Multi Segments -------------------------

test('Single segment', _ => {
  expect(multiSegments(line, [])).toEqual([])
  expect(multiSegments(line, ['lorem'])).toEqual([{ from: 0, to: 4 }])
  expect(multiSegments(line, ['ipsum'])).toEqual([{ from: 6, to: 10 }])
})

test('Multiple segments', _ => {
  // Disjointed
  expect(multiSegments(line, ['lorem', 'ipsum'])).toEqual([
    { from: 0, to: 4 },
    { from: 6, to: 10 },
  ])
  // Repeated
  expect(multiSegments(line, ['ipsum', 'ipsum'])).toEqual([
    { from: 6, to: 10 },
    { from: 6, to: 10 },
  ])
  // Reversed order
  expect(multiSegments(line, ['ipsum', 'lorem'])).toEqual([
    { from: 6, to: 10 },
    { from: 0, to: 4 },
  ])
  // Ignore unmatched words
  expect(multiSegments(line, ['ipsum', 'potato'])).toEqual([{ from: 6, to: 10 }])
  // Overlapped
  expect(multiSegments(line, ['ipsu', 'psum'])).toEqual([
    { from: 6, to: 9 },
    { from: 7, to: 10 },
  ])
  // Inverted overlapped
  expect(multiSegments(line, ['psum', 'ipsu'])).toEqual([
    { from: 7, to: 10 },
    { from: 6, to: 9 },
  ])
})

// #region ------------------------- Merge Segments -------------------------

test('Non-overlapping merges', _ => {
  expect(
    mergeSegments([
      { from: 0, to: 5 },
      { from: 6, to: 8 },
    ]).sort((a, b) => a.from - b.from)
  ).toEqual([
    { from: 0, to: 5 },
    { from: 6, to: 8 },
  ])
})

test('Overlapping merges', _ => {
  // Overlap at end
  expect(
    mergeSegments([
      { from: 0, to: 5 },
      { from: 5, to: 8 },
    ])
  ).toEqual([{ from: 0, to: 8 }])
  // Overlap inside
  expect(
    mergeSegments([
      { from: 0, to: 5 },
      { from: 3, to: 8 },
    ])
  ).toEqual([{ from: 0, to: 8 }])
  // Overlap around
  expect(
    mergeSegments([
      { from: 4, to: 5 },
      { from: 3, to: 8 },
    ])
  ).toEqual([{ from: 3, to: 8 }])
  // Overlap across 3 segments
  expect(
    mergeSegments([
      { from: 1, to: 5 },
      { from: 3, to: 7 },
      { from: 6, to: 9 },
    ])
  ).toEqual([{ from: 1, to: 9 }])
  // Overlap one, non-overlap other
  expect(
    mergeSegments([
      { from: 1, to: 4 },
      { from: 3, to: 6 },
      { from: 8, to: 10 },
    ]).sort((a, b) => a.from - b.from)
  ).toEqual([
    { from: 1, to: 6 },
    { from: 8, to: 10 },
  ])
})

// #region ------------------------- Split Segments -------------------------

test('Single split', _ => {
  expect(splitMatch(line, [])).toEqual([
    { isMatch: false, text: 'Lorem ipsum dolor sit amet' },
  ])
  expect(splitMatch(line, ['consectetur'])).toEqual([
    { isMatch: false, text: 'Lorem ipsum dolor sit amet' },
  ])
  expect(splitMatch(line, ['lorem'])).toEqual([
    { isMatch: true, text: 'Lorem' },
    { isMatch: false, text: ' ipsum dolor sit amet' },
  ])
  expect(splitMatch(line, ['AMET'])).toEqual([
    { isMatch: false, text: 'Lorem ipsum dolor sit ' },
    { isMatch: true, text: 'amet' },
  ])
  expect(splitMatch(line, ['dolor'])).toEqual([
    { isMatch: false, text: 'Lorem ipsum ' },
    { isMatch: true, text: 'dolor' },
    { isMatch: false, text: ' sit amet' },
  ])
})

test('Multiple split', _ => {
  expect(splitMatch(line, ['sit', 'ipsum'])).toEqual([
    { isMatch: false, text: 'Lorem ' },
    { isMatch: true, text: 'ipsum' },
    { isMatch: false, text: ' dolor ' },
    { isMatch: true, text: 'sit' },
    { isMatch: false, text: ' amet' },
  ])
  expect(splitMatch(line, ['ipsum', 'potato'])).toEqual([
    { isMatch: false, text: 'Lorem ' },
    { isMatch: true, text: 'ipsum' },
    { isMatch: false, text: ' dolor sit amet' },
  ])
  expect(splitMatch(line, ['ipsum dolor', 'sum dol'])).toEqual([
    { isMatch: false, text: 'Lorem ' },
    { isMatch: true, text: 'ipsum dolor' },
    { isMatch: false, text: ' sit amet' },
  ])
  expect(splitMatch(line, ['', 'lorem', '', ''])).toEqual([
    { isMatch: true, text: 'Lorem' },
    { isMatch: false, text: ' ipsum dolor sit amet' },
  ])
})
