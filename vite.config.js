import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react-swc'
import VitePluginRestart from 'vite-plugin-restart'


export default defineConfig({
  plugins: [
    react(),
    VitePluginRestart({
      restart : '/src/index.css'
    })
  ],
   base: '/DnD-Inventory-React/'
})
