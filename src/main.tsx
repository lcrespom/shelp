import React from 'react'
import ReactDOM from 'react-dom/client'
import { RouterProvider } from 'react-router-dom'
import { invoke } from '@tauri-apps/api/core'

import { router } from './router'
import { listenTauriEvents } from './tauri-events'
import { initDirHistory } from './commands/dirhistory'
import { getCurrentWindow, Window as TauriWindow } from '@tauri-apps/api/window'
import ShelpZsh from './assets/shelp.zsh?raw'

//#region ------------------------- React setup -------------------------

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>
)

//#region ------------------------- App startup -------------------------

function handleWindowHide() {
  let cw = getCurrentWindow()
  document.addEventListener('keyup', evt => {
    if (evt.key == 'Escape' || evt.code == 'Escape') hideWindow(cw)
  })
  cw.listen('tauri://close-requested', _ => hideWindow(cw))
}

function hideWindow(w: TauriWindow) {
  invoke('send_response', { data: '' })
  w.hide()
}

async function initDotShelp() {
  let shelp_zsh = await invoke('get_file', { name: 'shelp.zsh' })
  if (shelp_zsh) return
  console.log('~/.shelp/shelp.zsh not found, creating default file')
  invoke('write_file', { name: 'shelp.zsh', data: ShelpZsh })
}

function startup() {
  listenTauriEvents()
  initDirHistory()
  handleWindowHide()
  initDotShelp()
}

startup()
