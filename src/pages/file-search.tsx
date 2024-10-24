import { invoke } from '@tauri-apps/api/core'
import { fileSearchMatch, getDirLines, getSelectFilter } from '../commands/file-search'
import DirEntry from '../components/dir-entry'
import SelectList from '../components/select-list'
import { getCurrentWindow } from '@tauri-apps/api/window'

function handleSelection(file: string) {
  invoke('send_response', { data: fileSearchMatch(file) })
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
