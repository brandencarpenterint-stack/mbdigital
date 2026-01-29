import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import './index.css'
import App from './App.jsx'
import { GamificationProvider } from './context/GamificationContext'
import { SettingsProvider } from './context/SettingsContext'
import { PocketBroProvider } from './context/PocketBroContext'
import ErrorBoundary from './components/ErrorBoundary'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <ErrorBoundary>
      <SettingsProvider>
        <GamificationProvider>
          <PocketBroProvider>
            <BrowserRouter>
              <App />
            </BrowserRouter>
          </PocketBroProvider>
        </GamificationProvider>
      </SettingsProvider>
    </ErrorBoundary>
  </StrictMode>,
)
