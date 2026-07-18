import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { registerSW } from 'virtual:pwa-register'

import './index.css'
import './i18n'
import App from './App.tsx'

import { SettingsProvider, ThemeProvider, AuthProvider } from './contexts'
import { HelmetProvider } from 'react-helmet-async'
import './lib/newrelic'

// Register PWA Service Worker
registerSW({
  immediate: true,
})

// Initialize Google Analytics dynamically if the ID is provided in Netlify Env
const gaId = import.meta.env.VITE_GA_ID

if (gaId) {
  const script1 = document.createElement('script')
  script1.async = true
  script1.src = `https://www.googletagmanager.com/gtag/js?id=${gaId}`
  document.head.appendChild(script1)

  const script2 = document.createElement('script')
  script2.innerHTML = `
    window.dataLayer = window.dataLayer || [];
    function gtag(){dataLayer.push(arguments);}
    gtag('js', new Date());
    gtag('config', '${gaId}');
  `
  document.head.appendChild(script2)
}

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <HelmetProvider>
      <SettingsProvider>
        <ThemeProvider>
          <AuthProvider>
            <App />
          </AuthProvider>
        </ThemeProvider>
      </SettingsProvider>
    </HelmetProvider>
  </StrictMode>,
)