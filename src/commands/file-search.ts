export type DirInfo = {
  permissions: string
  links: string
  user: string
  group: string
  size: string
  date: string
  time: string
  name: string
}

type DirInfoTable = Record<string, DirInfo>

let lines: string[]
let dirs: DirInfoTable
let selectFilter = ''
let beforeFilter = ''
let currentDir = ''

function lineToDirInfo(line: string): DirInfo {
  let [permissions, links, user, group, size, month, day, time, year, ...rest] = line
    .split(' ')
    .filter(w => !!w)
  let date = `${month} ${day.padStart(2)} ${year}`
  let name = rest.join(' ')
  permissions = permissions.substring(0, 10)
  if (size) size = size.substring(0, size.length - 1) + ' ' + size[size.length - 1]
  return { permissions, links, user, group, size, date, time, name }
}

export function setDirContents(buffer: string, filter: string, dir: string) {
  // Prepare a list of DirInfo entries
  let dirList = buffer
    .split('\n')
    .filter(l => !!l) // Remove empty lines, if any
    .filter((_l, i) => i >= 2) // Skip first two lines ("total" and ".")
    .map(lineToDirInfo)
  // Convert it into an object indexed by file name
  dirs = dirList.reduce((dirs: DirInfoTable, dinfo: DirInfo) => {
    dirs[dinfo.name] = dinfo
    return dirs
  }, {})
  // Create a list of file names, to be used by the SelectList widget
  lines = dirList.map(dinfo => dinfo.name)
  // Setup filter and dir
  let filterWords = filter.split(' ')
  selectFilter = filterWords.pop() || ''
  beforeFilter = filterWords.join(' ')
  currentDir = dir
  console.log({ dirs, beforeFilter, selectFilter, currentDir })
}

export function getDirInfo(line: string) {
  return dirs[line]
}

export function getDirLines() {
  return lines
}

export function getSelectFilter() {
  return selectFilter
}

/** Matches selectFilter with file list
 * Returns:
 *  - undefined if there is no exact match and the popup should open
 *  - a non-empty string if there is only one file that starts with the selectFilter
 *  - an empty string if there is no fuzzy match whatsoever
 */
export function immediateFileSearchMatch() {
  // If selectFilter is empty, the popup should open
  if (!selectFilter) return
  // If there is only one file that starts with the filter, return it
  let matchedFile = ''
  let matchCount = 0
  for (let match of lines) {
    if (match.toLowerCase().startsWith(selectFilter.toLowerCase())) {
      matchedFile = match
      matchCount++
    }
  }
  if (matchCount === 1) return matchedFile
  // TODO return '' if there is not even a fuzzy match, but then the terminal should beep
}

export function fileSearchMatch(match: string) {
  let lastChar = dirs[match] && dirs[match].permissions[0] == 'd' ? '/' : ' '
  return beforeFilter + ' ' + currentDir + match + lastChar
}
