import { createBrowserRouter } from 'react-router-dom'

import App from './App'
import Welcome from './pages/welcome'
import History from './pages/history'
import DirHistory from './pages/dirhistory'
import FileSearch from './pages/file-search'

export const router = createBrowserRouter([
  {
    path: '/',
    element: <App />,
    children: [
      { path: '/', element: <Welcome /> },
      { path: '/history', element: <History /> },
      { path: '/dirhistory', element: <DirHistory /> },
      { path: '/filesearch', element: <FileSearch /> },
    ],
  },
])
