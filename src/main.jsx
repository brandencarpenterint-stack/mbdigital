import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import './index.css'
import App from './App.jsx'
import { GamificationProvider } from './context/GamificationContext'
import { NotificationProvider } from './context/NotificationContext'
import { SettingsProvider } from './context/SettingsContext'
import { PocketBroProvider } from './context/PocketBroContext'
import { SquadProvider } from './context/SquadContext'
import { InventoryProvider } from './context/InventoryContext'
import { ToastProvider } from './context/ToastContext'
import { ThemeProvider } from './context/ThemeContext'
import ErrorBoundary from './components/ErrorBoundary'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <ErrorBoundary>
      <ThemeProvider>
        <SettingsProvider>
          <ToastProvider>
            <GamificationProvider>
              <NotificationProvider>
                <PocketBroProvider>
                  <SquadProvider>
                    <InventoryProvider>
                      <BrowserRouter>
                        <App />
                      </BrowserRouter>
                    </InventoryProvider>
                  </SquadProvider>
                </PocketBroProvider>
              </NotificationProvider>
            </GamificationProvider>
          </ToastProvider>
        </SettingsProvider>
      </ThemeProvider>
    </ErrorBoundary>
  </StrictMode>,
)
