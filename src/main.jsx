import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { HelmetProvider } from 'react-helmet-async'
import App from './App.jsx'
import './styles/index.css'
import { siteConfig } from './config/site.config.js'

if (siteConfig.customScrollbar === 1) {
  document.documentElement.classList.add('custom-scrollbar')
}

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <HelmetProvider>
      <App />
    </HelmetProvider>
  </StrictMode>,
)
