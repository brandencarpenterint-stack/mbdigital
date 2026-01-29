import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import './index.css'
import App from './App.jsx'
import { GamificationProvider } from './context/GamificationContext'
import { SettingsProvider } from './context/SettingsContext'
import ErrorBoundary from './components/ErrorBoundary'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <ErrorBoundary>
      <SettingsProvider>
        <GamificationProvider>
          <BrowserRouter>
            <App />
          </BrowserRouter>
        </GamificationProvider>
      </SettingsProvider>
    </ErrorBoundary>
  </StrictMode>,
)
