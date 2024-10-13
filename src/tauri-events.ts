import { listen } from '@tauri-apps/api/event'
import { isTauri } from '@tauri-apps/api/core'
import { addDirToHistory, getDirHistory } from './commands/dirhistory'

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
    let path = params.get('dir')
    if (path) addDirToHistory(path)
    else console.warn('chpwd: no dir parameter in URL')
  },
  // Navigate to route with list of directories and a search input
  dirHistory(_params: URLSearchParams) {
    console.log('ToDo dirHistory')
    console.log(getDirHistory())
  },
}
