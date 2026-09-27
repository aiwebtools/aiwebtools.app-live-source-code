import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";
import { fileURLToPath } from "url";
import { componentTagger } from "lovable-tagger";
import { viteOGManifest } from "./plugins/vite-og-manifest";
import { vitePrerender } from "./plugins/vite-prerender";
import { viteSourceZip } from "./plugins/vite-source-zip";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => ({
  server: {
    host: true,
    port: 8080,
  },
  plugins: [
    react(),
    mode === 'development' &&
    componentTagger(),
    mode === 'production' && viteOGManifest(),
    mode === 'production' && vitePrerender(),
    mode === "production" && viteSourceZip(),
  ].filter(Boolean),
  resolve: {
    alias: [
      { find: /^@\//, replacement: `${path.resolve(__dirname, "./src")}/` },
      { find: "@", replacement: path.resolve(__dirname, "./src") },
    ],
  },
  build: {
    // Optimize chunk splitting for faster initial load
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (!id.includes('node_modules')) return;
          // Keep React core hot in its own long-cache chunk
          if (/[\\/]react(-dom)?[\\/]/.test(id) || id.includes('scheduler')) return 'vendor-react';
          if (id.includes('react-router')) return 'vendor-router';
          if (id.includes('@tanstack')) return 'vendor-query';
          // All Radix primitives — only what's used is bundled, but together they cache as one unit
          if (id.includes('@radix-ui')) return 'vendor-radix';
          // Lucide icons — large tree but rarely changes
          if (id.includes('lucide-react')) return 'vendor-icons';
          // Heavy chart lib — only loaded by admin/analytics
          if (id.includes('recharts') || id.includes('d3-')) return 'vendor-charts';
          // Forms / dates / carousel — grouped utilities
          if (id.includes('react-hook-form') || id.includes('@hookform') || id.includes('zod')) return 'vendor-forms';
          if (id.includes('date-fns')) return 'vendor-dates';
          if (id.includes('embla-carousel')) return 'vendor-carousel';
          if (id.includes('cmdk') || id.includes('sonner') || id.includes('vaul')) return 'vendor-overlay';
          if (id.includes('framer-motion') || id.includes('motion-')) return 'vendor-motion';
          if (id.includes('@supabase')) return 'vendor-supabase';
          // Everything else from node_modules
          return 'vendor-misc';
        },
      },
    },
    // Minification settings
    minify: 'esbuild',
    target: 'esnext',
    // CSS code splitting
    cssCodeSplit: true,
    // Modulepreload polyfill off — modern browsers handle it natively
    modulePreload: { polyfill: false },
    // Reduce chunk size warnings threshold
    chunkSizeWarningLimit: 500,
    // Enable aggressive asset inlining for tiny files (saves HTTP round-trips)
    assetsInlineLimit: 4096,
    // Source maps off in prod for smaller transfer
    sourcemap: false,
    // Stronger CSS minification
    cssMinify: 'esbuild',
  },
  // Optimize deps for faster dev server start
  optimizeDeps: {
    include: ['react', 'react-dom', 'react-router-dom', '@tanstack/react-query'],
  },
}));
