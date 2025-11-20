import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import { LandingPage } from './pages/LandingPage'
import { WorkspacePage } from './pages/WorkspacePage'
import { PreviewPage } from './pages/PreviewPage'
import { SuccessPage } from './pages/SuccessPage'
import { SearchPage } from './pages/SearchPage'
import { CollectionsPage } from './pages/CollectionsPage'
import { SettingsPage } from './pages/SettingsPage'
import { CustomCursor } from './components/CustomCursor'
import { CosmicBackground } from './components/CosmicBackground'
import { WindowControls } from './components/WindowControls'

function App() {
  return (
    <Router>
      <div className="relative w-full min-h-screen overflow-hidden">
        <CosmicBackground />
        <CustomCursor />
        <WindowControls />
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/workspace" element={<WorkspacePage />} />
          <Route path="/preview" element={<PreviewPage />} />
          <Route path="/success" element={<SuccessPage />} />
          <Route path="/search" element={<SearchPage />} />
          <Route path="/collections" element={<CollectionsPage />} />
          <Route path="/settings" element={<SettingsPage />} />
        </Routes>
      </div>
    </Router>
  )
}

export default App
