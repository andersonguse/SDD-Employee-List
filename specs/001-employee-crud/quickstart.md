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
2. Enter a name, email address, and phone number.
3. Save the employee.
4. Confirm the employee appears in the list with an auto-generated numeric ID.
5. Refresh the page and confirm the employee still appears.

Expected result: The employee is persisted and visible after refresh.

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

Note: Docker was available as a CLI, but the local Docker daemon was not
available to automated tests in this environment. Backend tests therefore use an
in-memory test database, while runtime configuration still uses Dockerized
PostgreSQL for the local demo.
