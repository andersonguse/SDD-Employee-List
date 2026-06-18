# Research: Employee CRUD Management

## Decision: Backend Framework and Architecture

Use Java 21 with Spring Boot 3.x and a conventional layered architecture:
REST controller, service, repository, entity, request/response DTOs, and a
shared exception handler.

**Rationale**: The user requested Spring Boot and typical business architecture.
This structure maps cleanly to the constitution's layered architecture principle
and is familiar for interview demonstration purposes.

**Alternatives considered**:
- Single controller with direct repository access: rejected because it mixes API
  and data access concerns.
- Full domain-driven architecture: rejected as unnecessary complexity for a
  small CRUD demonstration.

## Decision: Frontend Stack

Use React with TypeScript and Vite.

**Rationale**: The user requested React and TypeScript for modern frontend
purposes. Vite keeps local setup and CI fast while remaining common and easy to
explain.

**Alternatives considered**:
- Server-rendered templates: rejected because the user requested React.
- Heavier frontend frameworks: rejected because they add complexity not needed
  for the CRUD workflows.

## Decision: Database

Use PostgreSQL running through Docker Compose for local development. Employee
IDs will be auto-generated incrementing numeric values owned by the database
schema.

**Rationale**: The user requested Dockerized PostgreSQL for a local interview
demo. A database-generated numeric ID is simple, visible, and sufficient for the
feature scope.

**Alternatives considered**:
- In-memory database: rejected because the user requested PostgreSQL.
- UUID primary keys: rejected because the user asked for a simple
  auto-generated incrementing value.

## Decision: Schema Management

Use Flyway migrations if dependency setup remains simple; otherwise use Spring
SQL initialization for the first schema. The implementation tasks should prefer
Flyway unless it materially slows the demo setup.

**Rationale**: Migrations make database setup reproducible from a clean checkout,
which helps local demos and CI. The simplicity principle allows fallback to SQL
initialization if Flyway is more ceremony than value for the first increment.

**Alternatives considered**:
- Hibernate auto-DDL only: rejected because it makes schema state less explicit.
- Manual database setup: rejected because it weakens demo repeatability.

## Decision: API Style

Expose a small JSON REST API for employee CRUD under `/api/employees`.

**Rationale**: REST is the simplest fit for a React frontend calling a Spring
Boot backend, and it keeps the contract easy to review and test.

**Alternatives considered**:
- GraphQL: rejected as unnecessary for one entity and four CRUD workflows.
- Server actions or direct database calls from the UI: rejected because they
  violate layered architecture and make the UI less portable.

## Decision: Validation and Error Handling

Validate employee input on both frontend and backend, with backend validation as
the source of truth before persistence. Return field-level validation errors for
bad input and a friendly general error for unexpected failures.

**Rationale**: Frontend validation improves user experience, while backend
validation enforces data integrity. Field-level errors directly satisfy the
feature requirements.

**Alternatives considered**:
- Frontend-only validation: rejected because invalid data could still reach
  persistence.
- Generic error messages only: rejected because the spec requires field-specific
  messages.

## Decision: CI/CD Scope

Add a lean GitHub Actions workflow that checks out the repository, sets up Java
and Node, runs backend tests, runs frontend tests/build, and starts PostgreSQL
only where needed for backend integration tests. Do not deploy anywhere.

**Rationale**: The user requested a GitHub Actions file that helps with testing
but does not assume AWS, Azure, or any cloud runtime. Validation-only CI matches
the local demonstration goal.

**Alternatives considered**:
- Full deployment pipeline: rejected because the app is local-only.
- No CI: rejected because the user requested CI/CD and testing support.

## Decision: Local Demo Runtime

Use `docker-compose.yml` for PostgreSQL and separate commands for backend and
frontend development servers. The quickstart will document validation scenarios.

**Rationale**: This keeps the moving parts visible and interview-friendly while
still demonstrating a realistic application split.

**Alternatives considered**:
- Dockerizing every service immediately: rejected as extra complexity for a
  local code demonstration.
- One combined command for everything: deferred until implementation proves it
  would simplify the demo without hiding important behavior.

## Decision: Browser Autofill Prevention

Use standard HTML `autocomplete` attributes on the employee form and its name,
email, and phone input fields, with no additional JavaScript state or event
handlers unless manual testing proves a target browser still shows suggestions.

**Rationale**: HTML attributes are the least memory-intensive and fastest
approach because the browser handles the behavior natively. This satisfies the
requirement without adding frontend runtime logic, dependencies, or extra
component state.

**Alternatives considered**:
- JavaScript field randomization or hidden decoy inputs: rejected because it is
  more complex, harder to explain, and adds runtime behavior for a simple local
  demo.
- Browser-specific workarounds: rejected for the first implementation because
  they should only be added if validation shows native attributes are
  insufficient.
