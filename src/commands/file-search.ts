import { invoke } from '@tauri-apps/api/core'
import { refreshApp } from '../App'

export type DirInfo = {
  permissions: string
  user: string
  size: string
  modified: string
  name: string
}

type DirInfoTable = Record<string, DirInfo>

let lines: string[]
let dirs: DirInfoTable
let selectFilter = ''
let beforeFilter = ''
let pwd = ''
let fullPath = ''

//#region ------------------------- Exported functions -------------------------

export async function initFileSearch(filter: string, workingDir: string) {
  let dirLines: string = await invoke('get_dir', { data: workingDir })
  setDirContents(dirLines)
  // Setup filter and dir
  let filterWords = filter.split(' ')
  selectFilter = filterWords.pop() || ''
  beforeFilter = filterWords.join(' ')
  pwd = workingDir
  fullPath = pwd
  console.log({ dirs, beforeFilter, selectFilter, pwd })
}

export async function navigateFileSearch(dir: string) {
  fullPath = normalizePath(fullPath + '/' + dir)
  console.log({ dir, pwd, fullPath })
  console.log('>>> Invoking get_dir for directory', fullPath)
  let dirLines: string = await invoke('get_dir', { data: fullPath })
  console.log('>>> Got dirLines:', dirLines)
  setDirContents(dirLines)
  refreshApp()
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
  //TODO match in subdirectories
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
  let lastChar = isDir(match) ? '/' : ' '
  let prefix = ''
  if (fullPath.endsWith('/')) fullPath = fullPath.slice(0, -1)
  if (fullPath == pwd) {
    // User is in his working directory, no prefix needed
  } else if (fullPath.startsWith(pwd)) {
    // User went deeper: relative path
    prefix = fullPath.substring(pwd.length + 1) + '/'
  } else if (pwd.startsWith(fullPath)) {
    // User went above but not sideways: use ..
    prefix = '../'.repeat(pwd.split('/').length - fullPath.split('/').length)
  } else {
    // Could compute nice relative path, but let's just use absolute path
    prefix = fullPath + '/'
  }
  return beforeFilter + ' ' + prefix + match + lastChar
}
//#endregion

//#region ------------------------- Internal implementations -------------------------

function isDir(file: string): boolean {
  return dirs[file] && dirs[file].permissions[0] == 'd'
}

function lineToDirInfo(line: string): DirInfo {
  let [permissions, user, size, modified, ...rest] = line.split(' ').filter(w => !!w)
  let name = rest.join(' ')
  permissions = permissions.substring(0, 10)
  modified = new Date(+modified).toLocaleString().slice(0, -3).replace(',', '')
  size = readableSize(+size)
  return { permissions, user, size, modified, name }
}

function readableSize(size: number): string {
  const fitSize = (size: number) => (size < 10 ? size.toFixed(1) : Math.round(size))
  if (size < 1_000) return size + ' B'
  if (size < 1_000_000) return fitSize(size / 1024) + ' K'
  if (size < 1_000_000_000) return fitSize(size / (1024 * 1024)) + ' M'
  return fitSize(size / (1024 * 1024 * 1024)) + ' G'
}

function setDirContents(buffer: string) {
  // Prepare a list of DirInfo entries
  let dirList = buffer
    .split('\n')
    .filter(l => !!l) // Remove empty lines, if any
    .map(lineToDirInfo)
    .sort((a, b) => (a.name < b.name ? -1 : +1))
  // Convert it into an object indexed by file name
  dirs = dirList.reduce((dirs: DirInfoTable, dinfo: DirInfo) => {
    dirs[dinfo.name] = dinfo
    return dirs
  }, {})
  // Create a list of file names, to be used by the SelectList widget
  lines = dirList.map(dinfo => dinfo.name)
}

function normalizePath(path: string) {
  path = path.replace(/\/\//g, '/')
  let base = window.location.origin + '/'
  return new URL(path, base).pathname
}
//#endregion
