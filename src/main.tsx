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
  let shelp_zsh: string = await invoke('get_file', { name: 'shelp.zsh' })
  if (shelp_zsh) return shelp_zsh
  console.log('~/.shelp/shelp.zsh not found, creating default file')
  invoke('write_file', { name: 'shelp.zsh', data: ShelpZsh })
  return ShelpZsh
}

function parseSettings(zsh: string): Record<string, string> {
  let lines = zsh
    .split('\n')
    .map(l => l.split('#')[0].trim())
    .filter(l => l && l.startsWith('SHELP_'))
  let settings: Record<string, string> = {}
  for (let line of lines) {
    let [src, dst] = line.split('=')
    if (!dst || !dst.trim()) continue
    dst = dst.trim()
    if (dst.startsWith('"') && dst.endsWith('"')) dst = dst.slice(1, -1)
    if (dst.startsWith("'") && dst.endsWith("'")) dst = dst.slice(1, -1)
    settings[src.trim().toLowerCase().substring(6)] = dst.trim()
  }
  return settings
}

function initSettings(zsh: string) {
  let settings = parseSettings(zsh)
  console.log('Got settings from shelp.zsh:', settings)
  let cw = getCurrentWindow()
  if (settings.theme == 'light' || settings.theme == 'dark') cw.setTheme(settings.theme)
  if (settings.always_on_top == 'true') cw.setAlwaysOnTop(true)
}

async function startup() {
  listenTauriEvents()
  initDirHistory()
  handleWindowHide()
  let zsh = await initDotShelp()
  initSettings(zsh)
}

startup()
