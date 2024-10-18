import React from 'react'
import ReactDOM from 'react-dom/client'
import { RouterProvider } from 'react-router-dom'
import { invoke } from '@tauri-apps/api/core'

import { router } from './router'
import { listenTauriEvents } from './tauri-events'
import { initDirHistory } from './commands/dirhistory'
import { getCurrentWindow } from '@tauri-apps/api/window'
import ShelpZsh from './assets/shelp.zsh?raw'

//#region ------------------------- React setup -------------------------

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>
)

//#region ------------------------- App startup -------------------------

function handleEsc() {
  document.addEventListener('keyup', evt => {
    if (evt.key == 'Escape' || evt.code == 'Escape') {
      invoke('send_response', { data: '' })
      getCurrentWindow().hide()
    }
  })
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
  handleEsc()
  initDotShelp()
}

startup()
