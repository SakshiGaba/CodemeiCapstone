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

test('can edit an item and validate empty name is rejected', async ({ page }) => {
  await page.goto('/');

  const originalName = `Edit Me ${Date.now()}`;
  const updatedName = `Edited ${Date.now()}`;

  // Create a unique item per run
  await page.fill('input[placeholder="New item name"]', originalName);
  await page.click('button:has-text("Add")');
  await expect(page.locator('.item-list')).toContainText(originalName);

  const row = page.locator('li', { hasText: originalName });

  // Edit and save valid updated name
  await row.locator('button:has-text("Edit")').click();

  const editInput = row.locator('input');
  await expect(editInput).toBeVisible();
  await editInput.fill(updatedName);

  await row.locator('button:has-text("Save")').click();

  // Verify updated name appears and old name disappears (guards against false positives)
  await expect(page.locator('.item-list')).toContainText(updatedName);
  await expect(page.locator('.item-list')).not.toContainText(originalName);

  // Negative validation: cannot save empty/whitespace name; error shown; name not changed
  const updatedRow = page.locator('li', { hasText: updatedName });
  await updatedRow.locator('button:has-text("Edit")').click();

  const updatedEditInput = updatedRow.locator('input');
  await expect(updatedEditInput).toBeVisible();
  await updatedEditInput.fill('   ');

  await updatedRow.locator('button:has-text("Save")').click();

  // Verify an error is shown (common patterns: role=alert, .error, error text)
  const errorLocator = page.locator(
    '[role="alert"], .error, .error-message, text=/error|invalid|required|empty|name/i'
  );
  await expect(errorLocator.first()).toBeVisible();

  // Name should not have changed from the last valid saved value
  await expect(page.locator('.item-list')).toContainText(updatedName);
});