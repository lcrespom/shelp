import { invoke } from '@tauri-apps/api/core'
import { getCurrentWindow } from '@tauri-apps/api/window'

import { getDirHistory, relativeToAbsolute } from '../commands/dirhistory'
import MatchHighlight from '../components/match-highlight'
import SelectList from '../components/select-list'

function handleSelection(dir: string) {
  invoke('send_response', { data: relativeToAbsolute(dir) })
  getCurrentWindow().hide()
}

export default function DirHistory() {
  return (
    <div className="dirhistory">
      <SelectList
        list={getDirHistory()}
        rowComponent={MatchHighlight}
        selectionHandler={handleSelection}
      />
    </div>
  )
}
