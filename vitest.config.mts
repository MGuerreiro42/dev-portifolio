import { defineConfig } from "vitest/config";
import react from "@vitejs/plugin-react";
import path from "node:path";
import { fileURLToPath } from "node:url";

const dirname = path.dirname(fileURLToPath(import.meta.url));

export default defineConfig({
  plugins: [react()],
  test: {
    environment: "jsdom",
    globals: false,
    setupFiles: ["./vitest.setup.ts"],
    css: false,
    server: {
      deps: {
        // next-intl's own nested "next" copy otherwise gets externalized
        // and loaded via Node's native ESM resolver, which — unlike Vite's
        // resolver — can't resolve Next's extensionless deep imports (no
        // "exports" map) and skips our next/navigation alias entirely.
        inline: ["next-intl"],
      },
    },
    // Threads are the default pool, but explicit here since it's the
    // fastest option for this suite — no test relies on process isolation.
    pool: "threads",
    coverage: {
      provider: "v8",
      reporter: ["text", "html", "json-summary"],
      include: ["src/**/*.{ts,tsx}"],
      exclude: [
        "src/**/*.d.ts",
        "src/**/*.test.{ts,tsx}",
        "src/test/**",
        // Pure type/config re-exports — nothing to execute or branch on.
        "src/i18n/navigation.ts",
      ],
    },
  },
  resolve: {
    alias: {
      "@": path.resolve(dirname, "./src"),
      // next-intl's own nested "next" copy fails Vite's resolver for this
      // bare specifier — see src/test/mocks/next-navigation.ts.
      "next/navigation": path.resolve(dirname, "./src/test/mocks/next-navigation.ts"),
    },
  },
});
