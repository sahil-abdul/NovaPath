import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

// https://vite.dev/config/
export default defineConfig({
  server:{
    proxy:{
      "/v1":"http://localhost:8080/api"
    }
  },
  plugins: [react(), tailwindcss(),],
})
