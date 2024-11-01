import { invoke } from '@tauri-apps/api/core'
import { refreshApp } from '../App'
import { getCurrentWindow } from '@tauri-apps/api/window'

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
  // Setup filter and dir
  let filterWords = filter.split(' ')
  selectFilter = filterWords.pop() || ''
  beforeFilter = filterWords.join(' ')
  // Read directory
  pwd = workingDir
  fullPath = computeFullPath(workingDir)
  console.log({ dirs, beforeFilter, selectFilter, fullPath })
  let dirLines: string = await invoke('get_dir', { data: fullPath })
  setDirContents(dirLines)
  refreshApp()
  await updateWindowTitle()
}

export async function navigateFileSearch(dir: string) {
  fullPath = normalizePath(fullPath + '/' + dir)
  console.log({ dir, pwd, fullPath })
  console.log('>>> Invoking get_dir for directory', fullPath)
  let dirLines: string = await invoke('get_dir', { data: fullPath })
  console.log('>>> Got dirLines:', dirLines)
  selectFilter = '' // Cleaning the search filter when navigating improves usability
  setDirContents(dirLines)
  refreshApp()
  await updateWindowTitle()
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
 *  - an empty string if there is no fuzzy match whatsoever (pending beep)
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
  if (fullPath.endsWith('/')) fullPath = fullPath.slice(0, -1)
  let dir = computeRelativePath(pwd, fullPath)
  return beforeFilter + ' ' + dir + match + lastChar
}
//#endregion

//#region ------------------------- Internal implementations -------------------------

async function updateWindowTitle() {
  let cw = getCurrentWindow()
  await cw.setTitle('File Search: ' + fullPath)
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
  // Convert it into an object ind  exed by file name
  dirs = dirList.reduce((dirs: DirInfoTable, dinfo: DirInfo) => {
    dirs[dinfo.name] = dinfo
    return dirs
  }, {})
  // Create a list of file names, to be used by the SelectList widget
  lines = dirList.map(dinfo => dinfo.name)
}

function isDir(file: string): boolean {
  return dirs[file] && dirs[file].permissions[0] == 'd'
}

function normalizePath(path: string) {
  path = path.replace(/\/\//g, '/')
  let base = window.location.origin + '/'
  return new URL(path, base).pathname
}

function computeFullPath(workingDir: string): string {
  // Filter does not contain any directory
  if (!selectFilter.includes('/')) return workingDir
  // Split dir part and file part
  let parts = selectFilter.split('/')
  let filePart = parts.pop() || ''
  let dirPart = parts.join('/')
  selectFilter = filePart
  // Filter is an absolute path
  if (dirPart.startsWith('/')) return dirPart
  // Filter is a relative path
  return workingDir + '/' + dirPart
}

function computeRelativePath(currentDir: string, absoluteDir: string) {
  // In working directory, no relative path needed
  if (absoluteDir == currentDir) return ''
  // Edge case: root dir
  if (absoluteDir == '') return '/'
  // User went deeper inside: relative path
  if (absoluteDir.startsWith(currentDir))
    return absoluteDir.substring(currentDir.length + 1) + '/'
  // User went above but not sideways: use '../'
  if (currentDir.startsWith(absoluteDir)) {
    let numParents = currentDir.split('/').length - absoluteDir.split('/').length
    return '../'.repeat(numParents)
  }
  // "Sideways" navigation: compute nice relative path, use absolute path if required
  let segmentCount = 0
  let currDirSegments = currentDir.split('/')
  let absDirSegments = absoluteDir.split('/')
  while (currDirSegments[segmentCount] == absDirSegments[segmentCount]) segmentCount++
  if (segmentCount <= 1) return absoluteDir + '/'
  let upSegments = '../'.repeat(currDirSegments.length - segmentCount)
  let otherBranch = absDirSegments.slice(segmentCount).join('/') + '/'
  return upSegments + otherBranch
}
//#endregion
