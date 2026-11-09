# Google Forms RSVP

The website embeds a published Google responder form and offers an external link as a fallback. No application backend, submission endpoint, credentials or tracking have been added.

## Create and connect the real form

1. Create a Google Form named **Xác nhận tham dự — Tuấn Vũ & Tuyết Mai** in the owner's Google account.
2. Suggested questions: name (required), inviting side (Nhà trai / Nhà gái, required), attendance (Có / Không / Chưa chắc, required), total attending including the respondent (number, zero allowed), optional message. Do not require email or phone.
3. Under Responses, link to a new Google Sheet named **RSVP — Tuấn Vũ & Tuyết Mai**. Keep response data private to the owner and authorized family members; do not publish the Sheet or enable respondent access to response summaries.
4. Publish/share the form for invited responders. Check signed-out access. Do not enable settings that require Google sign-in (such as limiting to one response). If the account's organization enforces sign-in, resolve that restriction with the owner before using the form for guests.
5. Copy the full responder URL ending in `/viewform` into `wedding.rsvp.formUrl` in `src/config/wedding.ts`. Expand a `forms.gle` short link in the browser first. Do not use the editor URL, iframe markup, or Sheet URL.
6. Set `embedHeight` to fit the real form on a phone (initial value: 1100px). Cross-origin forms cannot be automatically resized or styled by the parent website.
7. Check the form at phone and desktop widths, tab through it, and submit an explicitly labeled test response. Confirm Google displays its confirmation and the row appears in the linked Sheet. Check the external fallback link. Remove the test response from both Forms and Sheets as appropriate.
8. Run typecheck, lint, tests and build; commit and push the configured source to deploy.

## Submission behavior

- With an empty or invalid URL, the existing unavailable message remains. There is no placeholder form and no simulated submission.
- With a valid URL, the browser loads Google Forms in a titled, lazy iframe. Introductory text and all labels are configured in `wedding.ts`.
- Google handles validation, sending, response storage and the confirmation inside the iframe. The outer page does not interpret iframe load/error events as submission success and cannot verify a saved response across origins.
- A visible fallback link remains available even if the embed is blocked or cannot load. It opens the same respondent form in a new tab.
- Embedding Google Forms connects the visitor's browser to Google; local wedding images and other assets remain local.

References: [publish and embed forms](https://support.google.com/docs/answer/2839588), [choose where to save responses](https://support.google.com/docs/answer/2917686).
