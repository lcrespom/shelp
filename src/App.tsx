import { NavLink, Outlet } from 'react-router-dom'

import './App.css'

//TODO apply theme according to user preference
let theme = 'light'

function NavBar() {
  return (
    <>
      <h2 className="text-2xl">Pages</h2>
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
    <div className="m-2">
      <h1 className="text-3xl">Shelp</h1>
      <NavBar />
      <Outlet /> {/* Where child routes will render */}
    </div>
  )
}

export default App
