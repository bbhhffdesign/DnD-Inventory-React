import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import InventoryApp from './App'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <InventoryApp />
  </StrictMode>,
)
