import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    // Proxy /api/* to the Vercel dev server locally.
    // Run `vercel dev` instead of `npm run dev` for full local testing,
    // OR keep `npm run dev` and set MINIMAX_API_KEY in your shell env.
    proxy: {
      '/api': {
        target: 'http://localhost:3000',
        changeOrigin: true,
      },
    },
  },
})
