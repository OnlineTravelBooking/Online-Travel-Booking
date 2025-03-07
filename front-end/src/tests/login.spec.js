import { test, expect } from "@playwright/test";

test("admin1 login to create package", async ({ page }) => {
  await page.goto("http://localhost:3000/");
  await expect(page).toHaveURL("http://localhost:3000/");

  // Navigate to login page
  await page.getByRole("menuitem", { name: "user เข้าสู่ระบบ" }).click();
  await expect(page).toHaveURL("http://localhost:3000/login");
  // Fill in login form
  await page.getByRole("textbox", { name: "Username" }).fill("admin1");
  await page.getByRole("textbox", { name: "Password" }).fill("123qwe");

  // Submit login form
  await page.getByRole("button", { name: "Login" }).click();

  // Verify successful login by checking for the presence of the create package button
  await expect(page.getByRole("button", { name: "plus เพิ่มแพ็คเกจ" })).toBeVisible();

  // Navigate to create package page
  await page.getByRole("button", { name: "plus เพิ่มแพ็คเกจ" }).click();

  // Fill in package details
  await page.getByRole("textbox", { name: "ชื่อแพ็คเกจทัวร์" }).fill("Testing");
  await page.locator(".ql-editor").fill("Testing");
  await page.getByRole("spinbutton", { name: "ราคาต่อคน" }).fill("1000");
  await page.getByRole("textbox", { name: "จุดนัดพบ" }).fill("Testing");
  await page.getByRole("textbox", { name: "จำนวนสูงสุดที่จองได้" }).fill("100");

  // Add travel date
  await page.getByRole("button", { name: "เลือกวันที่ down" }).click();
  await page.getByRole("button", { name: "plus เพิ่มวันที่" }).click();
  await page.getByRole("textbox", { name: "Select date" }).click();
  await page.getByText("31", { exact: true }).click();

  // Upload image
  const filePath = "front-end/public/Southex-logo.png";
  await page.locator('[role="dialog"] input[type="file"]').setInputFiles(filePath);

  // Submit package creation form
  await page.getByRole("button", { name: "สร้างแพ็คเกจ" }).click();
  await page.getByRole("button", { name: "[data-icon=close]" });
  await page.reload();
  // Verify successful package creation by checking for the presence of the package in the list
  await expect(page.locator('.package-list >> text="Testing"').first()).toBeVisible;
});
