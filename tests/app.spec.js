const { test, expect } = require('@playwright/test');

test('homepage loads with heading', async ({ page }) => {
  await page.goto('/');
  await expect(page.getByRole('heading', { level: 1 })).toHaveText('Items');
});

test('can add a new item', async ({ page }) => {
  await page.goto('/');
  const uniqueName = `Test Item ${Date.now()}`;

  await page.getByPlaceholder('New item name').fill(uniqueName);
  await page.getByRole('button', { name: /^add$/i }).click();

  await expect(page.locator('.item-list')).toContainText(uniqueName);
});

test('can delete an item', async ({ page }) => {
  await page.goto('/');
  const uniqueName = `Delete Me ${Date.now()}`;

  await page.getByPlaceholder('New item name').fill(uniqueName);
  await page.getByRole('button', { name: /^add$/i }).click();
  await expect(page.locator('.item-list')).toContainText(uniqueName);

  const row = page.getByRole('listitem').filter({ hasText: uniqueName });
  await row.getByRole('button', { name: /^delete$/i }).click();

  await expect(page.locator('.item-list')).not.toContainText(uniqueName);
});

test('can edit an item', async ({ page }) => {
  await page.goto('/');
  const originalName = `Edit Me ${Date.now()}`;
  const updatedName = `Edited ${Date.now()}`;

  await page.getByPlaceholder('New item name').fill(originalName);
  await page.getByRole('button', { name: /^add$/i }).click();

  const list = page.locator('.item-list');
  await expect(list).toContainText(originalName);

  const row = page.getByRole('listitem').filter({ hasText: originalName });
  await row.getByRole('button', { name: /^edit$/i }).click();

  const editInput = row.getByRole('textbox').first();
  await expect(editInput).toBeVisible();

  await editInput.fill(updatedName);
  await row.getByRole('button', { name: /^save$/i }).click();

  await expect(list).toContainText(updatedName);
  await expect(list).not.toContainText(originalName);
});