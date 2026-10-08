import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  // GitHub Pages: this site is published at the account root, https://ismaelmarot.github.io,
  // from the ismaelmarot.github.io repository. A base of '/' is required for asset routing to
  // resolve there. A repository subpath base would serve the site on a URL nobody visits.
  base: '/',
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  build: {
    outDir: 'dist',
    sourcemap: true,
    rollupOptions: {
      output: {
        manualChunks: undefined,
      },
    },
  },
  server: {
    /* 5174 rather than 5173, and strictly.

       There are two Vite projects side by side in ~/Development/iM_projects: this one and the empty
       `im-personal-web-2026` scaffold. Both default to 5173, so whichever starts second silently
       lands on 5174 and `open: true` then opens the wrong site in the browser.

       That is not hypothetical. It happened: the scaffold's dev server held 5173, this one moved to
       5174 without a word, and the browser showed a placeholder page while the real work sat on
       disk. `strictPort` is the part that matters. Without it, Vite walks to the next free port and
       reports nothing that distinguishes "this is the real site" from "this is the empty one". With
       it, a taken port is a hard error naming the port, so a collision is visible instead of
       mysterious. */
    port: 5174,
    strictPort: true,
    open: true,
  },
});