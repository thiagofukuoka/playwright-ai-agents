# Login Test Plan

## Application Overview

Test plan for the Login page at /login of the HourToLearn practice site (baseURL http://localhost:3001). The form posts `{ username, password }` as JSON to `POST /login`; on success the server sets the `pw_session` cookie and responds 200 `{ message: 'Login successful' }`, the page shows the `login-success-message` banner and redirects to /account after ~800ms (too short to assert reliably). /account is protected and shows a welcome message and a Log out button. Demo credentials: `student` / `Learn123!`. Test IDs: nav-login, page-title, login-username, login-password, login-submit, login-success-message, login-error-message, account-welcome, logout-button. Explored with playwright-cli through `tests/seed.spec.ts`.

## Test Scenarios

### 1. Login

**Seed:** `tests/seed.spec.ts`

#### 1.1. should-login-with-valid-credentials

**File:** `tests-cli/login/should-login-with-valid-credentials.spec.ts`

**Steps:**
  1. Navigate to the home page
    - expect: Title is 'HourToLearn Practice Site'
  2. Click 'Login' in the primary navigation
    - expect: URL is /login
    - expect: page-title has text 'Login'
  3. Type 'student' into the Username field
  4. Type 'Learn123!' into the Password field
  5. Click 'Sign in'
    - expect: POST /login responds 200
    - expect: URL is /account
    - expect: Title is 'Account · HourToLearn Practice Site'
    - expect: page-title has text 'Account'
    - expect: account-welcome has text 'Welcome, student!'
    - expect: 'Log out' button is visible
    - expect: The pw_session cookie is set
