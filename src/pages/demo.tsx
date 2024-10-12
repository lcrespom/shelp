import { useEffect, useState } from 'react'
import { invoke } from '@tauri-apps/api/core'
import { listen } from '@tauri-apps/api/event'

function listenTauriEvents() {
  listen<string>('tash-command', event => {
    console.log('Got event:', event)
  })
  console.log('Listening to tash-command events')
}

export default function Demo() {
  const [greetMsg, setGreetMsg] = useState('')
  const [name, setName] = useState('')

  async function greet() {
    // Learn more about Tauri commands at https://tauri.app/v1/guides/features/command
    setGreetMsg(await invoke('greet', { name }))
  }

  useEffect(listenTauriEvents, []) // Empty array ensures this effect runs only once after the first render

  return (
    <div>
      <form
        onSubmit={e => {
          e.preventDefault()
          greet()
        }}
      >
        <input
          id="greet-input"
          autoFocus
          onChange={e => setName(e.currentTarget.value)}
          placeholder="Enter a name..."
        />
        &nbsp;&nbsp;
        <button type="submit">Greet</button>
      </form>

      <p>{greetMsg}</p>
    </div>
  )
}
