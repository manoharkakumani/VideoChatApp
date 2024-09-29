import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { VitePWA } from "vite-plugin-pwa";

export default defineConfig({
  plugins: [
    react(),
    VitePWA({
      registerType: "autoUpdate",
      includeAssets: [
        // "favicon.svg",
        // "favicon.ico",
        // "robots.txt",
        // "apple-touch-icon.png",
      ],
      manifest: {
        name: "M Chat",
        short_name: "M Chat",
        description: "M Chat Progressive Web App!",
        theme_color: "#ffffff",
        icons: [
          // {
          //   src: "pwa-192x192.png",
          //   sizes: "192x192",
          //   type: "image/png",
          // },
          // {
          //   src: "pwa-512x512.png",
          //   sizes: "512x512",
          //   type: "image/png",
          // },
        ],
      },
    }),
  ],
});
