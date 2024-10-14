import { createBrowserRouter } from 'react-router-dom'

import App from './App'
import Welcome from './pages/welcome'
import Demo from './pages/demo'
import DirHistory from './pages/dirhistory'

export const router = createBrowserRouter([
  {
    path: '/',
    element: <App />,
    children: [
      { path: '/', element: <Welcome /> },
      { path: '/demo', element: <Demo /> },
      { path: '/dirhistory', element: <DirHistory /> },
    ],
  },
])
