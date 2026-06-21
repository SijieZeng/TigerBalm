import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

export default defineConfig({
  plugins: [react(), tailwindcss()],
  // Allow any Host header so the cloudflared tunnel (*.trycloudflare.com) works.
  preview: { allowedHosts: true },
  server: { allowedHosts: true },
})
