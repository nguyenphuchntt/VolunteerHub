import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react({
      // Enable Fast Refresh
      fastRefresh: true,
      // Include .jsx and .js files
      include: "**/*.{jsx,js}",
    }),
  ],
  server: {
    // Enable HMR
    hmr: {
      overlay: true, // Show errors in overlay
    },
    // Watch options
    watch: {
      usePolling: true, // For WSL/Docker environments
      interval: 100,
    },
    // Hot reload
    open: false,
    port: 5173,
    // Proxy API requests to backend to avoid CORS issues
    proxy: {
      '/api': {
        target: 'http://localhost:8080',
        changeOrigin: true,
        secure: false,
      },
    },
  },

  // Optimize dependencies
  optimizeDeps: {
    include: ["react", "react-dom"],
  },
});
