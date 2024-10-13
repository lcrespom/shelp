import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App'
import { listenTauriEvents } from './tauri-events'
import { initDirHistory } from './commands/dirhistory'

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
)

listenTauriEvents()
initDirHistory()
