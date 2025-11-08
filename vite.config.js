import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss()],
  server: {
    proxy: {
      '/orion': {
        target: 'http://50.17.154.115:1026',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/orion/, ''),
      },
    },
  },
})
