import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => ({
  plugins: [react()],
  build: {
    target: 'es2015',
    minify: 'terser',
    terserOptions: {
      compress: {
        drop_console: true,
        drop_debugger: true,
        pure_funcs: ['console.log', 'console.info', 'console.debug'],
      },
    },
    rollupOptions: {
      output: {
        manualChunks: {
          vendor: ['react', 'react-dom'],
          plasma: ['ogl'],
          icons: ['lucide-react'],
        },
        // Otimizações de chunk
        chunkFileNames: 'assets/js/[name]-[hash].js',
        entryFileNames: 'assets/js/[name]-[hash].js',
        assetFileNames: 'assets/[ext]/[name]-[hash].[ext]',
      },
    },
    chunkSizeWarningLimit: 1000,
    // Otimizações de build
    sourcemap: mode === 'development',
    reportCompressedSize: false,
    cssCodeSplit: true,
  },
  optimizeDeps: {
    include: ['react', 'react-dom', 'lucide-react'],
    exclude: ['ogl'],
    // Otimizações de dependências
    force: false,
  },
  server: {
    hmr: {
      overlay: false,
    },
    // Otimizações de desenvolvimento
    fs: {
      strict: false,
    },
  },
  css: {
    postcss: './postcss.config.js',
  },
  // Otimizações gerais
  define: {
    __DEV__: mode === 'development',
  },
  esbuild: {
    drop: mode === 'production' ? ['console', 'debugger'] : [],
  },
}))
