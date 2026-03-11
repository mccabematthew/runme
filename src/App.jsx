import { BrowserRouter, Routes, Route } from 'react-router-dom'
import NavBar from './components/NavBar'
import Dashboard from './pages/Dashboard'
import LogRun from './pages/LogRun'

function App() {
  return (
    <BrowserRouter>
      <div className="min-h-screen bg-background text-foreground w-full max-w-4xl mx-auto px-4 pb-16">
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/log" element={<LogRun />} />
          <Route path="/history" element={<div className="p-4">History</div>} />
          <Route path="/login" element={<div className="p-4">Login</div>} />
        </Routes>
        <NavBar />
      </div>
    </BrowserRouter>
  )
}

export default App