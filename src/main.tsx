import React from 'react'
import ReactDOM from 'react-dom/client'
import { RouterProvider } from 'react-router-dom'
import { invoke } from '@tauri-apps/api/core'

import { router } from './router'
import { listenTauriEvents } from './tauri-events'
import { initDirHistory } from './commands/dirhistory'
import { getCurrentWindow } from '@tauri-apps/api/window'

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>
)

listenTauriEvents()
initDirHistory()

document.addEventListener('keyup', evt => {
  if (evt.key == 'Escape' || evt.code == 'Escape') {
    invoke('send_response', { data: '' })
    getCurrentWindow().hide()
  }
})
