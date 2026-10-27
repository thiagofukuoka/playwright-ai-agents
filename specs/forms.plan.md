# Forms Page Test Plan

## Application Overview

Test plan for the Support request form at /forms of the HourToLearn practice site (baseURL http://localhost:3001). The form is client-side only (novalidate, submit handler calls preventDefault, no network request). Fields: full name (text), email, password, topic (select), message (textarea), contact preferences (3 checkboxes, optional), urgency (3 radios, required). Required: all except contact preferences. Banners: form-error-message (role=alert) and form-success-message (role=status). Test IDs: page-title, full-name-input/-error, email-input/-error, password-input/-error, topic-select/-error, message-textarea/-error, contact-email-checkbox, contact-sms-checkbox, contact-phone-checkbox, urgency-low-radio, urgency-medium-radio, urgency-high-radio, urgency-error, form-error-message, form-success-message, submit-button, reset-button, home-card-forms. Every scenario starts from a fresh page.goto('/forms') unless stated, and assumes a blank state. "Valid baseline" = Full name "Jane Doe", Email "jane@example.com", Password "Passw0rd!", Topic billing, Message "I need help", Urgency low. Observed in-browser: empty submit shows all 6 field errors plus banner "Please fix the highlighted fields and try again."; success banner text is "Form submitted successfully"; errors do NOT clear while typing; no network request on submit; focus is not moved to the first invalid field. Items marked [BUG] describe the CORRECT expected behavior that the app does not implement yet; their tests assert the correct behavior and fail until the bug is fixed.

## Test Scenarios

### 1. Happy Path

**Seed:** `tests/seed.spec.ts`

#### 1.1. Initial page state

**File:** `tests-mcp/forms/initial-state.spec.ts`

**Steps:**
  1. Navigate to /forms
    - expect: Title is 'Forms · HourToLearn Practice Site'
    - expect: page-title has text 'Forms'
  2. Inspect all form controls
    - expect: full-name, email, password, message are empty
    - expect: topic-select value is '' (placeholder 'Select a topic…')
    - expect: All 3 contact checkboxes unchecked, all 3 urgency radios unchecked
    - expect: submit-button 'Submit request' and reset-button 'Reset' visible and enabled
    - expect: Password hint 'At least 8 characters.' visible
  3. Check banners and errors
    - expect: form-error-message, form-success-message and all 6 *-error elements are hidden
    - expect: Inputs have no aria-invalid attribute yet

#### 1.2. Navigate to Forms from home page card

**File:** `tests-mcp/forms/navigation-home-card.spec.ts`

**Steps:**
  1. Go to / and click getByTestId('home-card-forms')
    - expect: URL becomes /forms
    - expect: page-title shows 'Forms' and form is in initial state
  2. Go to / and click sidebar link getByTestId('nav-forms')
    - expect: URL is /forms

#### 1.3. Submit valid form with required fields only

**File:** `tests-mcp/forms/valid-submit-required-only.spec.ts`

**Steps:**
  1. Fill the valid baseline (no contact checkboxes) and click submit-button
    - expect: form-success-message visible with text 'Form submitted successfully'
    - expect: form-error-message and all field errors hidden
    - expect: All inputs have aria-invalid='false'
    - expect: No page navigation/reload (URL stays /forms)
  2. Inspect field values after success
    - expect: [BUG] Form is cleared after success: text inputs and textarea empty, topic '' and no urgency radio checked, while the success banner stays visible (today values are retained)

#### 1.4. Submit valid form with every topic option

**File:** `tests-mcp/forms/valid-submit-each-topic.spec.ts`

**Steps:**
  1. For each of billing, technical, account, other: reload /forms, fill baseline, selectOption(value), submit
    - expect: Success banner visible each time
    - expect: topic-error hidden
    - expect: Select shows the chosen option label (Billing, Technical issue, Account access, Other)

#### 1.5. Submit valid form with every urgency level

**File:** `tests-mcp/forms/valid-submit-each-urgency.spec.ts`

**Steps:**
  1. For each of urgency-low-radio, urgency-medium-radio, urgency-high-radio: reload, fill baseline with that radio checked, submit
    - expect: Success banner visible each time
    - expect: urgency-error hidden

#### 1.6. Optional contact preference checkboxes

**File:** `tests-mcp/forms/contact-checkboxes.spec.ts`

**Steps:**
  1. Check contact-email-checkbox, contact-sms-checkbox, contact-phone-checkbox individually and together, then uncheck them
    - expect: Each toggles independently; multiple can be checked at once
  2. Fill baseline with all three checked and submit
    - expect: Success banner visible
  3. Reload, fill baseline with none checked and submit
    - expect: Success banner visible (checkboxes are optional)
  4. Click the label text 'Email me updates'
    - expect: contact-email-checkbox becomes checked (label wired to input)

#### 1.7. Submit via Enter key

**File:** `tests-mcp/forms/submit-via-enter.spec.ts`

**Steps:**
  1. Fill baseline, focus full-name-input and press Enter
    - expect: Success banner visible (implicit form submission)
  2. Reload, fill baseline, focus email-input and press Enter
    - expect: Success banner visible
  3. Focus message-textarea and press Enter
    - expect: A newline is added to the textarea; form is NOT submitted

#### 1.8. Reset clears values and success banner

**File:** `tests-mcp/forms/reset-after-success.spec.ts`

**Steps:**
  1. Fill baseline plus all checkboxes, submit successfully, click reset-button
    - expect: All text fields empty, topic back to placeholder, checkboxes and radios unchecked
    - expect: Success banner hidden
    - expect: Further submit shows all required errors (fresh state)

#### 1.9. Reset on pristine form is harmless

**File:** `tests-mcp/forms/reset-pristine.spec.ts`

**Steps:**
  1. Click reset-button immediately on fresh page
    - expect: Nothing changes, no banners or errors appear, no console errors

#### 1.10. Keyboard-only completion

**File:** `tests-mcp/forms/keyboard-only.spec.ts`

**Steps:**
  1. Use Tab, typing, ArrowDown on the select, Space on checkbox/radio to complete baseline, then Tab to submit-button and press Enter/Space
    - expect: Tab order: name, email, password, topic, message, 3 checkboxes, radio group, submit, reset
    - expect: Success banner visible

#### 1.11. Valid special, unicode and long input accepted

**File:** `tests-mcp/forms/special-input-accepted.spec.ts`

**Steps:**
  1. Fill name "O'Brien <b>", email 'a+b@sub.example.co', password 'pässwörd', topic technical, message '<script>alert(1)</script> ñ 日本語 😀' followed by 5000 'x', urgency low; submit
    - expect: Success banner shown
    - expect: No JS dialog/alert fires and no script executes (nothing is rendered as HTML)
    - expect: No console errors

### 2. Edge Cases and Negative Scenarios

**Seed:** `tests/seed.spec.ts`

#### 2.1. Empty submit shows all errors

**File:** `tests-mcp/forms/empty-submit.spec.ts`

**Steps:**
  1. Click submit-button on untouched form
    - expect: Errors visible: 'Full name is required.', 'A valid email is required.', 'Password must be at least 8 characters.', 'Please choose a topic.', 'Please describe your issue.', 'Please select an urgency level.'
    - expect: form-error-message visible with 'Please fix the highlighted fields and try again.'
    - expect: Success banner hidden
    - expect: aria-invalid='true' on name, email, password, topic, message inputs
  2. Check focus
    - expect: [BUG] Focus moves to the first invalid field (full-name-input) in all browsers (today focus is not moved)

#### 2.2. Each required field missing individually

**File:** `tests-mcp/forms/each-required-missing.spec.ts`

**Steps:**
  1. For each of name, email, password, topic, message, urgency: reload, fill baseline but leave only that field blank, submit
    - expect: Only that field's error is visible; the other 5 errors hidden
    - expect: form-error-message visible; success hidden
    - expect: Only the blank field has aria-invalid='true'; others 'false'

#### 2.3. Whitespace-only name and message rejected

**File:** `tests-mcp/forms/whitespace-name-message.spec.ts`

**Steps:**
  1. Fill baseline but name '     ' and submit
    - expect: full-name-error visible (value is trimmed)
  2. Reload, fill baseline but message '   \n  ' and submit
    - expect: message-error visible

#### 2.4. Password length boundary 7 vs 8

**File:** `tests-mcp/forms/password-boundary.spec.ts`

**Steps:**
  1. Fill baseline with password '1234567' (7) and submit
    - expect: password-error visible, no success
  2. Reload, password '12345678' (8) and submit
    - expect: No password error, success shown
  3. Reload, password of 9 and 128 chars
    - expect: Accepted

#### 2.5. Whitespace-only password is rejected

**File:** `tests-mcp/forms/password-whitespace.spec.ts`

**Steps:**
  1. Fill baseline with password of 8 spaces and submit
    - expect: [BUG] password-error visible and no success (today it is accepted because the password is not trimmed)
  2. Reload, password of 7 spaces and submit
    - expect: password-error visible (length < 8)
  3. Reload, password '       a' (7 spaces+a) and submit
    - expect: Accepted (length 8)

#### 2.6. Email invalid formats rejected

**File:** `tests-mcp/forms/email-invalid.spec.ts`

**Steps:**
  1. For each of 'plainaddress', 'jane@example', 'jane@.com', '@x.com', 'jane@@x.com', 'jane doe@x.com': reload, fill baseline with that email, submit
    - expect: email-error visible each time; no success

#### 2.7. Email format edge cases that pass the regex

**File:** `tests-mcp/forms/email-lenient.spec.ts`

**Steps:** (each value is a separate test starting from a fresh page)
  1. Submit baseline with email 'a@b.c'
    - expect: [BUG] email-error visible and no success; a one-char TLD is rejected (today it is accepted)
  2. Submit with 'jane@x..com'
    - expect: [BUG] email-error visible and no success; consecutive dots are rejected (today it is accepted)
  3. Submit with 'a@b.c.' (trailing dot)
    - expect: [BUG] email-error visible and no success; a trailing dot is rejected (today it is accepted)
  4. Submit with ' jane@x.com ' (leading/trailing spaces)
    - expect: Accepted because the value is trimmed (note: type=email also sanitizes spaces)
  5. Confirm 'jane@.com' is rejected
    - expect: email-error visible (does not wrongly pass)

#### 2.8. Re-selecting topic placeholder

**File:** `tests-mcp/forms/topic-placeholder.spec.ts`

**Steps:**
  1. Fill baseline, select 'billing', then selectOption('') (placeholder) and submit
    - expect: topic-error visible; other fields valid
    - expect: Select value is ''

#### 2.9. Urgency radios mutually exclusive

**File:** `tests-mcp/forms/radio-exclusive.spec.ts`

**Steps:**
  1. Check low, then medium, then high
    - expect: Only the last is checked each time; previous becomes unchecked
  2. Click an already checked radio
    - expect: It stays checked (radios cannot be unchecked by clicking)

#### 2.10. Fix errors and resubmit

**File:** `tests-mcp/forms/fix-and-resubmit.spec.ts`

**Steps:**
  1. Submit empty form, then fill all fields with valid values without submitting
    - expect: [BUG] Each field's error hides as soon as that field becomes valid (today errors remain visible until the next submit)
  2. Click submit-button
    - expect: All errors and error banner disappear, success banner visible, aria-invalid='false' on all inputs

#### 2.11. Errors clear as each field is fixed

**File:** `tests-mcp/forms/errors-clear-on-fix.spec.ts`

**Steps:**
  1. Submit empty form, type 'Jane' in full-name-input, select topic, check a radio
    - expect: [BUG] Each fixed field's error hides immediately and its aria-invalid becomes 'false' (today errors remain visible until the next submit)

#### 2.12. Partial fix keeps remaining errors

**File:** `tests-mcp/forms/partial-fix.spec.ts`

**Steps:**
  1. Submit empty, fix only name and email, submit again
    - expect: name/email errors hidden; password, topic, message, urgency errors still visible; error banner visible

#### 2.13. Invalid resubmit after success

**File:** `tests-mcp/forms/invalid-after-success.spec.ts`

**Steps:**
  1. Submit valid baseline (success), then change email to 'bad' and submit
    - expect: Success banner hidden, error banner visible, only email-error visible

#### 2.14. Reset after errors

**File:** `tests-mcp/forms/reset-after-errors.spec.ts`

**Steps:**
  1. Submit empty form (errors shown), click reset-button
    - expect: All field errors and error banner hidden, aria-invalid='false' on inputs
  2. Fill partial data, submit (errors), reset
    - expect: Values cleared and errors hidden

#### 2.15. Double submit and repeated invalid submits

**File:** `tests-mcp/forms/repeat-submit.spec.ts`

**Steps:**
  1. Click submit-button twice on empty form
    - expect: Errors not duplicated; single set of messages and one banner
  2. Submit valid baseline twice
    - expect: Success banner stays visible, no duplication

#### 2.16. Special, script-like and unicode input

**File:** `tests-mcp/forms/special-input.spec.ts`

**Steps:**
  1. Enter '<script>alert(1)</script>' in name and message, SQL-like "'; DROP TABLE users;--", emoji and RTL text
    - expect: Values are treated as plain text, no dialog fires, success shown with valid other fields

#### 2.17. Very long input

**File:** `tests-mcp/forms/long-input.spec.ts`

**Steps:**
  1. Fill name with 10000 chars, message with 50000 chars, submit
    - expect: Success shown, page remains responsive and layout not broken (no maxlength restrictions)

#### 2.18. No network request on submit

**File:** `tests-mcp/forms/no-network-on-submit.spec.ts`

**Steps:**
  1. Register page.on('request') (ignore static assets), submit valid baseline and also invalid form
    - expect: No POST/GET/fetch/XHR request is issued; URL unchanged; no reload

#### 2.19. Accessibility wiring: labels and roles

**File:** `tests-mcp/forms/a11y-labels-roles.spec.ts`

**Steps:**
  1. Use getByLabel for 'Full name', 'Email', 'Password', 'Topic', 'Message', 'Email me updates', 'Text me updates', 'Call me about this', 'Low', 'Medium', 'High'
    - expect: Each resolves to exactly one control
  2. Use getByRole('group', {name: 'Contact preferences'}) and 'How urgent is this?', and roles textbox/combobox/radio/checkbox/button
    - expect: Fieldsets exposed as named groups; controls have expected roles
  3. Submit empty and check banners
    - expect: form-error-message has role='alert'; form-success-message has role='status'

#### 2.20. Accessibility wiring: aria-invalid and aria-describedby

**File:** `tests-mcp/forms/a11y-aria-invalid.spec.ts`

**Steps:**
  1. Before submit, read aria-describedby on each input
    - expect: name->full-name-error, email->email-error, password->'password-hint password-error', topic->topic-error, message->message-error; urgency fieldset->urgency-error
  2. Submit empty then fix and resubmit valid
    - expect: aria-invalid goes absent -> 'true' -> 'false'
    - expect: Error elements referenced by aria-describedby are the visible error texts
  3. Check radios on error
    - expect: [BUG] Each urgency radio gets aria-invalid='true' when urgency is missing, and aria-invalid='false' after a valid resubmit (today the radios never get aria-invalid)

#### 2.21. Layout at small viewport has no horizontal scroll

**File:** `tests-mcp/forms/responsive.spec.ts`

**Steps:**
  1. Set viewport 375x667, load /forms, submit empty
    - expect: All fields and error messages are reachable and visible
    - expect: [BUG] The page does not scroll horizontally (scrollWidth <= clientWidth); today the fixed 250px sidebar and 200px min-width fields make it 564px wide
