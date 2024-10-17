import { useState, Dispatch, SetStateAction } from 'react'
import { Outlet } from 'react-router-dom'

import './App.css'

let globalSetCount: Dispatch<SetStateAction<number>>

export function refreshApp() {
  globalSetCount(x => x + 1)
}

export default function App() {
  let [count, setCount] = useState(0)
  globalSetCount = setCount
  return (
    <div className="dark:bg-black dark:text-gray-200">
      <Outlet key={count} /> {/* Where child routes will render */}
    </div>
  )
}
