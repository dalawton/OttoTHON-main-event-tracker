import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  // GitHub Pages serves this site from /<repo-name>/, not the domain root,
  // so every asset URL needs that prefix. Update this if the repo is ever renamed.
  base: '/OttoTHON-main-event-tracker/',
})
