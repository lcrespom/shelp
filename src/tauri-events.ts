import { listen } from '@tauri-apps/api/event'
import { isTauri } from '@tauri-apps/api/core'

export function listenTauriEvents() {
  if (isTauri()) {
    listen<string>('tash-command', event => {
      console.log('Got event:', event)
    })
    console.log('Listening to tash-command events')
  } else {
    console.log('Tauri not detected (maybe running directly from browser?)')
  }
}
