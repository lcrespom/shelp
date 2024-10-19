import { listen } from '@tauri-apps/api/event'
import { invoke, isTauri } from '@tauri-apps/api/core'
import { getCurrentWindow } from '@tauri-apps/api/window'

import { addDirToHistory, getDirHistory } from './commands/dirhistory'
import { router } from './router'
import { refreshApp } from './App'
import { setHistory } from './pages/history'

type CommandPayload = {
  url: string
  body: string
}

export function listenTauriEvents() {
  if (isTauri()) {
    listen<CommandPayload>('shelp-command', event => {
      console.log('Got command:', event)
      runCommand(event.payload)
    })
    console.log('Listening to shelp-command events')
  } else {
    console.log('Tauri not detected (maybe running directly from browser?)')
  }
}

function runCommand(cmd: CommandPayload) {
  let [verb, query] = cmd.url.substring(1).split('?')
  let params
  if (query) {
    if (query.startsWith('json=')) params = JSON.parse(query.substring(5))
    else if (query.startsWith('text=')) params = query.substring(5)
    else params = Object.fromEntries(new URLSearchParams(query).entries())
  }
  if (!commands[verb]) {
    console.warn('Unrecognized command')
    invoke('send_response', { data: '' })
  } else {
    let title = commands[verb](params, cmd.body)
    if (title !== undefined) {
      let cw = getCurrentWindow()
      cw.setTitle(title || '')
      cw.show()
      cw.setFocus()
    }
  }
}

function navigateAndRefresh(path: string) {
  router.navigate(path)
  refreshApp()
}

const commands: Record<string, Function> = {
  // Called when the user changes directory
  chpwd(params: Record<string, any>) {
    let path = params.dir
    if (path) addDirToHistory(path)
    else console.warn('chpwd: no dir parameter in URL')
    invoke('send_response', { data: '' })
  },

  // Navigate to route with list of directories and a search input
  dirHistory() {
    navigateAndRefresh('/dirhistory')
    console.log(getDirHistory())
    return 'Dir History'
  },

  history(_params: any, body: string) {
    // console.log('ToDo History', body.split('\n'))
    // invoke('send_response', { data: 'ToDo return selected command' })
    setHistory(body.split('\n'))
    navigateAndRefresh('/history')
    return 'Command History'
  },

  // Welcome page
  welcome() {
    router.navigate('/')
    return 'Welcome to shelp'
  },
}
