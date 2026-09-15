# Bug report / verified observations

## Observation OBS-001 — Assignment example auth route does not resolve directly

- **Environment:** live site, checked 2026-09-15, Chromium via Playwright.
- **Steps:** Open `https://thekanaa.com/en-us/login` (or `/en-us/register`).
- **Observed:** URL is rewritten under the Arabic locale and the page displays “لم نتمكن من إيجاد الصفحة التي تبحث عنها.” (page not found).
- **Classification:** Assignment/reference mismatch until the product owner confirms these are intended public routes; do not present this as a product defect without confirmation.
- **Evidence:** `tests/authentication.spec.ts`, HTML report, and failure artifacts if applicable.

## Verified live behavior (not a bug)

The actual visible entry point is the homepage control “التسجيل”. Clicking it opens an OTP modal containing `input[name="identifier"]` with placeholder “أدخل رقم الجوال أو البريد الإلكتروني”.

## Unverified / do not claim

No successful registration, login, OTP, resend, expiry, session, or WhatsApp result is claimed yet. The live site must provide a safe test OTP mechanism or those scenarios must be documented as blocked.
