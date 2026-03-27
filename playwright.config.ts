import { defineConfig } from '@playwright/test'

export default defineConfig({
  testDir: './tests',
  use: {
    baseURL: 'http://localhost:4321',
  },
  webServer: {
    command: 'yarn serve dist --listen 4321 --no-clipboard',
    url: 'http://localhost:4321',
    reuseExistingServer: true,
  },
})