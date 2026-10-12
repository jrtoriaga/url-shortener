/// <reference types="vitest" />
import { defineConfig } from "vitest/config";
import react from "@vitejs/plugin-react";

// Vitest configuration for the URL Shortener app.
// Uses jsdom to emulate the browser (navigator.clipboard, DOM, timers).
export default defineConfig({
  plugins: [react()],
  test: {
    environment: "jsdom",
    globals: true,
    setupFiles: ["./tests/setup.ts"],
    include: ["tests/**/*.{test,spec}.{ts,tsx}"],
    // CSS imports are irrelevant to assertions; skip processing them.
    css: false,
    clearMocks: true,
    restoreMocks: true,
  },
});
