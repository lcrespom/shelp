import { invoke } from '@tauri-apps/api/core'
import { getCurrentWindow } from '@tauri-apps/api/window'

function close() {
  invoke('send_response', { data: '' })
  getCurrentWindow().hide()
}

export default function FileSearch() {
  return (
    <div className="file-search">
      <h1 className="mb-4 text-2xl">ToDo file search</h1>
      <button onClick={close}>Close</button>
    </div>
  )
}
