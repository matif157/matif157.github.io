import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { fileURLToPath } from 'node:url'
import { resolve } from 'node:path'

const root = fileURLToPath(new URL('.', import.meta.url))

// Two entries share one build: the classic model-directory portfolio and the
// new MA — Intelligence Constellation. Relative base keeps both working from
// docs/ on GitHub Pages and as a static Vercel output.
export default defineConfig({
  plugins: [react()],
  base: './',
  build: {
    outDir: 'docs',
    rollupOptions: {
      input: {
        main: resolve(root, 'index.html'),
        constellation: resolve(root, 'constellation.html'),
      },
    },
  },
})
