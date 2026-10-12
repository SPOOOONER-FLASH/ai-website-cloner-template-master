import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { viteSingleFile } from "vite-plugin-singlefile";

// One self-contained index.html (scripts, styles and fonts inlined) next to an img/ folder,
// so the demo opens by double-click with no server.
export default defineConfig({ base: "./", plugins: [react(), viteSingleFile()] });
