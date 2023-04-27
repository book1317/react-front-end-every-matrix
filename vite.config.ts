import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// https://vitejs.dev/config/
export default defineConfig({
  base: "https://book1317.github.io/react-front-end-every-matrix/",
  plugins: [react()],
});
