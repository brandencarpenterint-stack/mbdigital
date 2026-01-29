import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import './index.css'
import App from './App.jsx'
import { GamificationProvider } from './context/GamificationContext'
import { SettingsProvider } from './context/SettingsContext'
import { PocketBroProvider } from './context/PocketBroContext'
import { SquadProvider } from './context/SquadContext'
import { InventoryProvider } from './context/InventoryContext'
import { ToastProvider } from './context/ToastContext'
import ErrorBoundary from './components/ErrorBoundary'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <ErrorBoundary>
      <SettingsProvider>
        <ToastProvider>
          <GamificationProvider>
            <PocketBroProvider>
              <SquadProvider>
                <InventoryProvider>
                  <BrowserRouter>
                    <App />
                  </BrowserRouter>
                </InventoryProvider>
              </SquadProvider>
            </PocketBroProvider>
          </GamificationProvider>
        </ToastProvider>
      </SettingsProvider>
    </ErrorBoundary>
  </StrictMode>,
)
