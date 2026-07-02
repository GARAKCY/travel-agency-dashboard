import type { Config } from "@react-router/dev/config";
import { vercelPreset } from "@vercel/react-router/vite";
import { sentryOnBuildEnd } from "@sentry/react-router";

export default {
  ssr: true,
  presets: [vercelPreset()],
  buildEnd: async ({ viteConfig, reactRouterConfig, buildManifest }) => {
    await sentryOnBuildEnd({ viteConfig, reactRouterConfig, buildManifest });
  },
} satisfies Config;
