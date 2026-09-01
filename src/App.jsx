import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { ThemeProvider } from './context/ThemeProvider'
import { AppProvider } from './context/AppContext'
import Navbar from './components/Navbar'
import BackgroundParticles from './components/BackgroundParticles'
import AnimatedBackground from './components/AnimatedBackground'
import ThemeTransition from './components/ThemeTransition'
import HomePage from './pages/HomePage'
import StoryPage from './pages/StoryPage'
import TeacherDashboard from './pages/TeacherDashboard'
import TeacherLogin from './pages/TeacherLogin'
import StoryViewer from './pages/StoryViewer'
import AnalyticsPage from './pages/AnalyticsPage'

export default function App() {
  return (
    <ThemeProvider>
      <AppProvider>
        <BrowserRouter>
          <ThemeTransition>
            <div className="min-h-screen relative">
              <AnimatedBackground />
              <BackgroundParticles />
              <Navbar />
              <main className="relative z-10">
                <Routes>
                  <Route path="/" element={<HomePage />} />
                  <Route path="/story" element={<StoryPage />} />
                  <Route path="/teacher/login" element={<TeacherLogin />} />
                  <Route path="/teacher" element={<TeacherDashboard />} />
                  <Route path="/teacher/story/:id" element={<StoryViewer />} />
                  <Route path="/teacher/analytics" element={<AnalyticsPage />} />
                  <Route path="*" element={<Navigate to="/" replace />} />
                </Routes>
              </main>
            </div>
          </ThemeTransition>
        </BrowserRouter>
      </AppProvider>
    </ThemeProvider>
  )
}
