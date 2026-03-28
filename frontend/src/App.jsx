import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom'
import { useTheme } from './hooks/useTheme'
import { Compare } from './pages/Compare'
import { Home } from './pages/Home'
import { Welcome } from './pages/Welcome'

export default function App() {
  const { theme, toggle } = useTheme()

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Welcome />} />
        <Route path="/home" element={<Home theme={theme} onToggleTheme={toggle} />} />
        <Route path="/compare" element={<Compare theme={theme} onToggleTheme={toggle} />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  )
}
