import { Outlet } from 'react-router-dom'

import './App.css'

function App() {
  return (
    <div className="dark:bg-black dark:text-gray-200">
      <Outlet /> {/* Where child routes will render */}
    </div>
  )
}

export default App
