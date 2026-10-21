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
import { TimeProvider } from './context/TimeContext'
import ErrorBoundary from './components/ErrorBoundary'
import MonetizationConfig from './config/MonetizationConfig'

// Initialize Google H5 Games Ads / AdSense when publisher ID is supplied
if (typeof window !== 'undefined') {
  window.adsbygoogle = window.adsbygoogle || [];
  window.adBreak = window.adBreak || function (o) { (window.adsbygoogle = window.adsbygoogle || []).push(o); };
  window.adConfig = window.adConfig || function (o) { (window.adsbygoogle = window.adsbygoogle || []).push(o); };

  if (MonetizationConfig.adsensePublisherId && MonetizationConfig.adsensePublisherId.startsWith('ca-pub-')) {
    try {
      const adScript = document.createElement('script');
      adScript.async = true;
      adScript.src = `https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${MonetizationConfig.adsensePublisherId}`;
      adScript.crossOrigin = 'anonymous';
      adScript.setAttribute('data-ad-frequency-hint', '30s');
      document.head.appendChild(adScript);
      window.adConfig({
        preloadAdBreaks: 'on',
        sound: 'on',
      });
    } catch {
      // ignore
    }
  }
}

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <ErrorBoundary>
      <ThemeProvider>
        <SettingsProvider>
          <TimeProvider>
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
          </TimeProvider>
        </SettingsProvider>
      </ThemeProvider>
    </ErrorBoundary>
  </StrictMode>,
)
