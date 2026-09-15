# Kanaаa OTP Authentication QA Practical

Playwright starter for the Kanaаa storefront authentication assignment.

## Setup

```powershell
npm install
npx playwright install chromium
$env:BASE_URL='https://thekanaa.com/ar-sa/'
```

Do not put real customer data, passwords, OTPs, API keys, access tokens, or production credentials in this repository.

## Run

```powershell
npx playwright test
npx playwright test --headed
npx playwright test tests/authentication.spec.ts
npx playwright show-report
```

The configuration captures an HTML report, screenshots, traces, and videos for failures. It covers Chromium desktop and a mobile Chromium viewport.

## OTP strategy

The live application exposes OTP-based authentication, but this submission must not bypass it or read a real customer’s mailbox/WhatsApp. In a production QA environment, use a test OTP API, mock OTP service, controlled test mailbox/API, or a test-only backend hook. If none is available, report the scenarios as blocked and explain the safe CI design rather than hard-coding an OTP.

## Current scope

The included smoke tests use the verified homepage entry point and the assignment route observation. See `docs/test-scenarios.md` for the full planned matrix and `BUG-REPORT.md` for evidence-based findings.
