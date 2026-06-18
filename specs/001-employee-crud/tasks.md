# Tasks: Employee CRUD Management

**Input**: Design documents from `specs/001-employee-crud/`

**Prerequisites**: plan.md, spec.md, research.md, data-model.md, contracts/openapi.yaml, quickstart.md

**Tests**: Tests are required for core business behavior by the SDD Employee List Constitution and this feature plan. Test tasks appear before the implementation tasks they verify.

**Organization**: Tasks are grouped by user story so each story can be implemented and tested as an independently demonstrable increment.

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Can run in parallel because it touches different files and has no dependency on incomplete tasks.
- **[Story]**: Maps the task to a user story from `spec.md`.
- Every task includes an exact file path.

## Phase 1: Setup (Shared Infrastructure)

**Purpose**: Create the project skeleton, dependency manifests, local database runtime, and CI shell needed by every story.

- [X] T001 Create backend Maven Spring Boot project descriptor with web, validation, data JPA, PostgreSQL, Flyway, test, and Testcontainers dependencies in `backend/pom.xml`
- [X] T002 [P] Create backend application entry point in `backend/src/main/java/com/andersonguse/sddemployeelist/EmployeeListApplication.java`
- [X] T003 [P] Create frontend Vite React TypeScript package scripts and dependencies in `frontend/package.json`
- [X] T004 [P] Create frontend TypeScript and Vite configuration in `frontend/tsconfig.json` and `frontend/vite.config.ts`
- [X] T005 [P] Create frontend application shell files in `frontend/src/main.tsx`, `frontend/src/App.tsx`, and `frontend/src/styles/app.css`
- [X] T006 Create Docker Compose PostgreSQL service for local development in `docker-compose.yml`
- [X] T007 Create backend application configuration for local PostgreSQL and CORS in `backend/src/main/resources/application.yml`
- [X] T008 Create validation-only GitHub Actions workflow for backend and frontend checks in `.github/workflows/ci.yml`
- [X] T009 [P] Create backend test resources configuration for integration tests in `backend/src/test/resources/application-test.yml`
- [X] T010 [P] Create project ignore rules for Java, Node, build output, and local environment files in `.gitignore`

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Establish shared domain, persistence, API error handling, and frontend API types before user story work begins.

**Critical**: No user story implementation should begin until this phase is complete.

- [X] T011 Create Employee JPA entity with auto-generated incrementing ID and unique email constraint in `backend/src/main/java/com/andersonguse/sddemployeelist/employee/Employee.java`
- [X] T012 Create initial Flyway employee table migration with id, name, email, and phone_number columns in `backend/src/main/resources/db/migration/V1__create_employees.sql`
- [X] T013 Create EmployeeRepository with email uniqueness lookup methods in `backend/src/main/java/com/andersonguse/sddemployeelist/employee/EmployeeRepository.java`
- [X] T014 Create EmployeeRequest validation DTO for name, email, and phone number in `backend/src/main/java/com/andersonguse/sddemployeelist/employee/EmployeeRequest.java`
- [X] T015 Create EmployeeResponse DTO for id, name, email, and phone number in `backend/src/main/java/com/andersonguse/sddemployeelist/employee/EmployeeResponse.java`
- [X] T016 Create shared ApiError and field validation error response shape in `backend/src/main/java/com/andersonguse/sddemployeelist/shared/ApiError.java`
- [X] T017 Create GlobalExceptionHandler for validation, duplicate email, not found, and unexpected errors in `backend/src/main/java/com/andersonguse/sddemployeelist/shared/GlobalExceptionHandler.java`
- [X] T018 Create EmployeeService skeleton with mapping helpers and validation entry points in `backend/src/main/java/com/andersonguse/sddemployeelist/employee/EmployeeService.java`
- [X] T019 Create EmployeeController skeleton mapped to `/api/employees` in `backend/src/main/java/com/andersonguse/sddemployeelist/employee/EmployeeController.java`
- [X] T020 Create frontend Employee and EmployeeInput TypeScript types in `frontend/src/api/employees.ts`
- [X] T021 Create frontend API error parsing helpers in `frontend/src/api/employees.ts`

**Checkpoint**: Backend and frontend skeletons compile, database schema can be created, and shared contracts are ready for story implementation.

---

## Phase 3: User Story 1 - Add Employee (Priority: P1) MVP

**Goal**: A user can enter a valid employee name, email address, and phone number on the web page, save it, and see it persisted.

**Independent Test**: Submit valid employee details, confirm success, confirm the employee appears in the list, refresh, and confirm the employee still appears.

### Tests for User Story 1

- [X] T022 [P] [US1] Add EmployeeService create validation and duplicate email tests in `backend/src/test/java/com/andersonguse/sddemployeelist/employee/EmployeeServiceTest.java`
- [X] T023 [P] [US1] Add create employee REST integration tests for 201, 400, and 409 responses in `backend/src/test/java/com/andersonguse/sddemployeelist/employee/EmployeeControllerIntegrationTest.java`
- [X] T024 [P] [US1] Add frontend add employee form validation and submit tests in `frontend/src/components/EmployeeForm.test.tsx`
- [X] T025 [P] [US1] Add frontend create API client tests in `frontend/src/api/employees.test.ts`

### Implementation for User Story 1

- [X] T026 [US1] Implement EmployeeService createEmployee with trimming, required field validation, email format validation, phone validation, duplicate email prevention, and persistence in `backend/src/main/java/com/andersonguse/sddemployeelist/employee/EmployeeService.java`
- [X] T027 [US1] Implement POST `/api/employees` controller endpoint returning 201 and EmployeeResponse in `backend/src/main/java/com/andersonguse/sddemployeelist/employee/EmployeeController.java`
- [X] T028 [US1] Implement createEmployee API client function in `frontend/src/api/employees.ts`
- [X] T029 [US1] Implement reusable EmployeeForm component for create mode with field-specific errors in `frontend/src/components/EmployeeForm.tsx`
- [X] T030 [US1] Wire EmployeeForm create flow into the main page state in `frontend/src/App.tsx`
- [X] T031 [US1] Add user-facing success and failure styling for create flow in `frontend/src/styles/app.css`

**Checkpoint**: User Story 1 is independently functional and testable through the web page and API.

---

## Phase 4: User Story 2 - View Current Employees (Priority: P1)

**Goal**: A user can open the employee page and view all saved employees, or see a clear empty state when none exist.

**Independent Test**: Load the employee page with existing records and confirm each employee displays name, email, and phone number; load with no records and confirm the empty state.

### Tests for User Story 2

- [X] T032 [P] [US2] Add EmployeeService list employees tests for populated and empty results in `backend/src/test/java/com/andersonguse/sddemployeelist/employee/EmployeeServiceTest.java`
- [X] T033 [P] [US2] Add list employees REST integration tests for 200 response and empty response in `backend/src/test/java/com/andersonguse/sddemployeelist/employee/EmployeeControllerIntegrationTest.java`
- [X] T034 [P] [US2] Add EmployeeTable rendering and empty-state tests in `frontend/src/components/EmployeeTable.test.tsx`
- [X] T035 [P] [US2] Add frontend list API client tests in `frontend/src/api/employees.test.ts`

### Implementation for User Story 2

- [X] T036 [US2] Implement EmployeeService listEmployees ordered by id in `backend/src/main/java/com/andersonguse/sddemployeelist/employee/EmployeeService.java`
- [X] T037 [US2] Implement GET `/api/employees` controller endpoint in `backend/src/main/java/com/andersonguse/sddemployeelist/employee/EmployeeController.java`
- [X] T038 [US2] Implement listEmployees API client function in `frontend/src/api/employees.ts`
- [X] T039 [US2] Implement EmployeeTable component with employee rows and empty-state display in `frontend/src/components/EmployeeTable.tsx`
- [X] T040 [US2] Load employees when the app opens and after successful create in `frontend/src/App.tsx`
- [X] T041 [US2] Add table and empty-state styling in `frontend/src/styles/app.css`

**Checkpoint**: User Stories 1 and 2 work together as the MVP: add an employee and see the current list.

---

## Phase 5: User Story 3 - Edit Employee (Priority: P2)

**Goal**: A user can update an existing employee's name, email address, or phone number without changing the employee ID.

**Independent Test**: Select an existing employee, edit one or more fields, save, confirm updated values appear, and confirm invalid edits leave saved values unchanged.

### Tests for User Story 3

- [X] T042 [P] [US3] Add EmployeeService update tests for valid update, invalid update preservation, duplicate email, and missing employee in `backend/src/test/java/com/andersonguse/sddemployeelist/employee/EmployeeServiceTest.java`
- [X] T043 [P] [US3] Add update employee REST integration tests for 200, 400, 404, and 409 responses in `backend/src/test/java/com/andersonguse/sddemployeelist/employee/EmployeeControllerIntegrationTest.java`
- [X] T044 [P] [US3] Add EmployeeForm edit mode tests for prefilled values, valid save, and field errors in `frontend/src/components/EmployeeForm.test.tsx`
- [X] T045 [P] [US3] Add frontend update API client tests in `frontend/src/api/employees.test.ts`

### Implementation for User Story 3

- [X] T046 [US3] Implement EmployeeService updateEmployee preserving id and existing data on validation failure in `backend/src/main/java/com/andersonguse/sddemployeelist/employee/EmployeeService.java`
- [X] T047 [US3] Implement PUT `/api/employees/{id}` controller endpoint in `backend/src/main/java/com/andersonguse/sddemployeelist/employee/EmployeeController.java`
- [X] T048 [US3] Implement updateEmployee API client function in `frontend/src/api/employees.ts`
- [X] T049 [US3] Extend EmployeeForm for edit mode with cancel and existing values in `frontend/src/components/EmployeeForm.tsx`
- [X] T050 [US3] Add edit selection, save, cancel, and list refresh state flow in `frontend/src/App.tsx`
- [X] T051 [US3] Add edit action controls and edit-state styling in `frontend/src/components/EmployeeTable.tsx` and `frontend/src/styles/app.css`

**Checkpoint**: Users can add, view, and edit employees while validation protects persisted data.

---

## Phase 6: User Story 4 - Remove Employee (Priority: P2)

**Goal**: A user can remove an existing employee after confirming the action.

**Independent Test**: Delete an employee, confirm the employee disappears from the list, refresh, and confirm the employee remains absent; canceling removal keeps the employee.

### Tests for User Story 4

- [X] T052 [P] [US4] Add EmployeeService delete tests for existing and missing employees in `backend/src/test/java/com/andersonguse/sddemployeelist/employee/EmployeeServiceTest.java`
- [X] T053 [P] [US4] Add delete employee REST integration tests for 204 and 404 responses in `backend/src/test/java/com/andersonguse/sddemployeelist/employee/EmployeeControllerIntegrationTest.java`
- [X] T054 [P] [US4] Add EmployeeTable delete confirmation and cancel tests in `frontend/src/components/EmployeeTable.test.tsx`
- [X] T055 [P] [US4] Add frontend delete API client tests in `frontend/src/api/employees.test.ts`

### Implementation for User Story 4

- [X] T056 [US4] Implement EmployeeService deleteEmployee in `backend/src/main/java/com/andersonguse/sddemployeelist/employee/EmployeeService.java`
- [X] T057 [US4] Implement DELETE `/api/employees/{id}` controller endpoint in `backend/src/main/java/com/andersonguse/sddemployeelist/employee/EmployeeController.java`
- [X] T058 [US4] Implement deleteEmployee API client function in `frontend/src/api/employees.ts`
- [X] T059 [US4] Add delete and confirmation controls to EmployeeTable in `frontend/src/components/EmployeeTable.tsx`
- [X] T060 [US4] Add delete flow state, cancel handling, success handling, and list refresh in `frontend/src/App.tsx`
- [X] T061 [US4] Add delete confirmation and destructive action styling in `frontend/src/styles/app.css`

**Checkpoint**: Full CRUD behavior is functional through the web page.

---

## Phase 7: Polish & Cross-Cutting Concerns

**Purpose**: Complete demo readiness, CI validation, documentation, and acceptance review.

- [X] T062 [P] Add backend README commands for tests and local run in `backend/README.md`
- [X] T063 [P] Add frontend README commands for tests, build, and local run in `frontend/README.md`
- [X] T064 Update root README with local demo startup sequence and feature overview in `README.md`
- [X] T065 Verify GitHub Actions backend test and frontend test/build jobs in `.github/workflows/ci.yml`
- [X] T066 Add quickstart validation notes for final command names and expected local URLs in `specs/001-employee-crud/quickstart.md`
- [X] T067 Run backend test suite and document any required follow-up in `specs/001-employee-crud/quickstart.md`
- [X] T068 Run frontend test/build suite and document any required follow-up in `specs/001-employee-crud/quickstart.md`
- [X] T069 Review implemented behavior against FR-001 through FR-016 and record acceptance result in `specs/001-employee-crud/checklists/requirements.md`

---

## Phase 8: Cross-Story Change - Disable Browser Autofill (FR-017)

**Purpose**: Add the approved browser autofill/autocomplete prevention behavior
for employee create and edit forms using native HTML attributes.

**Independent Test**: With a browser profile that has saved names or email
addresses, focus the name and email fields in both add and edit employee forms
and confirm no saved browser suggestions are shown.

### Tests for FR-017

- [X] T070 [P] [US1] Add EmployeeForm create-mode tests asserting the form and employee name/email inputs expose disabled autocomplete behavior in `frontend/src/components/EmployeeForm.test.tsx`
- [X] T071 [P] [US3] Add EmployeeForm edit-mode tests asserting the form and employee name/email inputs expose disabled autocomplete behavior in `frontend/src/components/EmployeeForm.test.tsx`

### Implementation for FR-017

- [X] T072 [US1] Add native HTML autocomplete attributes to the EmployeeForm create-mode form and name/email/phone inputs in `frontend/src/components/EmployeeForm.tsx`
- [X] T073 [US3] Verify the same EmployeeForm native HTML autocomplete attributes apply when the component renders in edit mode in `frontend/src/components/EmployeeForm.tsx`
- [X] T074 Run frontend tests and build from `frontend/` and document the FR-017 validation result in `specs/001-employee-crud/quickstart.md`
- [X] T075 Review implemented behavior against FR-017 and record acceptance result in `specs/001-employee-crud/checklists/requirements.md`

**Checkpoint**: Employee create and edit forms satisfy FR-017 and the quickstart
autofill validation scenario is documented.

---

## Dependencies & Execution Order

### Phase Dependencies

- **Setup (Phase 1)**: No dependencies.
- **Foundational (Phase 2)**: Depends on Setup completion and blocks all user stories.
- **User Story 1 (Phase 3)**: Depends on Foundational. This is the MVP create workflow.
- **User Story 2 (Phase 4)**: Depends on Foundational and can be implemented after or alongside US1, but MVP demo needs US1 + US2 together.
- **User Story 3 (Phase 5)**: Depends on Foundational and benefits from US2 table/list UI.
- **User Story 4 (Phase 6)**: Depends on Foundational and benefits from US2 table/list UI.
- **Polish (Phase 7)**: Depends on desired user stories being complete.
- **Autofill Change (Phase 8)**: Depends on the shared EmployeeForm create and
  edit modes from US1 and US3.

### User Story Dependencies

- **US1 Add Employee (P1)**: Can start after Foundational. Depends on Employee entity, repository, service skeleton, controller skeleton, and frontend API types.
- **US2 View Current Employees (P1)**: Can start after Foundational. Independent from create when tested with seeded data, but combined with US1 for MVP demo.
- **US3 Edit Employee (P2)**: Can start after Foundational. Uses EmployeeForm and EmployeeTable patterns from US1/US2 when available.
- **US4 Remove Employee (P2)**: Can start after Foundational. Uses EmployeeTable list state from US2 when available.
- **FR-017 Disable Browser Autofill**: Can start after EmployeeForm supports
  both create and edit modes. It maps to US1 and US3 acceptance scenarios.

### Within Each User Story

- Tests first for the story-specific backend service, API behavior, frontend API client, and UI behavior.
- Backend service behavior before controller wiring.
- API client behavior before UI integration.
- UI component behavior before app-level state integration.
- Story checkpoint before moving to the next story.

---

## Parallel Opportunities

- Setup tasks T002 through T005 and T009 through T010 can run in parallel after T001 is understood.
- Foundational DTO/error tasks T014 through T017 and frontend API type task T020 can run in parallel after T011 through T013 are underway.
- For each story, service tests, controller integration tests, frontend API tests, and component tests are parallelizable because they touch different test files.
- US3 and US4 can be implemented in parallel after US2 establishes the table/list pattern, with coordination on `frontend/src/App.tsx`.
- Polish documentation tasks T062 and T063 can run in parallel.
- FR-017 tests T070 and T071 can be drafted together, but implementation tasks
  T072 and T073 both touch `frontend/src/components/EmployeeForm.tsx` and should
  be coordinated in one edit.

## Parallel Example: User Story 1

```text
Task: T022 [P] [US1] Add EmployeeService create validation and duplicate email tests in backend/src/test/java/com/andersonguse/sddemployeelist/employee/EmployeeServiceTest.java
Task: T023 [P] [US1] Add create employee REST integration tests for 201, 400, and 409 responses in backend/src/test/java/com/andersonguse/sddemployeelist/employee/EmployeeControllerIntegrationTest.java
Task: T024 [P] [US1] Add frontend add employee form validation and submit tests in frontend/src/components/EmployeeForm.test.tsx
Task: T025 [P] [US1] Add frontend create API client tests in frontend/src/api/employees.test.ts
```

## Parallel Example: User Story 2

```text
Task: T032 [P] [US2] Add EmployeeService list employees tests for populated and empty results in backend/src/test/java/com/andersonguse/sddemployeelist/employee/EmployeeServiceTest.java
Task: T033 [P] [US2] Add list employees REST integration tests for 200 response and empty response in backend/src/test/java/com/andersonguse/sddemployeelist/employee/EmployeeControllerIntegrationTest.java
Task: T034 [P] [US2] Add EmployeeTable rendering and empty-state tests in frontend/src/components/EmployeeTable.test.tsx
Task: T035 [P] [US2] Add frontend list API client tests in frontend/src/api/employees.test.ts
```

## Implementation Strategy

### MVP First

1. Complete Phase 1: Setup.
2. Complete Phase 2: Foundational.
3. Complete Phase 3: Add Employee.
4. Complete Phase 4: View Current Employees.
5. Stop and validate the MVP: create a valid employee, see it in the list, refresh, and confirm persistence.

### Incremental Delivery

1. Add + view employees for the MVP.
2. Add edit employee behavior and validate failed edits preserve saved values.
3. Add delete employee behavior and validate confirmation/cancel paths.
4. Complete CI, documentation, quickstart, and acceptance review.

### Traceability Matrix

| Story | Requirements | Key Tasks |
|-------|--------------|-----------|
| US1 Add Employee | FR-003, FR-004, FR-008, FR-009, FR-010, FR-011, FR-012, FR-015, FR-016, FR-017 | T022-T031, T070, T072 |
| US2 View Current Employees | FR-001, FR-002, FR-005, FR-014, FR-015, FR-016 | T032-T041 |
| US3 Edit Employee | FR-006, FR-008, FR-009, FR-010, FR-011, FR-012, FR-013, FR-015, FR-016, FR-017 | T042-T051, T071, T073 |
| US4 Remove Employee | FR-007, FR-015, FR-016 | T052-T061 |

## Notes

- All story tasks include `[US#]` labels for traceability.
- All setup, foundational, story, and polish tasks include exact file paths.
- `[P]` tasks are safe to run in parallel only when they touch different files.
- Backend validation remains the source of truth before persistence.
- Keep the GitHub Actions workflow validation-only; do not add cloud deployment.
