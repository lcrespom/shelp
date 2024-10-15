import { Outlet } from 'react-router-dom'

import './App.css'

function App() {
  return (
    <div>
      <Outlet /> {/* Where child routes will render */}
    </div>
  )
}

export default App
