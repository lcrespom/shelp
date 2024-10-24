import { invoke } from '@tauri-apps/api/core'

const MAX_ENTRIES = 200

let dirHistory: string[] = []
let workingDirectory = ''
let homeDirectory = ''

export async function addDirToHistory(path: string) {
  dirHistory = dirHistory.filter(dir => dir != path)
  if (dirHistory.length >= MAX_ENTRIES) dirHistory.shift()
  dirHistory.push(path)
  console.log(`Dir ${path} added to dirHistory`)
  invoke('write_file', { name: 'dirHistory', data: dirHistory.join('\n') })
}

export function getDirHistory() {
  let dh = [...dirHistory]
  // Remove last directory if it's the same as the current directory
  if (dh.at(-1) == workingDirectory) dh.pop()
  // Replace full path to home directory with "~"
  return dh.map(dir => {
    if (dir.startsWith(homeDirectory)) return '~' + dir.substring(homeDirectory.length)
    else return dir
  })
}

export async function initDirHistory() {
  let fileData: string = await invoke('get_file', { name: 'dirHistory' })
  dirHistory = fileData.split('\n').filter(d => d)
}

export function setDirHistoryWorkingDirectory(pwd: string) {
  workingDirectory = pwd
}

export function setDirHistoryHomeDirectory(home: string) {
  homeDirectory = home
}

export function relativeToAbsolute(dir: string) {
  if (dir.startsWith('~')) dir = homeDirectory + dir.substring(1)
  return dir
}
