import { defineConfig } from 'astro/config';
import tailwindcss from '@tailwindcss/vite';

  import vercel from "@astrojs/vercel"; // classique, pas serverless

  export default defineConfig({
    vite: {
      plugins: [tailwindcss()],
    },

    output: "server",

    adapter: vercel({
      imageService: true,
      webAnalytics: {
        enabled: true,
      },
    }),
  });