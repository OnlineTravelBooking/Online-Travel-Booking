// @ts-check
import { defineConfig, devices } from '@playwright/test';

export default defineConfig({
  testDir: './tests', // โฟลเดอร์ Test Case
  fullyParallel: true, // รัน Test พร้อมกัน
  forbidOnly: !!process.env.CI, // ป้องกัน test.only ใน CI
  retries: process.env.CI ? 2 : 0, // Retry เฉพาะ CI
  workers: process.env.CI ? 1 : undefined, // จำนวน worker
  reporter: 'html', // รายงานผลเป็น HTML
  use: {
    baseURL: 'http://localhost:3000', // URL ของ React App
    trace: 'on-first-retry', // เก็บ trace ถ้า retry
    headless: true, // รันแบบไม่มี UI (เปลี่ยนเป็น false ถ้าต้องการดีบัก)
  },
  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] }, // ใช้แค่ Chromium
    },
  ],
  webServer: {
    command: 'npm run start', // รัน React App
    url: 'http://localhost:3000', // URL ที่รัน
    reuseExistingServer: !process.env.CI, // ใช้เซิร์ฟเวอร์ที่มีอยู่
  },
});