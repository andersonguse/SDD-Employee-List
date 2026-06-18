import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';
import EmployeeForm from './EmployeeForm';

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
    await userEvent.type(screen.getByLabelText(/phone/i), '555-0100');
    await userEvent.click(screen.getByRole('button', { name: /add employee/i }));

    expect(onSubmit).toHaveBeenCalledWith({
      name: 'Ada Lovelace',
      email: 'ada@example.com',
      phoneNumber: '555-0100',
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
    expect(screen.getByLabelText(/name/i)).toHaveAttribute('autocomplete', 'off');
    expect(screen.getByLabelText(/email/i)).toHaveAttribute('autocomplete', 'off');
    expect(screen.getByLabelText(/phone/i)).toHaveAttribute('autocomplete', 'off');
  });

  it('prefills edit values and cancels edit mode', async () => {
    const onCancelEdit = vi.fn();
    render(
      <EmployeeForm
        selectedEmployee={{ id: 1, name: 'Ada', email: 'ada@example.com', phoneNumber: '555-0100' }}
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

  it('disables browser autocomplete for edit mode employee fields', () => {
    render(
      <EmployeeForm
        selectedEmployee={{ id: 1, name: 'Ada', email: 'ada@example.com', phoneNumber: '555-0100' }}
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
    expect(screen.getByLabelText(/name/i)).toHaveAttribute('autocomplete', 'off');
    expect(screen.getByLabelText(/email/i)).toHaveAttribute('autocomplete', 'off');
    expect(screen.getByLabelText(/phone/i)).toHaveAttribute('autocomplete', 'off');
  });
});
