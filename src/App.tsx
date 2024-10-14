import { BrowserRouter, Route, Routes } from 'react-router-dom'
import '@shoelace-style/shoelace/dist/themes/light.css'
import '@shoelace-style/shoelace/dist/themes/dark.css'
import { setBasePath } from '@shoelace-style/shoelace'

import Welcome from './pages/welcome'
import Demo from './pages/demo'
import DirHistory from './pages/dirhistory'
import './App.css'

// Required to download icons and other assets
setBasePath('https://cdn.jsdelivr.net/npm/@shoelace-style/shoelace@2.17.1/cdn/')

function NavBar() {
  return (
    <>
      <h2>Pages</h2>
      <ul>
        <li>
          <a href="/">Welcome</a>
        </li>
        <li>
          <a href="/demo">FE to BE demo</a>
        </li>
        <li>
          <a href="/dirhistory">Dir History</a>
        </li>
      </ul>
    </>
  )
}

function App() {
  return (
    <div>
      <h1>Shelp</h1>
      <NavBar />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Welcome />} />
          <Route path="/demo" element={<Demo />} />
          <Route path="/dirhistory" element={<DirHistory />} />
        </Routes>
      </BrowserRouter>
    </div>
  )
}

export default App
