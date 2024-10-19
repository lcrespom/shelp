import { createBrowserRouter } from 'react-router-dom'

import App from './App'
import Welcome from './pages/welcome'
import Demo from './pages/demo'
import History from './pages/history'
import DirHistory from './pages/dirhistory'

export const router = createBrowserRouter([
  {
    path: '/',
    element: <App />,
    children: [
      { path: '/', element: <Welcome /> },
      { path: '/demo', element: <Demo /> },
      { path: '/history', element: <History /> },
      { path: '/dirhistory', element: <DirHistory /> },
    ],
  },
])
