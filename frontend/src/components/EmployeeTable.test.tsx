import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';
import EmployeeTable from './EmployeeTable';

const employees = [
  { id: 1, name: 'Ada Lovelace', email: 'ada@example.com', phoneNumber: '555-0100' },
];

describe('EmployeeTable', () => {
  it('renders employee rows', () => {
    renderTable();

    expect(screen.getByText('Ada Lovelace')).toBeInTheDocument();
    expect(screen.getByText('ada@example.com')).toBeInTheDocument();
    expect(screen.getByText('555-0100')).toBeInTheDocument();
  });

  it('renders an empty state', () => {
    renderTable({ employees: [] });

    expect(screen.getByText(/no employees yet/i)).toBeInTheDocument();
  });

  it('calls edit for a row', async () => {
    const onEdit = vi.fn();
    renderTable({ onEdit });

    await userEvent.click(screen.getByRole('button', { name: /edit/i }));
    expect(onEdit).toHaveBeenCalledWith(employees[0]);
  });

  it('confirms and cancels delete', async () => {
    const onConfirmDelete = vi.fn();
    const onCancelDelete = vi.fn();
    renderTable({ pendingDeleteId: 1, onConfirmDelete, onCancelDelete });

    await userEvent.click(screen.getByRole('button', { name: /confirm/i }));
    expect(onConfirmDelete).toHaveBeenCalledWith(1);

    await userEvent.click(screen.getByRole('button', { name: /cancel/i }));
    expect(onCancelDelete).toHaveBeenCalled();
  });
});

function renderTable(overrides = {}) {
  return render(
    <EmployeeTable
      employees={employees}
      selectedEmployeeId={null}
      pendingDeleteId={null}
      onEdit={vi.fn()}
      onRequestDelete={vi.fn()}
      onConfirmDelete={vi.fn()}
      onCancelDelete={vi.fn()}
      {...overrides}
    />,
  );
}
