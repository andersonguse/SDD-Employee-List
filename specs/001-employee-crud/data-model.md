# Data Model: Employee CRUD Management

## Entity: Employee

Represents a person tracked by the application.

### Fields

| Field | Type | Required | Rules |
|-------|------|----------|-------|
| id | Integer/Long | Yes | Auto-generated, incrementing primary identifier assigned on create |
| name | Text | Yes | Trimmed, non-empty after trimming |
| email | Text | Yes | Trimmed, valid email format, unique across employees |
| phoneNumber | Text | Yes | Trimmed, 7 to 20 characters after removing spaces and common formatting; may include digits, spaces, parentheses, hyphens, periods, and one leading plus sign |

### Constraints

- `id` is immutable after creation.
- `email` must be unique. Updates may keep the same employee's current email.
- `name`, `email`, and `phoneNumber` must be validated before persistence.
- Invalid create and update attempts must not change persisted data.
- Delete removes the employee from the current list; no recovery workflow is in
  scope for this feature.

### State Transitions

```text
New form input -> Validated -> Persisted employee
Persisted employee -> Validated edits -> Updated employee
Persisted employee -> Delete confirmed -> Removed employee
Persisted employee -> Invalid edits -> Persisted employee unchanged
```

## Validation Error Model

Validation failures should return field-specific messages for:

- Missing or blank name
- Missing or malformed email
- Duplicate email
- Missing or unsupported phone number

Unexpected failures should return a general user-facing message without exposing
database or stack details.

## Traceability

- FR-003, FR-004: Employee creation and persistence
- FR-005: Employee list display fields
- FR-006, FR-013: Employee update behavior and failed edit preservation
- FR-007: Employee removal behavior
- FR-008 through FR-012: Required fields, validation, uniqueness, and messages
- FR-015: Unexpected operation failure handling
