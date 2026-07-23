import { useState } from 'react'
import Navbar from '../components/Navbar.jsx'
import Sidebar from '../components/Sidebar.jsx'
import ChatBot from '../components/chat/ChatBot.jsx'
const SIDEBAR_WIDTH = 242

export default function DashboardLayout({ children }) {
  const [sidebarOpen, setSidebarOpen] = useState(false)

  return (
    <div className="min-h-screen bg-[#F8FAFC]">
      <Navbar
        onMenuToggle={() => setSidebarOpen(!sidebarOpen)}
        menuOpen={sidebarOpen}
      />

      <Sidebar
        isOpen={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
      />

      {/* Main content */}
      <main
        className="pt-16 min-h-screen transition-all duration-300"
        style={{ marginLeft: `${SIDEBAR_WIDTH}px` }}
      >
        <div className="p-4 md:p-6 lg:p-8 max-w-screen-xl mx-auto">
          {children}
        </div>
      </main>

      <ChatBot />
    </div>
  )
}
