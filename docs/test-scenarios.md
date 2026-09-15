# Test scenarios

The assignment requires registration, login, email/WhatsApp OTP where available, negative validation, resend/expiry, session protection, and mobile/browser coverage.

## Implemented in this starter

| ID | Scenario | Status after your run |
|---|---|---|
| TC-AUTH-001 | Homepage registration entry opens OTP identifier form | Passed - Chromium desktop (2 tests passed on 2026-09-15) |
| TC-AUTH-002 | Verify the assignment example route behavior is documented | Passed - Chromium desktop (2 tests passed on 2026-09-15) |

Mobile Chromium: Not executed successfully - the run stopped during the first test before a final result was produced. Do not report mobile as passed.

Local mock OTP coverage: use `npx playwright test --project=local-mock`. These tests use fake identifiers and OTP `123456` only against `mock-app/server.js`; they do not prove the live Kanaa OTP service.

## Blocked or not executed

- Live registration and login with valid test data and email/WhatsApp OTP - **Blocked**: no controlled live OTP mechanism or test account.
- Local mock registration/login with email and WhatsApp OTP - **Implemented**: fake data and OTP `123456`.
- Empty and malformed identifier data against local mock - **Implemented**.
- Empty, incomplete, invalid, expired, and repeated live OTP attempts - **Blocked**: requires controlled live OTP mechanism.
- Resend OTP against local mock - **Implemented**; live resend remains blocked.
- Authenticated session refresh and unauthenticated protected-page access - **Blocked**: requires safe authenticated test account.
- API response status/error handling - **Not executed**.
- Mobile viewport execution - **Not executed successfully**: run stopped before final result.

Do not mark any scenario passed without a recorded run, assertion, and evidence.
