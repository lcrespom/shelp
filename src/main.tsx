import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App'
import { listenTauriEvents } from './tauri-events'

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
)

listenTauriEvents()
