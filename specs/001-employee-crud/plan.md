# Implementation Plan: Employee CRUD Management

**Branch**: `main` | **Date**: 2026-06-18 | **Spec**: [spec.md](./spec.md)

**Input**: Feature specification from `specs/001-employee-crud/spec.md`

## Summary

Build a local demonstration web application that lets a user manage employee
records through a browser with no login. The backend will be a Java Spring Boot
REST application with layered controller, service, repository, and entity
boundaries. The frontend will be a React TypeScript application that consumes
the REST API. Employee data will persist in a Dockerized PostgreSQL database.
A lean GitHub Actions workflow will run automated checks and tests that are
useful for a local interview demo project.

## Technical Context

**Language/Version**: Java 21 for backend; TypeScript 5.x for frontend

**Primary Dependencies**: Spring Boot 3.x, Spring Web, Spring Data JPA,
Bean Validation, PostgreSQL JDBC driver, Flyway or Spring SQL initialization,
React 18+, Vite, npm

**Storage**: Dockerized PostgreSQL for local development and integration tests;
employee IDs use a simple auto-generated incrementing numeric value

**Testing**: JUnit 5, Spring Boot Test, MockMvc or WebTestClient for REST
behavior, Testcontainers or a CI PostgreSQL service for persistence behavior,
Vitest and React Testing Library for frontend behavior, including checks that
employee form fields expose disabled browser autocomplete behavior, reject
invalid employee names, show duplicate-email alerts, and preserve entered form
values after expected save failures

**Target Platform**: Local developer machine for interview demonstration;
GitHub Actions for pull/push validation only

**Project Type**: Web application with separate backend and frontend projects

**Performance Goals**: Users can complete create and update workflows in under
1 minute, remove an employee in under 30 seconds, and view saved employees
immediately after opening the page

**Constraints**: No authentication or authorization; local-only deployment;
simple maintainable architecture; database must run through Docker; CI/CD must
avoid cloud deployment assumptions; employee create and edit forms must disable
browser autofill/autocomplete using the lightest browser-native approach

**Scale/Scope**: Single-user demonstration app for managing a small employee
list, expected to handle dozens to hundreds of records comfortably

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

- Specification first: PASS. The feature specification exists at
  `specs/001-employee-crud/spec.md`, and Anderson Guse is the approval authority.
- Simplicity: PASS. The design uses common Spring Boot and React project
  boundaries with no authentication, no cloud deployment, and no extra workflow
  services.
- Layered architecture: PASS. Backend responsibilities are separated into REST
  controllers, services, repositories, and entities; frontend UI and API client
  concerns are separate.
- Data integrity: PASS. Validation, duplicate email prevention, auto-generated
  IDs, employee name rules, duplicate email prevention, expected failure
  behavior, and invalid-input behavior are defined in the data model and
  contracts.
- Testability: PASS. Backend service/API/persistence tests and frontend UI tests
  are planned, with CI running useful automated checks.
- Traceability: PASS. Plan, research, data model, contracts, and quickstart map
  back to feature requirements FR-001 through FR-021.
- Verification: PASS. Quickstart scenarios and CI checks provide acceptance
  review evidence before code is accepted.
- Clarifications: PASS. No unresolved `NEEDS CLARIFICATION` markers remain.

## Project Structure

### Documentation (this feature)

```text
specs/001-employee-crud/
|-- plan.md
|-- research.md
|-- data-model.md
|-- quickstart.md
|-- contracts/
|   `-- openapi.yaml
`-- checklists/
    `-- requirements.md
```

### Source Code (repository root)

```text
backend/
|-- pom.xml
|-- src/
|   |-- main/
|   |   |-- java/com/andersonguse/sddemployeelist/
|   |   |   |-- EmployeeListApplication.java
|   |   |   |-- employee/
|   |   |   |   |-- Employee.java
|   |   |   |   |-- EmployeeController.java
|   |   |   |   |-- EmployeeRepository.java
|   |   |   |   |-- EmployeeRequest.java
|   |   |   |   |-- EmployeeResponse.java
|   |   |   |   `-- EmployeeService.java
|   |   |   `-- shared/
|   |   |       |-- ApiError.java
|   |   |       `-- GlobalExceptionHandler.java
|   |   `-- resources/
|   |       |-- application.yml
|   |       `-- db/migration/
|   `-- test/java/com/andersonguse/sddemployeelist/
|       |-- employee/
|       `-- support/
frontend/
|-- package.json
|-- src/
|   |-- App.tsx
|   |-- main.tsx
|   |-- api/
|   |   `-- employees.ts
|   |-- components/
|   |   |-- EmployeeForm.tsx
|   |   `-- EmployeeTable.tsx
|   `-- styles/
|       `-- app.css
|-- tests/
`-- vite.config.ts
docker-compose.yml
.github/
`-- workflows/
    `-- ci.yml
```

**Structure Decision**: Use a two-project web application layout. `backend/`
owns Spring Boot REST, business rules, validation, and persistence.
`frontend/` owns the browser experience and calls the backend through the API
contract. `docker-compose.yml` owns local PostgreSQL startup. `.github/workflows`
owns validation-only CI.

**Autofill Decision**: Implement FR-017 in `frontend/src/components/EmployeeForm.tsx`
using standard HTML `autocomplete` attributes on the employee form and its input
fields. Do not add JavaScript autofill suppression unless validation shows the
browser-native approach fails for the target local demo browser.

**Validation UX Decision**: Implement FR-018 through FR-021 by keeping backend
validation as the source of truth, adding matching frontend pre-submit guidance
for employee names, mapping duplicate-email responses to a visible alert, and
retaining current form state whenever create or edit saves fail for expected
validation or duplicate-email reasons.

## Complexity Tracking

> **Fill ONLY if Constitution Check has violations that must be justified**

| Violation | Why Needed | Simpler Alternative Rejected Because |
|-----------|------------|-------------------------------------|
| None | N/A | N/A |
