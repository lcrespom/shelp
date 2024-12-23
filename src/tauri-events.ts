import { listen } from '@tauri-apps/api/event'
import { invoke, isTauri } from '@tauri-apps/api/core'
import { getCurrentWindow } from '@tauri-apps/api/window'

import {
  addDirToHistory,
  getDirHistory,
  setDirHistoryHomeDirectory,
  setDirHistoryWorkingDirectory,
} from './commands/dirhistory'
import { router } from './router'
import { refreshApp } from './App'
import { setHistory } from './pages/history'
import {
  fileSearchMatch,
  immediateFileSearchMatch,
  initFileSearch,
} from './commands/file-search'

type CommandPayload = {
  url: string
  body: string
}

type CommandParams = Record<string, string>

//#region ------------------------- Command handling -------------------------
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

async function runCommand(cmd: CommandPayload) {
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
    if (title instanceof Promise) title = await title
    if (title !== undefined) {
      let cw = getCurrentWindow()
      if (title.length) await cw.setTitle(title)
      await cw.show()
      await cw.setFocus()
    }
  }
}

function navigateAndRefresh(path: string) {
  router.navigate(path)
  refreshApp()
}
//#endregion

//#region ------------------------- Commands -------------------------
const commands: Record<string, Function> = {
  // Called when the user changes directory
  chpwd(params: CommandParams) {
    if (params.dir) addDirToHistory(params.dir)
    else console.warn('chpwd: no dir parameter in URL')
    invoke('send_response', { data: '' })
  },

  // Navigate to route with list of directories and a search input
  dirHistory(params: CommandParams) {
    setDirHistoryHomeDirectory(params.home)
    setDirHistoryWorkingDirectory(params.pwd)
    navigateAndRefresh('/dirhistory')
    console.log(getDirHistory())
    return 'Dir History'
  },

  // Navigate to route with list of recent commands and a search input
  history(params: CommandParams, body: string) {
    console.log('History filter:', params.filter)
    setHistory(body.split('\n'), params.filter)
    navigateAndRefresh('/history')
    return 'Command History'
  },

  // Navigate to route with directory contents and a search input
  async filesearch(params: CommandParams) {
    await initFileSearch(params.filter, params.pwd)
    let match = immediateFileSearchMatch()
    if (match != undefined) {
      invoke('send_response', { data: fileSearchMatch(match) })
    } else {
      navigateAndRefresh('/filesearch')
      return ''
    }
  },

  // Set dark theme
  darkTheme() {
    getCurrentWindow().setTheme('dark')
    invoke('send_response', { data: 'Dark theme set' })
  },

  // Set light theme
  lightTheme() {
    getCurrentWindow().setTheme('light')
    invoke('send_response', { data: 'Light theme set' })
  },

  // Welcome page
  welcome() {
    router.navigate('/')
    return 'Welcome to shelp'
  },
}
//#endregion
