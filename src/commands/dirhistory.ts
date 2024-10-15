import { invoke } from '@tauri-apps/api/core'

const MAX_ENTRIES = 200

let dirHistory: string[] = []

export function addDirToHistory(path: string) {
  dirHistory = dirHistory.filter(dir => dir != path)
  if (dirHistory.length >= MAX_ENTRIES) dirHistory.shift()
  dirHistory.push(path)
  console.log(`Dir ${path} added to dirHistory`)
  console.log('ToDo: tell Tauri to write ~/.shelp/.dirHistory')
}

export function getDirHistory() {
  return dirHistory
}

export async function initDirHistory() {
  let fileData: string = await invoke('get_file', { name: 'dirHistory' })
  dirHistory = fileData.split('\n').filter(d => d)
}