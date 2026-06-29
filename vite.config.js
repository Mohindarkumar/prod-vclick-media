import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      // Forward contact form to local PHP server in dev.
      // Start PHP first: php -S localhost:8080 -t public/
      '/contact.php': 'http://localhost:8181',
    },
  },
})
