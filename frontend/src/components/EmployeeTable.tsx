import type { Employee } from '../api/employees';

type EmployeeTableProps = {
  employees: Employee[];
  selectedEmployeeId: number | null;
  pendingDeleteId: number | null;
  onEdit: (employee: Employee) => void;
  onRequestDelete: (id: number) => void;
  onConfirmDelete: (id: number) => void;
  onCancelDelete: () => void;
};

export default function EmployeeTable({
  employees,
  selectedEmployeeId,
  pendingDeleteId,
  onEdit,
  onRequestDelete,
  onConfirmDelete,
  onCancelDelete,
}: EmployeeTableProps) {
  if (employees.length === 0) {
    return <p className="empty-state">No employees yet. Add one to get started.</p>;
  }

  return (
    <table className="employee-table">
      <thead>
        <tr>
          <th>ID</th>
          <th>Name</th>
          <th>Email</th>
          <th>Phone</th>
          <th>Actions</th>
        </tr>
      </thead>
      <tbody>
        {employees.map((employee) => (
          <tr key={employee.id} className={selectedEmployeeId === employee.id ? 'selected-row' : undefined}>
            <td>{employee.id}</td>
            <td>{employee.name}</td>
            <td>{employee.email}</td>
            <td>{employee.phoneNumber}</td>
            <td>
              {pendingDeleteId === employee.id ? (
                <div className="row-actions">
                  <button className="danger-button" onClick={() => onConfirmDelete(employee.id)}>
                    Confirm
                  </button>
                  <button className="ghost-button" onClick={onCancelDelete}>
                    Cancel
                  </button>
                </div>
              ) : (
                <div className="row-actions">
                  <button className="ghost-button" onClick={() => onEdit(employee)}>
                    Edit
                  </button>
                  <button className="danger-button" onClick={() => onRequestDelete(employee.id)}>
                    Remove
                  </button>
                </div>
              )}
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}
