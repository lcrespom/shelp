import { BrowserRouter, Route, Routes } from 'react-router-dom'

import Demo from './pages/demo'
import Welcome from './pages/welcome'

import './App.css'

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
        </Routes>
      </BrowserRouter>
    </div>
  )
}

export default App
