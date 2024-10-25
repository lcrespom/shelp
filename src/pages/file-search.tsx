import { invoke } from '@tauri-apps/api/core'
import {
  fileSearchMatch,
  getDirInfo,
  getDirLines,
  getSelectFilter,
} from '../commands/file-search'
import DirEntry from '../components/dir-entry'
import SelectList from '../components/select-list'
import { getCurrentWindow } from '@tauri-apps/api/window'
import React from 'react'

function withModifierKey(evt: React.KeyboardEvent | React.MouseEvent) {
  return evt.shiftKey || evt.altKey || evt.ctrlKey || evt.metaKey
}

function openSubdirectory(file: string, evt: React.UIEvent) {
  let natEvt = evt.nativeEvent
  if (!(natEvt instanceof KeyboardEvent || natEvt instanceof MouseEvent)) return false
  if (!withModifierKey(evt as React.KeyboardEvent | React.MouseEvent)) return false
  if (natEvt instanceof KeyboardEvent && (evt as React.KeyboardEvent).code != 'Enter')
    return false
  else if (natEvt instanceof MouseEvent && (evt as React.MouseEvent).button != 0)
    return false
  let dirInfo = getDirInfo(file)
  return dirInfo.permissions.startsWith('d')
}

function handleSelection(file: string, evt: React.UIEvent) {
  if (openSubdirectory(file, evt)) {
    invoke('send_response', { data: '>>>' + file + '/' })
  } else {
    invoke('send_response', { data: fileSearchMatch(file) })
  }
  getCurrentWindow().hide()
}

export default function FileSearch() {
  return (
    <SelectList
      list={getDirLines()}
      selectFilter={getSelectFilter()}
      rowComponent={DirEntry}
      selectionHandler={handleSelection}
    />
  )
}
