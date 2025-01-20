import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react-swc'
import EnvironmentPlugin from 'vite-plugin-environment';

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), EnvironmentPlugin('all')],
  // global variable process.env
  // https://vitejs.dev/guide/env-and-mode.html#env-variables
})
