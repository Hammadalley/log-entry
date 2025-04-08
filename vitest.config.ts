import { defineConfig, mergeConfig } from 'vitest/config';
import viteConfig from './vite.config';
import { resolve } from 'path';

export default mergeConfig(
  viteConfig,
  defineConfig({
    test: {
      globals: true,
      environment: 'jsdom',
      setupFiles: ['./client/src/test/setup.ts'],
      include: ['client/src/**/*.{test,spec}.{ts,tsx}', 'server/**/*.{test,spec}.ts', '*.{test,spec}.{js,ts}'],
    },
    resolve: {
      alias: {
        '@shared': resolve(__dirname, './shared'),
      },
    },
  })
);