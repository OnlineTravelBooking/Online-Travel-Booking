const { test, expect } = require('@playwright/test');

test('should register, book a trip, complete payment, and upload proof', async ({ page }) => {
    console.log('🚀 Starting test: Register, book trip, complete payment, and upload proof');

    // Register
    console.log('🔑 Navigating to registration page');
    await page.goto('/register');
    await expect(page.locator('.login-Title')).toHaveText('Register');

    console.log('📝 Filling out registration form');
    await page.fill('input[placeholder="First name and Last name"]', 'Dung machoo');
    await page.fill('input[placeholder="Email"]', 'dung123@example.com');
    await page.fill('input[placeholder="Username"]', 'dung');
    await page.fill('input[placeholder="Password"]', 'Password123!');
    await page.fill('input[placeholder="Confirm password"]', 'Password123!');
    
    console.log('📩 Submitting registration form');
    await page.click('button.button-Login');
    await page.waitForURL('/');
    await expect(page).toHaveURL('/');

    // Click the image to go to the detail page
    console.log('📸 Clicking the trip image to view details');
    await page.click('img[alt="หาดสมิหลา"]');
    await page.waitForURL('/detail');
    await expect(page).toHaveURL('/detail');

    // Select date (05/03/2025)
    console.log('📅 Selecting trip date: 05/03/2025');
    await page.click('.Select-DATE');
    await page.locator('.ant-select-item-option-content', { hasText: '05/03/2025' }).click();

    // Click the payment button
    console.log('💳 Proceeding to payment');
    await page.click('.pay-button');
    await page.waitForURL('/transaction');
    await expect(page).toHaveURL('/transaction');

    // Upload image proof
    console.log('📤 Uploading payment proof image');
    const imagePath = 'public/slip example.png'; 
    await page.setInputFiles('input[type="file"]', imagePath);

    // Submit the upload
    console.log('✅ Submitting the uploaded proof');
    await page.click('.Button-summit');

    // Check for success toast message
    console.log('⏳ Waiting for success toast message');
    await page.waitForTimeout(1000); 
    await expect(page.locator('.ant-message-notice-content').filter({ hasText: 'ส่งข้อมูลสำเร็จ โปรดรอการตรวจสอบ' })).toHaveText('ส่งข้อมูลสำเร็จ โปรดรอการตรวจสอบ');

    console.log('🎉 Test completed successfully: Full flow with image upload and success toast works correctly! ✅');
});
