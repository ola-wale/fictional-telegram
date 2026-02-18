/// <reference types="vitest/config" />
import { resolve } from 'path'
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss()],
  resolve: {
    alias: {
      '@': resolve(import.meta.dirname, './src'),
    },
  },
  build: {
    rollupOptions: {
      output: {
        // Split vendor libs into separate chunks for better caching —
        // app code changes won't invalidate cached vendor bundles.
        manualChunks(id) {
          if (id.includes('node_modules')) {
            if (id.includes('react-hook-form') || id.includes('@hookform') || id.includes('/zod/')) {
              return 'vendor-form';
            }
            if (id.includes('radix-ui') || id.includes('lucide-react') || id.includes('class-variance-authority') || id.includes('clsx') || id.includes('tailwind-merge')) {
              return 'vendor-ui';
            }
            if (id.includes('react-dom') || id.includes('/react/')) {
              return 'vendor-react';
            }
            if (id.includes('cmdk') || id.includes('sonner') || id.includes('uuid')) {
              return 'vendor-misc';
            }
          }
        },
      },
    },
  },
})
