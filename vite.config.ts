import { defineConfig } from 'vite';

export default defineConfig({
  build: {
    // Enable minification
    minify: 'terser',
    terserOptions: {
      compress: {
        drop_console: true, // Remove console.log in production
        drop_debugger: true,
      },
    },
    // Enable tree shaking
    rollupOptions: {
      output: {
        // Manual chunk splitting for better caching
        manualChunks: {
          // Separate vendor code
          'vendor': [],
        },
        // Optimize chunk file names
        chunkFileNames: 'assets/js/[name]-[hash].js',
        entryFileNames: 'assets/js/[name]-[hash].js',
        assetFileNames: (assetInfo) => {
          if (assetInfo.name?.endsWith('.css')) {
            return 'assets/css/[name]-[hash][extname]';
          }
          return 'assets/[name]-[hash][extname]';
        },
      },
    },
    // Optimize chunk size warnings
    chunkSizeWarningLimit: 1000,
    // Enable source maps for production debugging (optional - remove if not needed)
    sourcemap: false,
    // Target modern browsers for smaller bundle
    target: 'es2022',
    // CSS code splitting
    cssCodeSplit: true,
  },
  // Optimize dependencies
  optimizeDeps: {
    include: [],
  },
  // Server configuration for development
  server: {
    port: 5173,
    strictPort: false,
  },
  // Preview configuration
  preview: {
    port: 4173,
    strictPort: false,
  },
});

