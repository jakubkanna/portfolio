import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { nodePolyfills } from "vite-plugin-node-polyfills";
// import { viteSingleFile } from "vite-plugin-singlefile";

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), nodePolyfills()],
  assetsInclude: ["**/*.md"],
  base: "/",
  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          react: ["react", "react-dom"],
          motion: ["motion"],
          "gray-matter": ["gray-matter"],
          "react-markdown": [
            "react-markdown",
            "rehype-raw",
            "rehype-video",
            "remark-gfm",
          ],
        },
      },
    },
  },
});
