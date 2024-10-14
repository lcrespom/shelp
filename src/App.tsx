import { NavLink, Outlet } from 'react-router-dom'
import '@shoelace-style/shoelace/dist/themes/light.css'
import '@shoelace-style/shoelace/dist/themes/dark.css'
import { setBasePath } from '@shoelace-style/shoelace'

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

function App() {
  return (
    <div>
      <h1>Shelp</h1>
      <NavBar />
      <Outlet /> {/* Where child routes will render */}
    </div>
  )
}

export default App
