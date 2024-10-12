import { listen } from '@tauri-apps/api/event'

export function listenTauriEvents() {
  listen<string>('tash-command', event => {
    console.log('Got event:', event)
  })
  console.log('Listening to tash-command events')
}
