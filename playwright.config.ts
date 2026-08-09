import { defineConfig } from '@playwright/test'

export default defineConfig({
  globalSetup: './tests/global-setup.ts',
  testDir: './tests',
  use: {
    baseURL: 'http://localhost:4321',
  },
  webServer: [
    {
      command: 'docker run --rm -p 1025:1025 -p 8025:8025 mailhog/mailhog',
      url: 'http://localhost:8025',
      reuseExistingServer: true,
      timeout: 15_000,
    },
    {
      command: 'yarn serve dist --listen 4321 --no-clipboard',
      url: 'http://localhost:4321',
      reuseExistingServer: true,
      stdout: 'pipe',
      stderr: 'pipe',
    },
  ],
})