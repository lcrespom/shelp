import { expect, test } from 'vitest'
import { mergeSegments, multiMatch, multiSegments } from './multisearch'

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
