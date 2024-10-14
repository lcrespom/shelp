import { BrowserRouter, Route, Routes, NavLink } from 'react-router-dom'
//import { createBrowserRouter, RouterProvider, NavLink } from 'react-router-dom'
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
      <nav>
        <ul>
          <li>
            <NavLink to="/">Welcome</NavLink>
          </li>
          <li>
            <NavLink to="/demo">FE to BE demo</NavLink>
          </li>
          <li>
            <NavLink to="/dirhistory">Dir History</NavLink>
          </li>
        </ul>
      </nav>
    </>
  )
}

// const router = createBrowserRouter([
//   { path: '/', element: <Welcome /> },
//   { path: '/demo', element: <Demo /> },
//   { path: '/dirhistory', element: <DirHistory /> },
// ])

function App() {
  return (
    <div>
      <h1>Shelp</h1>
      {/* <RouterProvider router={router} /> */}
      <BrowserRouter>
        <NavBar />
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
