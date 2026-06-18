<!--
Sync Impact Report
Version change: 1.0.0 -> 1.1.0
Modified principles:
- I. Spec-Driven Demonstrability: unchanged
- II. Spring Boot Boundary Discipline: unchanged
- III. Test-First Implementation: unchanged
- IV. Employee Data Integrity and Privacy: clarified CRUD, retention, and reset expectations
- V. Simple, Observable Demo Operations: unchanged
Added sections:
- None
Removed sections:
- None
Templates requiring updates:
- updated: .specify/templates/plan-template.md
- updated: .specify/templates/spec-template.md
- updated: .specify/templates/tasks-template.md
- not present: .specify/templates/commands/*.md
Follow-up NEEDS CLARIFICATION items:
- None
-->
# SDD Employee List Constitution

## Core Principles

### I. Spec-Driven Demonstrability
Every feature MUST begin with a Spec Kit specification that explains the user
journey, acceptance scenarios, requirements, assumptions, and measurable success
criteria before implementation begins. The application exists to demonstrate
Spec Driven Development, so each delivered increment MUST be traceable from
specification to plan to tasks to verified behavior. Any implementation choice
that cannot be traced to a spec, assumption, or explicit clarification MUST be
added back to the relevant artifact before coding continues.

Rationale: The project is a teaching vehicle; the development process is part
of the product being demonstrated.

### II. Spring Boot Boundary Discipline
The backend MUST be a Java Spring Boot application with clear separation between
web/controller, service, persistence/repository, and domain/entity concerns.
Employee persistence MUST use Spring-supported data access and database
migrations or schema initialization that can be reproduced from a clean checkout.
The user interface MUST communicate with the application through explicit
validated flows rather than direct database access.

Rationale: The demo needs recognizable enterprise application boundaries while
remaining small enough for learners to inspect.

### III. Test-First Implementation
For each independently deliverable user story, tests MUST be written and shown
to fail before production code is implemented. At minimum, changes that affect
employee creation, validation, persistence, and display MUST include automated
tests at the appropriate level: unit tests for isolated rules, integration tests
for Spring Boot and database behavior, and UI or end-to-end tests for the primary
form submission path when a UI flow is added or changed.

Rationale: Test-first evidence makes the SDD workflow concrete and prevents the
demo from becoming only a documentation exercise.

### IV. Employee Data Integrity and Privacy
Employee records MUST include name, email address, and phone number. The system
MUST validate required fields, reject malformed email addresses, reject phone
numbers that do not match the selected project format, and report validation
errors without persisting invalid records. Logs, errors, and demo output MUST NOT
expose unnecessary personal data beyond what is needed to operate or demonstrate
the feature. The employee experience MUST support full CRUD behavior: create,
read/list, update, and delete employee records. Deleted records MAY be hard
deleted for demo simplicity unless a feature specification later requires audit
history. The local demo MUST include a documented way to reset or reseed data so
interview demonstrations can start from a known state.

Rationale: Even a demo application should model responsible handling of
personally identifiable information.

### V. Simple, Observable Demo Operations
The application MUST remain easy to run, reset, and explain locally. The default
developer path MUST include one documented command to start the app, one command
to run tests, and clear configuration for the database. Application behavior that
can fail during the demo, including validation failures and database errors,
MUST be observable through structured logs or clear user-facing messages without
requiring a debugger.

Rationale: A demonstration project should make the happy path and failure paths
visible without adding production-scale complexity.

## Technology Constraints

The primary runtime MUST be Java with Spring Boot. The persistence layer MUST use
a PostgreSQL database running in Docker through Spring Data JPA or an explicitly
justified Spring data-access alternative. Local setup MUST include Docker-based
database startup, schema migration or initialization, and reset instructions.

The user interface MUST be built with React and TypeScript. The UI MUST provide
user-facing flows for creating, reviewing, updating, and deleting employee
records, not only API calls or database scripts.

Configuration MUST keep secrets and environment-specific values out of source
control. Any database choice that requires local installation MUST include setup
and reset instructions in the feature quickstart.

## Development Workflow

Each feature MUST follow the Spec Kit sequence: specification, clarification
where needed, plan, tasks, implementation, and validation. The plan's
Constitution Check MUST verify compliance with this constitution before Phase 0
research and again after Phase 1 design.

Tasks MUST be organized by independently testable user story. The first user
story for the employee list application MUST deliver a demonstrable path for a
user to enter employee information and persist it to the database. Later stories
MUST not break earlier demonstrated behavior.

Clarifications MUST be annotated in the artifact that needs the decision using
`NEEDS CLARIFICATION(NAME): explanation` until resolved. A clarification marker
is acceptable only when it is visible in the Sync Impact Report or the relevant
spec/plan/tasks artifact and does not block the current increment from being
honestly demonstrated.

## Governance

This constitution supersedes conflicting local practices for the SDD Employee
List project. Pull requests, implementation reviews, and demo readiness checks
MUST verify adherence to the core principles, technology constraints, and
development workflow above.

Amendments MUST update this file, include a Sync Impact Report, and propagate
any changed expectations to affected Spec Kit templates or runtime guidance.
Versioning follows semantic versioning:

- MAJOR: Removes or redefines a core principle or governance requirement.
- MINOR: Adds a principle, required section, technology constraint, or workflow
  obligation.
- PATCH: Clarifies wording without changing obligations.

Compliance exceptions MUST be documented in the feature plan's Complexity
Tracking section with the reason, rejected simpler alternative, and any follow-up
needed to return to compliance.

**Version**: 1.1.0 | **Ratified**: 2026-06-18 | **Last Amended**: 2026-06-18
