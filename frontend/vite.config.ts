import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react-swc'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  // global variable process.env
  // https://vitejs.dev/guide/env-and-mode.html#env-variables
})
