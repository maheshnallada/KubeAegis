import { Routes, Route } from 'react-router-dom'
import LandingPage from './pages/LandingPage'
import ChatPage from './pages/ChatPage'
import ArchitecturePage from './pages/ArchitecturePage'
import TechStackPage from './pages/TechStackPage'
import Navbar from './components/Navbar'

export default function App() {
  return (
    <div className="min-h-screen bg-[#0a0a0f]">
      <Navbar />
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/chat" element={<ChatPage />} />
        <Route path="/architecture" element={<ArchitecturePage />} />
        <Route path="/stack" element={<TechStackPage />} />
      </Routes>
    </div>
  )
}
