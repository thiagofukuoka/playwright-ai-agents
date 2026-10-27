# Practice Site Features

## Application Overview

HourToLearn practice site at http://localhost:3001 (Express, in-memory data, resets on restart; no baseURL configured so use absolute URLs). Plan covers 6 scenarios: native date input, table add user, kanban drag/drop, calendar add/delete event, iframe message, and new-tab link. Locators were taken from public/*.html and public/js/*.js. Pages resolve without .html extension (express.static extensions:['html']). All scenarios assume a fresh page load and a freshly started server.

## Test Scenarios

### 1. Practice Site Features

**Seed:** `tests/seed.spec.ts`

#### 1.1. Date Picker: Native Date Input

**File:** `tests-mcp/practice-features/date-picker-native.spec.ts`

**Steps:**
  1. Navigate to http://localhost:3001/date-picker
    - expect: h1 getByTestId('page-title') has text 'Date Picker'
    - expect: getByTestId('native-date-output') has text 'No date selected yet.'
    - expect: getByTestId('native-date-input') (id native-date, label 'Pick a date') is empty with placeholder 'YYYY-MM-DD'
  2. Note: the 'native' input is actually a readonly type=text field with a custom popup, NOT input[type=date]; do not use fill() (readonly) -- use the popup. Click getByTestId('native-date-input')
    - expect: getByTestId('native-date-popup') becomes visible
    - expect: getByTestId('native-date-popup-title') shows current 'Month YYYY' (e.g. 'October 2026')
  3. Optionally click getByTestId('native-date-next-month') once to go to the next month, read the title, then click the day button with exact text '15' inside getByTestId('native-date-days') (use getByRole('button',{name:'15',exact:true}) and exclude cells with class is-outside-month, as outside-month days also render as buttons). Day buttons in this popup have NO per-day data-testid (unlike the range picker's range-day-YYYY-MM-DD).
    - expect: Popup closes (native-date-popup hidden)
    - expect: getByTestId('native-date-input') has value in ISO format YYYY-MM-DD, e.g. '2026-11-15'
    - expect: getByTestId('native-date-output') has exact text 'Selected date: 2026-11-15' (format is 'Selected date: ' + YYYY-MM-DD, zero-padded)
  4. Re-click getByTestId('native-date-input') and pick another day
    - expect: Popup reopens on the month of the selected date, selected day has class is-selected-start
    - expect: Output text updates to 'Selected date: <new ISO date>'

#### 1.2. Table: Add a User

**File:** `tests-mcp/practice-features/table-add-user.spec.ts`

**Steps:**
  1. Navigate to http://localhost:3001/table
    - expect: getByTestId('page-title') has text 'Table'
    - expect: getByTestId('users-table') visible with header columns: (checkbox), 'Name', 'Email', 'Role', 'Age' (header testids table-sort-name/email/role/age)
    - expect: getByTestId('table-body') has 5 rows (pageSize 5), sorted by name asc; getByTestId('table-page-info') shows 'Page 1 of 5' (23 seed users)
  2. Fill getByTestId('add-user-name-input') (label 'Name', required) with 'Nila'
    - expect: Field contains 'Nila'
  3. Fill getByTestId('add-user-email-input') (label 'Email', type=email, required) with 'nila@hourtolearn.dev'
    - expect: Field contains the email
  4. Select 'Editor' in getByTestId('add-user-role-select') (options Viewer, Editor, Admin; label 'Role'); fill getByTestId('add-user-age-input') (label 'Age', number, optional, defaults to 25 if blank) with '30'
    - expect: Values set
  5. Click getByTestId('add-user-submit') (button 'Add user')
    - expect: POST /api/users returns 201
    - expect: Form resets (name/email/age empty, role back to Viewer); getByTestId('add-user-error-message') stays hidden
    - expect: Table reloads to page 1, search cleared. Because sort is by name asc, 'Nila' is NOT on page 1 (it comes after Max/Mia/Nora...), so page-info shows 'Page 1 of 5' (24 users -> still 5 pages)
  6. Fill getByTestId('table-search-input') (label 'Search users') with 'Nila' and wait for debounce (300ms) / response
    - expect: A row (getByTestId('table-body').getByRole('row') filtered by text 'Nila') appears with cells: name 'Nila', email 'nila@hourtolearn.dev', role 'Editor', age '30'
    - expect: Row testid is table-row-<id> (new id 24); other matching seed user 'Nina'/'Nora' do not match, but note 'Nila' substring only matches this row
  7. Negative (within same test or as additional assertions): reload page, submit form with empty Name and Email
    - expect: Native HTML5 validation blocks submission (required fields: Name and Email); no request sent. Server-side the message 'name and email are required' (400) would show in add-user-error-message

#### 1.3. Drag and Drop: Move a Task

**File:** `tests-mcp/practice-features/drag-drop-move-task.spec.ts`

**Steps:**
  1. Navigate to http://localhost:3001/drag-drop
    - expect: getByTestId('page-title') has text 'Drag & Drop'
    - expect: Three columns: getByTestId('kanban-column-todo') (h3 'To Do'), getByTestId('kanban-column-in-progress') (h3 'In Progress'), getByTestId('kanban-column-done') (h3 'Done'); each contains a .kanban-card-list[data-dropzone] with data-column todo / in-progress / done
    - expect: Cards are div[draggable=true] with testid kanban-card-<id>: To Do has kanban-card-1 'Write a locator strategy doc', kanban-card-2 'Set up CI pipeline', kanban-card-3 'Review flaky test report'; In Progress has kanban-card-4 'Automate the checkout flow', kanban-card-5 'Add visual regression checks'; Done has kanban-card-6 'Migrate to Playwright', kanban-card-7 'Retire old Selenium suite'
  2. Drag getByTestId('kanban-card-2') (text 'Set up CI pipeline') onto the dropzone inside getByTestId('kanban-column-in-progress') (locator '[data-testid=kanban-column-in-progress] [data-dropzone]') using locator.dragTo(). HTML5 DnD with dataTransfer; dragTo works in Chromium; if flaky fall back to manual hover/mouse down/up or dispatchEvent dragstart/dragover/drop with a DataTransfer
    - expect: Board re-renders: getByTestId('kanban-column-todo') no longer contains 'Set up CI pipeline' (To Do has 2 cards)
    - expect: getByTestId('kanban-column-in-progress') contains kanban-card-2 with text 'Set up CI pipeline' (3 cards); Done unchanged with 2 cards
  3. Click getByTestId('kanban-reset') (button 'Reset board')
    - expect: Board returns to initial 3/2/2 distribution with card 2 back in To Do

#### 1.4. Calendar: Add and Delete an Event

**File:** `tests-mcp/practice-features/calendar-add-delete-event.spec.ts`

**Steps:**
  1. Navigate to http://localhost:3001/calendar
    - expect: getByTestId('page-title') has text 'Calendar'
    - expect: getByTestId('calendar-month-label') shows current 'Month YYYY' (e.g. 'October 2026'); getByTestId('calendar-weekdays') shows Sun..Sat; getByTestId('calendar-grid') has 42 day cells
  2. Click getByTestId('calendar-next-month') (button 'Next >') once
    - expect: Month label advances to next month (e.g. 'November 2026')
  3. Click the day cell getByTestId('calendar-day-2026-11-15') (pattern calendar-day-YYYY-MM-DD, role=button, aria-label 'Add event on 2026-11-15'). Compute the date dynamically as 15th of next month.
    - expect: Cell gets class calendar-day-selected
    - expect: A form appears at the bottom of the card with text 'Add event for 2026-11-15', input getByTestId('calendar-event-input') (aria-label 'Event text', placeholder 'Short event description', auto-focused) and button getByTestId('calendar-event-save') ('Save event')
  4. Fill calendar-event-input with 'Team Meeting' and click calendar-event-save (pressing Enter also saves)
    - expect: Form disappears (selection cleared)
    - expect: getByTestId('calendar-day-2026-11-15') contains a chip (.calendar-event-chip) with text 'Team Meeting' and a delete button (testid calendar-event-delete-<id>, first id is 1, aria-label 'Delete event Team Meeting', text x)
  5. Click the delete button inside that chip (getByRole('button',{name:'Delete event Team Meeting'})). No confirm dialog is used -- deletion is immediate (no window.confirm in calendar.js)
    - expect: No dialog appears
    - expect: Chip 'Team Meeting' is removed from calendar-day-2026-11-15 and text 'Team Meeting' is no longer on the page
  6. Negative: select a day, leave input empty (or whitespace), click 'Save event'
    - expect: Nothing is saved and the form remains open

#### 1.5. Frames and Windows: Display a Message in an Embedded Frame

**File:** `tests-mcp/practice-features/frames-embedded-message.spec.ts`

**Steps:**
  1. Navigate to http://localhost:3001/frames-windows
    - expect: getByTestId('page-title') has text 'Frames & Windows'
    - expect: iframe getByTestId('embedded-frame') (class embedded-frame, title 'Embedded frame content', src /iframe-content.html) is visible
  2. Create const frame = page.frameLocator('[data-testid="embedded-frame"]') (or page.frameLocator('iframe[title="Embedded frame content"]')). Verify frame.getByText('Type something') label is visible, and frame.getByTestId('frame-message') is empty
    - expect: Elements inside frame: input frame.getByTestId('frame-input') (id frame-input, label 'Type something'), button frame.getByTestId('frame-button') (text 'Show message'), paragraph frame.getByTestId('frame-message') initially empty
  3. Fill frame.getByTestId('frame-input') with 'Hello Playwright' and click frame.getByTestId('frame-button')
    - expect: frame.getByTestId('frame-message') has exact text 'Hello from inside the frame: Hello Playwright' (format: 'Hello from inside the frame: ' + input value)
  4. Edge case: clear input and click button again
    - expect: Message becomes 'Hello from inside the frame: ' (prefix with empty value, trailing space trimmed by toHaveText normalization)

#### 1.6. Frames and Windows: Open Content in a New Page

**File:** `tests-mcp/practice-features/frames-new-tab.spec.ts`

**Steps:**
  1. Navigate to http://localhost:3001/frames-windows
    - expect: Link getByTestId('open-new-tab-link') (role link, name 'Open in new tab', href '/dynamic-content', target '_blank') is visible in the 'New tab' card whose subtitle says 'Opens the Dynamic Content page in a new browser tab.'
  2. Start const pagePromise = context.waitForEvent('page') (or page.waitForEvent('popup')), then click getByTestId('open-new-tab-link')
    - expect: A new page is opened
  3. const newPage = await pagePromise; await newPage.waitForLoadState()
    - expect: newPage URL is http://localhost:3001/dynamic-content (toHaveURL(/\/dynamic-content$/))
    - expect: newPage title is 'Dynamic Content · HourToLearn Practice Site'
    - expect: newPage.getByTestId('page-title') (h1) has exact text 'Dynamic Content'; getByRole('heading',{name:'Dynamic Content'}) visible
    - expect: Page also contains cards 'Show after delay', 'Load items from server', 'Disappearing element'
    - expect: Original page remains on /frames-windows
