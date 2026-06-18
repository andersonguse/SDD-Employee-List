import { FormEvent, useEffect, useState } from 'react';
import type { ApiError, Employee, EmployeeInput } from '../api/employees';

type EmployeeFormProps = {
  selectedEmployee: Employee | null;
  fieldErrors: ApiError['fieldErrors'];
  isSaving: boolean;
  onSubmit: (input: EmployeeInput) => Promise<void>;
  onCancelEdit: () => void;
};

const emptyForm: EmployeeInput = {
  name: '',
  email: '',
  phoneNumber: '',
};

export default function EmployeeForm({
  selectedEmployee,
  fieldErrors,
  isSaving,
  onSubmit,
  onCancelEdit,
}: EmployeeFormProps) {
  const [form, setForm] = useState<EmployeeInput>(emptyForm);

  useEffect(() => {
    if (selectedEmployee) {
      setForm({
        name: selectedEmployee.name,
        email: selectedEmployee.email,
        phoneNumber: selectedEmployee.phoneNumber,
      });
    } else {
      setForm(emptyForm);
    }
  }, [selectedEmployee]);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    await onSubmit(form);
    if (!selectedEmployee) {
      setForm(emptyForm);
    }
  }

  const formLabel = selectedEmployee ? 'Edit employee' : 'Add employee';

  return (
    <form
      className="employee-form"
      onSubmit={handleSubmit}
      noValidate
      autoComplete="off"
      aria-label={formLabel}
    >
      <div className="form-header">
        <h2>{formLabel}</h2>
        {selectedEmployee && (
          <button type="button" className="ghost-button" onClick={onCancelEdit}>
            Cancel
          </button>
        )}
      </div>

      <label>
        <span>Name</span>
        <input
          autoComplete="off"
          value={form.name}
          onChange={(event) => setForm({ ...form, name: event.target.value })}
          aria-invalid={Boolean(fieldErrors.name)}
          aria-describedby={fieldErrors.name ? 'name-error' : undefined}
        />
      </label>
      {fieldErrors.name && <p id="name-error" className="field-error">{fieldErrors.name}</p>}

      <label>
        <span>Email address</span>
        <input
          type="email"
          autoComplete="off"
          value={form.email}
          onChange={(event) => setForm({ ...form, email: event.target.value })}
          aria-invalid={Boolean(fieldErrors.email)}
          aria-describedby={fieldErrors.email ? 'email-error' : undefined}
        />
      </label>
      {fieldErrors.email && <p id="email-error" className="field-error">{fieldErrors.email}</p>}

      <label>
        <span>Phone number</span>
        <input
          autoComplete="off"
          value={form.phoneNumber}
          onChange={(event) => setForm({ ...form, phoneNumber: event.target.value })}
          aria-invalid={Boolean(fieldErrors.phoneNumber)}
          aria-describedby={fieldErrors.phoneNumber ? 'phone-error' : undefined}
        />
      </label>
      {fieldErrors.phoneNumber && (
        <p id="phone-error" className="field-error">{fieldErrors.phoneNumber}</p>
      )}

      <button className="primary-button" type="submit" disabled={isSaving}>
        {isSaving ? 'Saving...' : selectedEmployee ? 'Save changes' : 'Add employee'}
      </button>
    </form>
  );
}
