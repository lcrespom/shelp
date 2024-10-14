import React from 'react'
import ReactDOM from 'react-dom/client'
import { RouterProvider } from 'react-router-dom'

import { router } from './router'
import { listenTauriEvents } from './tauri-events'
import { initDirHistory } from './commands/dirhistory'

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>
)

listenTauriEvents()
initDirHistory()
