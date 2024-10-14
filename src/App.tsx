import { NavLink, Outlet } from 'react-router-dom'

import './App.css'

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
