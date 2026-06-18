<!--
Sync Impact Report
Version change: 1.1.0 -> 2.0.0
Modified principles:
- I. Spec-Driven Demonstrability -> I. Specification First
- II. Spring Boot Boundary Discipline -> II. Simplicity
- III. Test-First Implementation -> III. Layered Architecture
- IV. Employee Data Integrity and Privacy -> IV. Data Integrity
- V. Simple, Observable Demo Operations -> V. Testability
- Added VI. Traceability
- Added VII. Verification
Added sections:
- None
Removed sections:
- Technology Constraints
Templates requiring updates:
- updated: .specify/templates/plan-template.md
- updated: .specify/templates/spec-template.md
- updated: .specify/templates/tasks-template.md
- not present: .specify/templates/commands/*.md
Follow-up NEEDS CLARIFICATION items:
- NEEDS CLARIFICATION(APPROVAL_AUTHORITY): Confirm who approves specifications and acceptance criteria before implementation.
-->
# SDD Employee List Constitution

## Core Principles

### I. Specification First
Requirements and acceptance criteria MUST be documented and approved before
implementation begins. Specifications MUST identify user journeys, functional
requirements, acceptance scenarios, edge cases, and success criteria at a level
that allows implementation work to proceed without guessing about intended
behavior.

NEEDS CLARIFICATION(APPROVAL_AUTHORITY): Confirm who approves specifications and
acceptance criteria before implementation.

Rationale: Spec Driven Development depends on shared agreement about what will
be built before deciding how to build it.

### II. Simplicity
Solutions SHOULD favor clarity and maintainability over unnecessary complexity.
Plans and implementations MUST choose the simplest design that satisfies the
approved requirements, and any added abstraction, dependency, architectural
layer, or workflow step MUST have a documented reason tied to current
requirements.

Rationale: Simpler designs are easier to review, explain, test, and evolve
during a specification-led demonstration.

### III. Layered Architecture
Business logic, API concerns, and data access concerns MUST remain separated.
Feature plans MUST identify the ownership boundaries for domain behavior,
request/response handling, persistence, and user interface behavior before
implementation starts. Implementation tasks MUST preserve those boundaries
unless a documented complexity exception justifies a different structure.

Rationale: Clear layers make behavior easier to verify and reduce accidental
coupling between implementation details and business rules.

### IV. Data Integrity
Input validation MUST occur before persistence. Invalid data MUST never be
stored. Requirements and plans MUST specify validation rules, failure behavior,
and any uniqueness or consistency constraints for persisted data before the
affected implementation tasks begin.

Rationale: Data correctness is a core product behavior, not an incidental
technical detail.

### V. Testability
Core business behavior MUST be verifiable through automated tests. Each feature
plan MUST identify which requirements require automated coverage and at what
level, such as unit, integration, contract, or end-to-end tests. Tests MUST be
traceable to requirements or acceptance criteria.

Rationale: Automated tests provide repeatable evidence that the implementation
matches the specification.

### VI. Traceability
Implementation work MUST be traceable to specifications, plans, and tasks. Each
task MUST reference the user story, requirement, acceptance criterion, or design
decision it implements. Work that cannot be traced to an approved artifact MUST
pause until the missing specification, plan, or task detail is added.

Rationale: Traceability keeps the SDD workflow honest and makes review possible
without reconstructing intent from code alone.

### VII. Verification
AI-generated code MUST be reviewed against requirements and acceptance criteria
before acceptance. Review MUST check for requirement coverage, architectural
alignment, validation behavior, test coverage, and unintended scope expansion.
Code is not accepted until the reviewer can explain how it satisfies the
approved specification.

Rationale: AI can accelerate implementation, but acceptance still requires
evidence that the generated work matches the agreed behavior.

## Development Workflow

Each feature MUST follow the Spec Kit sequence: specification, clarification
where needed, plan, tasks, implementation, and verification. Technology stack
choices belong in the feature plan unless a future constitution amendment makes
them governance requirements.

Clarifications MUST be annotated in the artifact that needs the decision using
`NEEDS CLARIFICATION(NAME): explanation` until resolved. A clarification marker
is acceptable only when it is visible in the Sync Impact Report or the relevant
spec/plan/tasks artifact and does not block the current increment from being
honestly demonstrated.

Complexity exceptions MUST be documented in the feature plan with the reason,
the simpler alternative considered, and why the added complexity is required by
approved requirements.

## Governance

This constitution supersedes conflicting local practices for the SDD Employee
List project. Pull requests, implementation reviews, and demo readiness checks
MUST verify adherence to the core principles and development workflow above.

Amendments MUST update this file, include a Sync Impact Report, and propagate
any changed expectations to affected Spec Kit templates or runtime guidance.
Versioning follows semantic versioning:

- MAJOR: Removes or redefines a core principle or governance requirement.
- MINOR: Adds a principle, required section, or workflow obligation.
- PATCH: Clarifies wording without changing obligations.

Compliance exceptions MUST be documented in the feature plan's Complexity
Tracking section with the reason, rejected simpler alternative, and any follow-up
needed to return to compliance.

**Version**: 2.0.0 | **Ratified**: 2026-06-18 | **Last Amended**: 2026-06-18
