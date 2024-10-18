// import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react-swc'

import { defineConfig } from 'vitest/config' ;

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  //
  test: {
    globals: true,  // Enable global expect, describe, and it
    environment: "jsdom", // Simulate browser-like environment
  },
})
