import { useState } from 'react'
import { BrowserRouter, Routes, Route } from 'react-router'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import Dashboard from '@/pages/Dashboard'
import EditTask from '@/pages/EditTask'

function App() {
  const [count, setCount] = useState(0)

  return (
    <BrowserRouter>
      <Routes>
        <Route element={<Dashboard />} path="/" />
        <Route element={<EditTask />} path="/edittask/:id" />
      </Routes>
    </BrowserRouter>
  )
}

export default App
