# Quickstart: Employee CRUD Management

This guide validates the planned local demo behavior. Commands may be adjusted
during implementation if generated project scaffolding uses different script
names, but the validation outcomes must remain the same.

## Prerequisites

- Java 21
- Maven 3.9+
- Node.js 20+
- npm 10+
- Docker Desktop or Docker Engine with Compose

## Planned Local Setup

1. Start PostgreSQL:

   ```powershell
   docker compose up -d postgres
   ```

2. Run backend tests:

   ```powershell
   cd backend
   mvn test
   ```

   Backend automated tests use an in-memory test database so they can run even
   when Docker Desktop is not running. The application runtime still uses the
   Dockerized PostgreSQL service from `docker-compose.yml`.

3. Run frontend checks:

   ```powershell
   cd frontend
   npm install
   npm test
   npm run build
   ```

4. Start the backend:

   ```powershell
   cd backend
   mvn spring-boot:run
   ```

5. Start the frontend:

   ```powershell
   cd frontend
   npm run dev
   ```

6. Open the frontend URL shown by the dev server.

Expected local URLs:

- Backend API: `http://localhost:8080/api/employees`
- Frontend UI: `http://localhost:5173`

## Validation Scenarios

### Add Employee

1. Open the employee page.
2. Enter a name, email address, and phone number in `123-456-7890` format.
3. Save the employee.
4. Confirm the employee appears in the list with an auto-generated numeric ID.
5. Refresh the page and confirm the employee still appears.

Expected result: The employee is persisted and visible after refresh.

### Reject Invalid Phone Number

1. Open the employee page.
2. Enter a name, email address, and a phone number that is not in
   `123-456-7890` format, such as `555-0100`.
3. Attempt to save the employee.

Expected result: The app shows a phone-specific validation message and does
not save the employee.

### View Empty List

1. Reset or start with an empty database.
2. Open the employee page.

Expected result: The page shows a clear empty-state message and still allows a
new employee to be added.

### Edit Employee

1. Select an existing employee.
2. Change one or more fields.
3. Save the changes.

Expected result: The list shows updated values, and the employee ID remains the
same.

### Reject Invalid Phone Edit

1. Select an existing employee.
2. Change the phone number to a value that is not in `123-456-7890` format.
3. Attempt to save the changes.

Expected result: The app shows a phone-specific validation message, and the
previously saved employee values remain unchanged.

### Existing Seven-Digit Phone Conversion

1. Start with an existing employee row whose `phone_number` value has only
   seven digits, such as `555-0100`.
2. Start the backend so Flyway applies database migrations.
3. View the employee list.

Expected result: The existing seven-digit value is converted by prefixing
`770-`, for example `555-0100` becomes `770-555-0100`.

### Disable Browser Autofill

1. Use a browser profile that has saved names or email addresses from prior
   form entries.
2. Open the employee page and focus the name and email fields in the add
   employee form.
3. Select an existing employee for editing and focus the name and email fields
   in the edit employee form.

Expected result: The browser does not show saved autofill or autocomplete
suggestions for the employee name or email fields in either create or edit
mode.

### Reject Invalid Edit

1. Select an existing employee.
2. Clear a required field or enter an invalid email.
3. Attempt to save.

Expected result: The app shows field-specific validation messages, and the
previously saved employee values remain unchanged.

### Prevent Duplicate Email

1. Create one employee with an email address.
2. Attempt to create or update another employee using the same email.

Expected result: The duplicate is rejected with a visible validation message.

### Remove Employee

1. Select an existing employee.
2. Choose remove and confirm.

Expected result: The employee is removed from the list and remains absent after
refresh.

### CI Validation

Push or open a pull request after implementation.

Expected result: GitHub Actions runs backend tests and frontend tests/build. The
workflow does not deploy to a cloud environment.

## Implementation Validation Results

Validated on 2026-06-18:

- Backend: `mvn test` passed from `backend/`.
- Frontend: `npm test` passed from `frontend/`.
- Frontend: `npm run build` passed from `frontend/`.
- FR-017 frontend validation: `npm test -- EmployeeForm.test.tsx`, `npm test`,
  and `npm run build` passed from `frontend/`. Automated component tests verify
  the add and edit employee forms expose disabled browser autocomplete behavior
  on the form and name, email, and phone fields.
- FR-017 convergence validation: `npm test -- EmployeeForm.test.tsx`,
  `npm test`, and `npm run build` passed from `frontend/` after adding stronger
  Chrome autofill suppression attributes. Manual validation confirmed Google
  Chrome autofill suggestions were disabled for the employee form fields.
  Third-party password-manager extensions are excluded from FR-017 acceptance
  because they can ignore page HTML/JavaScript and must be disabled or
  configured at the extension level.
- FR-010 phone-format validation on 2026-06-19: `mvn test` passed from
  `backend/`, including service/API rejection of seven-digit phone numbers and
  Flyway application of `V2__normalize_employee_phone_numbers.sql`. `npm test`
  and `npm run build` passed from `frontend/`, including create/edit form
  guidance for `123-456-7890` phone input.

Note: Docker was available as a CLI, but the local Docker daemon was not
available to automated tests in this environment. Backend tests therefore use an
in-memory test database, while runtime configuration still uses Dockerized
PostgreSQL for the local demo.
