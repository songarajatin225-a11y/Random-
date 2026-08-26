import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

export default defineConfig({
  /* Relative asset URLs. Lets the same build work at a domain root, inside a
     GitHub Pages project sub-path (/your-repo/), and straight from disk. */
  base: './',
  plugins: [react(), tailwindcss()],
})
