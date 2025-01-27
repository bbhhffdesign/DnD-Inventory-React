import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react-swc'
import VitePluginRestart from 'vite-plugin-restart'

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(),
    VitePluginRestart({
      restart : '/src/index.css'
    })
  ],
   base: '/DnD-Inventory-React/',
   build: {
    outDir: 'dist', // Asegura que los archivos de compilación se generen aquí
  }

})
