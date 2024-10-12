import { listen } from '@tauri-apps/api/event'
import { isTauri } from '@tauri-apps/api/core'

export function listenTauriEvents() {
  if (isTauri()) {
    listen<string>('tash-command', event => {
      console.log('Got command:', event)
      runCommand(event.payload)
    })
    console.log('Listening to tash-command events')
  } else {
    console.log('Tauri not detected (maybe running directly from browser?)')
  }
}

function runCommand(cmd: string) {
  let [verb, query] = cmd.substring(1).split('?')
  let params = new URLSearchParams(query || '')
  if (!commands[verb]) console.warn('Unrecognized command')
  else commands[verb](params)
}

const commands: Record<string, Function> = {
  // Called when the user changes directory
  chpwd(params: URLSearchParams) {
    console.log(`ToDo: add ${params.get('dir')} to dirHistory`)
  },
}
