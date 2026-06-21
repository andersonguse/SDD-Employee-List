import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';
import EmployeeForm from './EmployeeForm';

function expectAutofillSuppressed(input: HTMLElement) {
  expect(input).toHaveAttribute('autocomplete', 'new-password');
  expect(input).toHaveAttribute('data-lpignore', 'true');
  expect(input).toHaveAttribute('data-form-type', 'other');
  expect(input).toHaveAttribute('data-1p-ignore', 'true');
  expect(input).toHaveAttribute('data-bwignore', 'true');
}

describe('EmployeeForm', () => {
  it('submits create values', async () => {
    const onSubmit = vi.fn().mockResolvedValue(undefined);
    render(
      <EmployeeForm
        selectedEmployee={null}
        fieldErrors={{}}
        isSaving={false}
        onSubmit={onSubmit}
        onCancelEdit={vi.fn()}
      />,
    );

    await userEvent.type(screen.getByLabelText(/name/i), 'Ada Lovelace');
    await userEvent.type(screen.getByLabelText(/email/i), 'ada@example.com');
    await userEvent.type(screen.getByLabelText(/phone/i), '555-010-0100');
    await userEvent.click(screen.getByRole('button', { name: /add employee/i }));

    expect(onSubmit).toHaveBeenCalledWith({
      name: 'Ada Lovelace',
      email: 'ada@example.com',
      phoneNumber: '555-010-0100',
    });
  });

  it('shows field errors', () => {
    render(
      <EmployeeForm
        selectedEmployee={null}
        fieldErrors={{ email: 'Email is invalid' }}
        isSaving={false}
        onSubmit={vi.fn()}
        onCancelEdit={vi.fn()}
      />,
    );

    expect(screen.getByText('Email is invalid')).toBeInTheDocument();
    expect(screen.getByLabelText(/email/i)).toHaveAttribute('aria-invalid', 'true');
  });

  it('shows name character guidance in create mode', () => {
    render(
      <EmployeeForm
        selectedEmployee={null}
        fieldErrors={{}}
        isSaving={false}
        onSubmit={vi.fn()}
        onCancelEdit={vi.fn()}
      />,
    );

    expect(screen.getByLabelText(/name/i)).toHaveAttribute('pattern', '[A-Za-z ]+');
    expect(screen.getByLabelText(/name/i)).toHaveAttribute(
      'title',
      'Name may contain English letters and spaces only',
    );
  });

  it('keeps create values after failed submit', async () => {
    const onSubmit = vi.fn().mockResolvedValue(false);
    render(
      <EmployeeForm
        selectedEmployee={null}
        fieldErrors={{ email: 'Cannot use existing email' }}
        isSaving={false}
        onSubmit={onSubmit}
        onCancelEdit={vi.fn()}
      />,
    );

    await userEvent.type(screen.getByLabelText(/name/i), 'Ada Lovelace');
    await userEvent.type(screen.getByLabelText(/email/i), 'ada@example.com');
    await userEvent.type(screen.getByLabelText(/phone/i), '555-010-0100');
    await userEvent.click(screen.getByRole('button', { name: /add employee/i }));

    expect(screen.getByText('Cannot use existing email')).toBeInTheDocument();
    expect(screen.getByLabelText(/name/i)).toHaveValue('Ada Lovelace');
    expect(screen.getByLabelText(/email/i)).toHaveValue('ada@example.com');
    expect(screen.getByLabelText(/phone/i)).toHaveValue('555-010-0100');
  });

  it('shows phone format guidance in create mode', () => {
    render(
      <EmployeeForm
        selectedEmployee={null}
        fieldErrors={{}}
        isSaving={false}
        onSubmit={vi.fn()}
        onCancelEdit={vi.fn()}
      />,
    );

    expect(screen.getByLabelText(/phone/i)).toHaveAttribute('type', 'tel');
    expect(screen.getByLabelText(/phone/i)).toHaveAttribute('inputmode', 'numeric');
    expect(screen.getByLabelText(/phone/i)).toHaveAttribute('placeholder', '123-456-7890');
    expect(screen.getByLabelText(/phone/i)).toHaveAttribute('pattern', '\\d{3}-\\d{3}-\\d{4}');
  });

  it('disables browser autocomplete for create mode employee fields', () => {
    render(
      <EmployeeForm
        selectedEmployee={null}
        fieldErrors={{}}
        isSaving={false}
        onSubmit={vi.fn()}
        onCancelEdit={vi.fn()}
      />,
    );

    expect(screen.getByRole('form', { name: /add employee/i })).toHaveAttribute(
      'autocomplete',
      'off',
    );
    expect(screen.getByRole('form', { name: /add employee/i })).toHaveAttribute(
      'data-lpignore',
      'true',
    );
    expectAutofillSuppressed(screen.getByLabelText(/name/i));
    expectAutofillSuppressed(screen.getByLabelText(/email/i));
    expect(screen.getByLabelText(/email/i)).toHaveAttribute('type', 'text');
    expect(screen.getByLabelText(/email/i)).toHaveAttribute('inputmode', 'email');
    expectAutofillSuppressed(screen.getByLabelText(/phone/i));
  });

  it('prefills edit values and cancels edit mode', async () => {
    const onCancelEdit = vi.fn();
    render(
      <EmployeeForm
        selectedEmployee={{ id: 1, name: 'Ada', email: 'ada@example.com', phoneNumber: '555-010-0100' }}
        fieldErrors={{}}
        isSaving={false}
        onSubmit={vi.fn()}
        onCancelEdit={onCancelEdit}
      />,
    );

    expect(screen.getByLabelText(/name/i)).toHaveValue('Ada');
    await userEvent.click(screen.getByRole('button', { name: /cancel/i }));
    expect(onCancelEdit).toHaveBeenCalled();
  });

  it('shows phone format guidance in edit mode', () => {
    render(
      <EmployeeForm
        selectedEmployee={{ id: 1, name: 'Ada', email: 'ada@example.com', phoneNumber: '555-010-0100' }}
        fieldErrors={{}}
        isSaving={false}
        onSubmit={vi.fn()}
        onCancelEdit={vi.fn()}
      />,
    );

    expect(screen.getByLabelText(/phone/i)).toHaveAttribute('type', 'tel');
    expect(screen.getByLabelText(/phone/i)).toHaveAttribute('inputmode', 'numeric');
    expect(screen.getByLabelText(/phone/i)).toHaveAttribute('placeholder', '123-456-7890');
    expect(screen.getByLabelText(/phone/i)).toHaveAttribute('pattern', '\\d{3}-\\d{3}-\\d{4}');
  });

  it('shows name character guidance in edit mode', () => {
    render(
      <EmployeeForm
        selectedEmployee={{ id: 1, name: 'Ada', email: 'ada@example.com', phoneNumber: '555-010-0100' }}
        fieldErrors={{}}
        isSaving={false}
        onSubmit={vi.fn()}
        onCancelEdit={vi.fn()}
      />,
    );

    expect(screen.getByLabelText(/name/i)).toHaveAttribute('pattern', '[A-Za-z ]+');
    expect(screen.getByLabelText(/name/i)).toHaveAttribute(
      'title',
      'Name may contain English letters and spaces only',
    );
  });

  it('keeps edit values after failed submit', async () => {
    const onSubmit = vi.fn().mockResolvedValue(false);
    render(
      <EmployeeForm
        selectedEmployee={{ id: 1, name: 'Ada', email: 'ada@example.com', phoneNumber: '555-010-0100' }}
        fieldErrors={{ email: 'Cannot use existing email' }}
        isSaving={false}
        onSubmit={onSubmit}
        onCancelEdit={vi.fn()}
      />,
    );

    await userEvent.clear(screen.getByLabelText(/name/i));
    await userEvent.type(screen.getByLabelText(/name/i), 'Ada Byron');
    await userEvent.clear(screen.getByLabelText(/email/i));
    await userEvent.type(screen.getByLabelText(/email/i), 'ada.byron@example.com');
    await userEvent.click(screen.getByRole('button', { name: /save changes/i }));

    expect(screen.getByText('Cannot use existing email')).toBeInTheDocument();
    expect(screen.getByLabelText(/name/i)).toHaveValue('Ada Byron');
    expect(screen.getByLabelText(/email/i)).toHaveValue('ada.byron@example.com');
  });

  it('disables browser autocomplete for edit mode employee fields', () => {
    render(
      <EmployeeForm
        selectedEmployee={{ id: 1, name: 'Ada', email: 'ada@example.com', phoneNumber: '555-010-0100' }}
        fieldErrors={{}}
        isSaving={false}
        onSubmit={vi.fn()}
        onCancelEdit={vi.fn()}
      />,
    );

    expect(screen.getByRole('form', { name: /edit employee/i })).toHaveAttribute(
      'autocomplete',
      'off',
    );
    expect(screen.getByRole('form', { name: /edit employee/i })).toHaveAttribute(
      'data-lpignore',
      'true',
    );
    expectAutofillSuppressed(screen.getByLabelText(/name/i));
    expectAutofillSuppressed(screen.getByLabelText(/email/i));
    expect(screen.getByLabelText(/email/i)).toHaveAttribute('type', 'text');
    expect(screen.getByLabelText(/email/i)).toHaveAttribute('inputmode', 'email');
    expectAutofillSuppressed(screen.getByLabelText(/phone/i));
  });
});
