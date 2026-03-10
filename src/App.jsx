import { BrowserRouter, Routes, Route } from 'react-router-dom'
import NavBar from './components/NavBar'

function App() {
  return (
    <BrowserRouter>
      <div className="min-h-screen bg-gray-950 text-white max-w-md mx-auto pb-16">
        <Routes>
          <Route path="/" element={<div className="p-4 text-3xl font-bold text-blue-500">Dashboard</div>} />
          <Route path="/log" element={<div className="p-4">Log a Run</div>} />
          <Route path="/history" element={<div className="p-4">History</div>} />
          <Route path="/login" element={<div className="p-4">Login</div>} />
        </Routes>
        <NavBar />
      </div>
    </BrowserRouter>
  )
}

export default App