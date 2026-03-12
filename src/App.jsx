import { BrowserRouter, Routes, Route } from 'react-router-dom'
import NavBar from './components/NavBar'
import Dashboard from './pages/Dashboard'
import LogRun from './pages/LogRun'
import SignupPage from './pages/SignUp'
import LoginPage from './pages/Login'

function AppLayout({ children }) {
  return (
    <div className="min-h-screen bg-background text-foreground w-full max-w-4xl mx-auto px-4 pb-16">
      {children}
      <NavBar />
    </div>
  )
}

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<LoginPage />} />
        <Route path="/signup" element={<SignupPage />} />
        <Route path="/dashboard" element={<AppLayout><Dashboard /></AppLayout>} />
        <Route path="/log" element={<AppLayout><LogRun /></AppLayout>} />
        <Route path="/history" element={<AppLayout><div className="p-4">History</div></AppLayout>} />
      </Routes>
    </BrowserRouter>
  )
}

export default App