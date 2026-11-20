import React from 'react'
import { createRoot } from 'react-dom/client'
import App from './App'
import './constellation.css'

createRoot(document.getElementById('constellation-root')).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
)
