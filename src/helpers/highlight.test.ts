import { expect, test } from 'vitest'
import { highlight } from './highlight'

test('bash-parser', async _ => {
  let line = 'git commit -am "Removed $EGG redundant span"; git push $POTATO onion'
  expect(await highlight(line)).toEqual([
    { type: 'program', start: 0, end: 2 },
    { type: 'parameter', start: 4, end: 9 },
    { type: 'option', start: 11, end: 13 },
    { type: 'quote', start: 15, end: 43 },
    { type: 'program', start: 46, end: 48 },
    { type: 'parameter', start: 50, end: 53 },
    { type: 'environment', start: 55, end: 61 },
    { type: 'parameter', start: 63, end: 67 },
  ])
  expect(await highlight('git remote -v')).toEqual([
    { type: 'program', start: 0, end: 2 },
    { type: 'parameter', start: 4, end: 9 },
    { type: 'option', start: 11, end: 12 },
  ])
})

test('Syntax error', async _ => {
  let line = `bounds=$(osascript -e 'tell application (path to frontmost application as text) to get bounds of front window')`
  expect(await highlight(line)).toEqual([
    { type: 'assignment', start: 0, end: 20 },
    { type: 'unknown', start: 21, end: 110 },
  ])
})
