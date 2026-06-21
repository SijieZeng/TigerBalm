import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

export default defineConfig({
  // Root by default (local dev, preview, cloudflared tunnel). The GitHub Pages
  // build sets VITE_BASE=/TigerBalm/ so assets resolve under the repo subpath.
  base: process.env.VITE_BASE || '/',
  plugins: [react(), tailwindcss()],
  // Allow any Host header so the cloudflared tunnel (*.trycloudflare.com) works.
  preview: { allowedHosts: true },
  server: { allowedHosts: true },
})
