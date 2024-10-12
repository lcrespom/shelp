import { useState } from 'react'
import { invoke } from '@tauri-apps/api/core'
export default function Demo() {
  const [greetMsg, setGreetMsg] = useState('')
  const [name, setName] = useState('')

  async function greet() {
    // Learn more about Tauri commands at https://tauri.app/v1/guides/features/command
    setGreetMsg(await invoke('greet', { name }))
  }

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
