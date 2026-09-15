import { test, expect } from '@playwright/test';

const registrationLabel = '\u0627\u0644\u062a\u0633\u062c\u064a\u0644';
const identifierPlaceholder = '\u0623\u062f\u062e\u0644 \u0631\u0642\u0645 \u0627\u0644\u062c\u0648\u0627\u0644 \u0623\u0648 \u0627\u0644\u0628\u0631\u064a\u062f \u0627\u0644\u0625\u0644\u0643\u062a\u0631\u0648\u0646\u064a';
const notFoundMessage = '\u0644\u0645 \u0646\u062a\u0645\u0643\u0646 \u0645\u0646 \u0625\u064a\u062c\u0627\u062f \u0627\u0644\u0635\u0641\u062d\u0629 \u0627\u0644\u062a\u064a \u062a\u0628\u062d\u062b \u0639\u0646\u0647\u0627.';

test.describe('OTP authentication entry point', () => {
  test('registration/login entry opens the OTP identifier form', async ({ page }) => {
    await page.goto('/');
    const registrationEntry = page.getByText(registrationLabel, { exact: true });
    if (!(await registrationEntry.isVisible())) await page.locator('img[alt="Open menu"]').click();
    await expect(registrationEntry).toBeVisible();
    await registrationEntry.click();
    const identifier = page.locator('input[name="identifier"]');
    await expect(identifier).toBeVisible();
    await expect(identifier).toHaveAttribute('placeholder', identifierPlaceholder);
  });

  test('assignment example auth route is documented as unavailable, not assumed', async ({ page }) => {
    await page.goto('/en-us/login');
    await expect(page.locator('body')).toContainText(notFoundMessage);
  });
});
