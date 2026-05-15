import { defineConfig } from 'vite'

export default defineConfig({
  server: {
    open: true,
    port: 3000
  },
  preview: {
    port: 4173,
    open: true
  }
})
