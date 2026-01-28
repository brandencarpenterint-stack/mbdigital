import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import './index.css'
import App from './App.jsx'
import { GamificationProvider } from './context/GamificationContext'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <GamificationProvider>
      <BrowserRouter>
        <App />
      </BrowserRouter>
    </GamificationProvider>
  </StrictMode>,
)
