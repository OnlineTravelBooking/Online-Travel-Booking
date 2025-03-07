import { test, expect } from "@playwright/test";

test("admin login and Delete package", async ({ page }) => {
  await page.goto("http://localhost:3000/");

  await page.click('text="เข้าสู่ระบบ"');
  await expect(page).toHaveURL("http://localhost:3000/login");

  await page.getByRole("textbox", { name: "Username" }).fill("admin1");
  await page.getByRole("textbox", { name: "Password" }).fill("123qwe");

  await page.getByRole("button", { name: "Login" }).click();

  await page.waitForURL("http://localhost:3000/admin/create-package");

  await page.waitForSelector(".ant-card", { state: "visible" });
  const initialPackages = await page.locator(".ant-card").count();

  await page.locator('button:has-text("Delete")').last().click();

  const dialogLocator = page
    .getByRole("dialog")
    .filter({ hasText: /คุณต้องการลบแพ็คเกจ/ })
    .last();
  await expect(dialogLocator).toBeVisible();

  await expect(dialogLocator.getByText(/คุณต้องการลบแพ็คเกจ/)).toBeVisible();

  await dialogLocator.getByRole("button", { name: "Delete" }).click();

  await expect(page.locator(".ant-card")).toHaveCount(initialPackages - 1);
  const remainingPackages = await page.locator(".ant-card").count();
  expect(remainingPackages).toBe(initialPackages - 1);

  const token = await page.evaluate(() => sessionStorage.getItem("token"));
  expect(token).toBeTruthy();
});
