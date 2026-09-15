import { test, expect } from '@playwright/test';

const identifier = 'qa.user@example.test';

test.describe('OTP flows against the local mock service', () => {
  test('registers with a valid email OTP', async ({ page }) => {
    await page.goto('/');
    await page.getByRole('button', { name: 'Register' }).click();
    await page.locator('#identifier').fill(identifier);
    await page.locator('#channel').selectOption('email');
    await page.getByRole('button', { name: 'Request OTP' }).click();
    await expect(page.locator('#message')).toContainText('OTP sent by email');
    await page.locator('#otpInput').fill('123456');
    await page.getByRole('button', { name: 'Verify OTP' }).click();
    await expect(page.locator('[data-testid="authenticated"]')).toHaveText('Authenticated customer');
  });

  test('rejects an invalid OTP', async ({ page }) => {
    await page.goto('/');
    await page.getByRole('button', { name: 'Login' }).click();
    await page.locator('#identifier').fill(identifier);
    await page.getByRole('button', { name: 'Request OTP' }).click();
    await page.locator('#otpInput').fill('000000');
    await page.getByRole('button', { name: 'Verify OTP' }).click();
    await expect(page.locator('#otpMessage')).toHaveText('Invalid OTP');
  });

  test('validates empty and malformed identifiers', async ({ page }) => {
    await page.goto('/');
    await page.getByRole('button', { name: 'Request OTP' }).click();
    await expect(page.locator('#message')).toHaveText('Identifier is required');
    await page.locator('#identifier').fill('not-an-identifier');
    await page.getByRole('button', { name: 'Request OTP' }).click();
    await expect(page.locator('#message')).toHaveText('Enter a valid email or mobile number');
  });

  test('supports WhatsApp OTP and resend', async ({ page }) => {
    await page.goto('/');
    await page.getByRole('button', { name: 'Register' }).click();
    await page.locator('#identifier').fill('+15550001234');
    await page.locator('#channel').selectOption('whatsapp');
    await page.getByRole('button', { name: 'Request OTP' }).click();
    await expect(page.locator('#message')).toContainText('OTP sent by whatsapp');
    await page.getByRole('button', { name: 'Resend OTP' }).click();
    await expect(page.locator('#otpMessage')).toHaveText('A new OTP was sent');
  });

  test('keeps the authenticated session on the account page', async ({ page }) => {
    await page.goto('/');
    await page.getByRole('button', { name: 'Register' }).click();
    await page.locator('#identifier').fill('session.user@example.test');
    await page.getByRole('button', { name: 'Request OTP' }).click();
    await page.locator('#otpInput').fill('123456');
    await Promise.all([
      page.waitForURL('**/account'),
      page.getByRole('button', { name: 'Verify OTP' }).click(),
    ]);
    const refreshedPage = await page.context().newPage();
    await refreshedPage.goto('/account');
    await expect(refreshedPage.locator('[data-testid="authenticated"]')).toBeVisible();
  });
});
