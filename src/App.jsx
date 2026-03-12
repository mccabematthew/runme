import { BrowserRouter, Routes, Route } from 'react-router-dom'
import NavBar from './components/NavBar'
import Dashboard from './pages/Dashboard'
import LogRun from './pages/LogRun'
import SignupPage from './pages/SignUp'
import LoginPage from './pages/Login'
import { useEffect, useState } from 'react'
import { Navigate } from 'react-router-dom'
import { getCurrentUser } from 'aws-amplify/auth'
import ConfirmEmail from './pages/ConfirmEmail'

function PublicRoute({ children }) {
  const [isAuth, setIsAuth] = useState(null)

  useEffect(() => {
    getCurrentUser()
      .then(() => setIsAuth(true))
      .catch(() => setIsAuth(false))
  }, [])

  if (isAuth === null) return <div>Loading...</div>
  if (isAuth) return <Navigate to="/dashboard" replace />
  return children
}

function ProtectedRoute({ children }) {
  const [isAuth, setIsAuth] = useState(null)

  useEffect(() => {
    getCurrentUser()
      .then(() => setIsAuth(true))
      .catch((err) => {
        console.log('protected route error:', err)
        setIsAuth(false)
      })
  }, [])

  if (isAuth === null) return <div>Loading...</div>
  if (!isAuth) return <Navigate to="/" replace />
  return children
}

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
        <Route path="/" element={<PublicRoute><LoginPage /></PublicRoute>} />
        <Route path="/signup" element={<PublicRoute><SignupPage /></PublicRoute>} />
        <Route path="/confirm" element={<ConfirmEmail />} />
        <Route path="/dashboard" element={<ProtectedRoute><AppLayout><Dashboard /></AppLayout></ProtectedRoute>} />
        <Route path="/log" element={<ProtectedRoute><AppLayout><LogRun /></AppLayout></ProtectedRoute>} />
        <Route path="/history" element={<ProtectedRoute><AppLayout><div className="p-4">History</div></AppLayout></ProtectedRoute>} />
      </Routes>
    </BrowserRouter>
  )
}

export default App