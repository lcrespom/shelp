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
  let params
  if (query) {
    if (query.startsWith('json=')) params = JSON.parse(query.substring(5))
    else if (query.startsWith('text=')) params = query.substring(5)
    else params = Object.fromEntries(new URLSearchParams(query).entries())
  }
  if (!commands[verb]) console.warn('Unrecognized command')
  else commands[verb](params)
}

const commands: Record<string, Function> = {
  // Called when the user changes directory
  chpwd(params: Record<string, any>) {
    let path = params.dir
    if (path) addDirToHistory(path)
    else console.warn('chpwd: no dir parameter in URL')
  },

  // Navigate to route with list of directories and a search input
  dirHistory() {
    console.log(
      'ToDo dirHistory: navigate to route with list of directories and a search input'
    )
    window.history.pushState({}, '', '/dirhistory')
    console.log(getDirHistory())
  },
}
