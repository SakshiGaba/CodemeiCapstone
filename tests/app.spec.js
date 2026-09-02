const { test, expect } = require('@playwright/test');

test('homepage loads with heading', async ({ page }) => {
  await page.goto('/');
  await expect(page.locator('h1')).toHaveText('Items');
});

test('can add a new item', async ({ page }) => {
  await page.goto('/');
  const uniqueName = `Test Item ${Date.now()}`;

  await page.fill('input[placeholder="New item name"]', uniqueName);
  await page.click('button:has-text("Add")');

  await expect(page.locator('.item-list')).toContainText(uniqueName);
});

test('can delete an item', async ({ page }) => {
  await page.goto('/');
  const uniqueName = `Delete Me ${Date.now()}`;

  await page.fill('input[placeholder="New item name"]', uniqueName);
  await page.click('button:has-text("Add")');
  await expect(page.locator('.item-list')).toContainText(uniqueName);

  const row = page.locator('li', { hasText: uniqueName });
  await row.locator('button:has-text("Delete")').click();

  await expect(page.locator('.item-list')).not.toContainText(uniqueName);
});

test('can edit an existing item', async ({ page }) => {
  await page.goto('/');
  const originalName = `Original Item ${Date.now()}`;
  const updatedName = `Updated Item ${Date.now()}`;

  await page.fill('input[placeholder="New item name"]', originalName);
  await page.click('button:has-text("Add")');
  await expect(page.locator('.item-list')).toContainText(originalName);

  const rowIndex = await page
    .locator('.item-list li')
    .evaluateAll((lis, name) => lis.findIndex((li) => li.textContent.includes(name)), originalName);
  const row = page.locator('.item-list li').nth(rowIndex);

  await row.locator('button:has-text("Edit")').click();

  const editInput = row.locator('input');
  await expect(editInput).toHaveValue(originalName);
  await editInput.fill(updatedName);
  await row.locator('button:has-text("Save")').click();

  await expect(page.locator('.item-list')).toContainText(updatedName);
  await expect(page.locator('.item-list')).not.toContainText(originalName);
});
