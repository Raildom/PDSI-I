import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => ({
  server: {
    // Evita problemas de HMR/WebSocket no Windows quando o host é IPv6 (::)
    host: "127.0.0.1",
    // Não fixa a porta: evita erro “Port ... is already in use”
    // (Vite usa 5173 por padrão e escolhe outra se estiver ocupada)
    hmr: {
      host: "127.0.0.1",
      overlay: false,
    },
    proxy: {
      "/api": {
        target: "http://127.0.0.1:8000",
        changeOrigin: true,
      },
    },
  },
  plugins: [react()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
    dedupe: [
      "react",
      "react-dom",
      "react/jsx-runtime",
      "react/jsx-dev-runtime",
      "@tanstack/react-query",
      "@tanstack/query-core",
    ],
  },
}));
