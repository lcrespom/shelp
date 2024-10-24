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

function openSubdirectory(file: string, evt: React.UIEvent) {
  if (evt.nativeEvent instanceof KeyboardEvent) {
    let kbevt = evt as React.KeyboardEvent
    if (
      kbevt.code == 'Enter' &&
      (kbevt.shiftKey || kbevt.altKey || kbevt.ctrlKey || kbevt.metaKey)
    ) {
      let dirInfo = getDirInfo(file)
      return dirInfo.permissions.startsWith('d')
    }
  }
  return false
}

function handleSelection(file: string, evt: React.UIEvent) {
  if (openSubdirectory(file, evt)) {
    console.log('ToDo: navigate to directory', file)
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
