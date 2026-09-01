const { test, expect } = require('@playwright/test');

test('homepage loads with heading', async ({ page }) => {
  await page.goto('/');
  await expect(page.getByRole('heading', { level: 1, name: 'Items' })).toBeVisible();
});

test('can add a new item', async ({ page }) => {
  await page.goto('/');
  const uniqueName = `Test Item ${Date.now()}`;

  const input = page.getByPlaceholder('New item name');
  await input.fill(uniqueName);

  await page.getByRole('button', { name: 'Add' }).click();

  await expect(page.locator('.item-list')).toContainText(uniqueName);
});

test('can edit an item inline and save', async ({ page }) => {
  await page.goto('/');
  const originalName = `Edit Me ${Date.now()}`;
  const updatedName = `Edited ${Date.now()}`;

  await page.getByPlaceholder('New item name').fill(originalName);
  await page.getByRole('button', { name: 'Add' }).click();

  const itemRow = page.getByRole('listitem').filter({ hasText: originalName });
  await expect(itemRow).toBeVisible();

  const editButton = itemRow.getByRole('button', { name: /edit/i });
  await editButton.click();

  // Prefer accessibility-driven selectors for the inline editor; fall back to an input inside the row.
  const editorInput = itemRow
    .getByRole('textbox')
    .or(itemRow.locator('input'))
    .first();

  await expect(editorInput).toBeVisible();
  await editorInput.fill(updatedName);

  // Prefer "Save" button, but handle possible "Update" naming.
  const saveButton = itemRow
    .getByRole('button', { name: /save/i })
    .or(itemRow.getByRole('button', { name: /update/i }))
    .first();

  await saveButton.click();

  await expect(page.locator('.item-list')).toContainText(updatedName);
  await expect(page.locator('.item-list')).not.toContainText(originalName);
});

test('can delete an item', async ({ page }) => {
  await page.goto('/');
  const uniqueName = `Delete Me ${Date.now()}`;

  await page.getByPlaceholder('New item name').fill(uniqueName);
  await page.getByRole('button', { name: 'Add' }).click();
  await expect(page.locator('.item-list')).toContainText(uniqueName);

  const row = page.getByRole('listitem').filter({ hasText: uniqueName });
  await row.getByRole('button', { name: 'Delete' }).click();

  await expect(page.locator('.item-list')).not.toContainText(uniqueName);
});