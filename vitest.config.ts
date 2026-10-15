import { defineConfig } from 'vitest/config';
import { svelte } from '@sveltejs/vite-plugin-svelte';

export default defineConfig({
  plugins: [svelte({ hot: false })],
  resolve: {
    // @testing-library/svelte + svelte need the browser build under jsdom.
    conditions: ['browser'],
  },
  test: {
    environment: 'jsdom',
  },
});
