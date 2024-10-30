import { invoke } from '@tauri-apps/api/core'
import { getCurrentWindow } from '@tauri-apps/api/window'

import {
  fileSearchMatch,
  getDirInfo,
  getDirLines,
  getSelectFilter,
  navigateFileSearch,
} from '../commands/file-search'
import DirEntry from '../components/dir-entry'
import SelectList from '../components/select-list'

function withModifierKey(evt: React.KeyboardEvent | React.MouseEvent) {
  return evt.shiftKey || evt.altKey || evt.ctrlKey || evt.metaKey
}

function isDirectory(file: string) {
  return getDirInfo(file).permissions.startsWith('d')
}

function shouldOpenSubdirectory(file: string, evt: React.UIEvent) {
  let natEvt = evt.nativeEvent
  if (!(natEvt instanceof KeyboardEvent || natEvt instanceof MouseEvent)) return false
  if (!withModifierKey(evt as React.KeyboardEvent | React.MouseEvent)) return false
  if (natEvt instanceof KeyboardEvent && (evt as React.KeyboardEvent).code != 'Enter')
    return false
  else if (natEvt instanceof MouseEvent && (evt as React.MouseEvent).button != 0)
    return false
  return isDirectory(file)
}

function handleSelection(file: string, evt: React.UIEvent) {
  if (shouldOpenSubdirectory(file, evt)) {
    navigateFileSearch(file)
  } else {
    invoke('send_response', { data: fileSearchMatch(file) })
    getCurrentWindow().hide()
  }
}

function handleExtraKeys(file: string, evt: React.KeyboardEvent) {
  if (evt.code == 'ArrowLeft') {
    navigateFileSearch('..')
    return true
  } else if (evt.code == 'ArrowRight' && isDirectory(file)) {
    navigateFileSearch(file)
    return true
  }
  return false
}

export default function FileSearch() {
  return (
    <SelectList
      list={getDirLines()}
      selectFilter={getSelectFilter()}
      rowComponent={DirEntry}
      selectionHandler={handleSelection}
      keyboardHandler={handleExtraKeys}
    />
  )
}
