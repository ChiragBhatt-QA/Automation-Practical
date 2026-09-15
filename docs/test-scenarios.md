# Test scenarios

The assignment requires registration, login, email/WhatsApp OTP where available, negative validation, resend/expiry, session protection, and mobile/browser coverage.

## Implemented in this starter

| ID | Scenario | Status after your run |
|---|---|---|
| TC-AUTH-001 | Homepage registration entry opens OTP identifier form | Passed - Chromium desktop (2 tests passed on 2026-09-15) |
| TC-AUTH-002 | Verify the assignment example route behavior is documented | Passed - Chromium desktop (2 tests passed on 2026-09-15) |

Mobile Chromium: Not executed successfully - the run stopped during the first test before a final result was produced. Do not report mobile as passed.

## Blocked or not executed

- Registration and login with valid test data and email/WhatsApp OTP - **Blocked**: no controlled OTP mechanism or test account.
- Empty, malformed, incomplete, boundary, and duplicate identifier data - **Not executed**.
- Empty, incomplete, invalid, expired, and repeated OTP attempts - **Blocked**: requires controlled OTP mechanism.
- Resend timer and newest-OTP behavior - **Blocked**: requires controlled OTP mechanism.
- Authenticated session refresh and unauthenticated protected-page access - **Blocked**: requires safe authenticated test account.
- API response status/error handling - **Not executed**.
- Mobile viewport execution - **Not executed successfully**: run stopped before final result.

Do not mark any scenario passed without a recorded run, assertion, and evidence.
