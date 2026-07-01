import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { AuthProvider } from './context/AuthContext'
import Dashboard from './pages/Dashboard'
import Login from './pages/Login'
import Register from './pages/Register'
import ProcessVideo from './pages/ProcessVideo'
import StudyPage from './pages/StudyPage'

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/process" element={<ProcessVideo />} />
          <Route path="/study/:videoId" element={<StudyPage />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  )
}

export default App