import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import "./scss/purecss.css";
import "./scss/purecss-grids.css";
import './index.css'

import InventoryApp from './App'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <InventoryApp />
  </StrictMode>,
)
