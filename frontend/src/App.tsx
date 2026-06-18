import { useEffect, useState } from 'react';
import {
  ApiError,
  Employee,
  EmployeeInput,
  createEmployee,
  deleteEmployee,
  isApiError,
  listEmployees,
  updateEmployee,
} from './api/employees';
import EmployeeForm from './components/EmployeeForm';
import EmployeeTable from './components/EmployeeTable';

type Notice = {
  type: 'success' | 'error';
  message: string;
};

export default function App() {
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [selectedEmployee, setSelectedEmployee] = useState<Employee | null>(null);
  const [pendingDeleteId, setPendingDeleteId] = useState<number | null>(null);
  const [fieldErrors, setFieldErrors] = useState<ApiError['fieldErrors']>({});
  const [notice, setNotice] = useState<Notice | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    void refreshEmployees();
  }, []);

  async function refreshEmployees() {
    setIsLoading(true);
    try {
      setEmployees(await listEmployees());
      setNotice(null);
    } catch {
      setNotice({ type: 'error', message: 'Unable to load employees. Please try again.' });
    } finally {
      setIsLoading(false);
    }
  }

  async function handleSubmit(input: EmployeeInput) {
    setIsSaving(true);
    setFieldErrors({});
    setNotice(null);
    try {
      if (selectedEmployee) {
        await updateEmployee(selectedEmployee.id, input);
        setNotice({ type: 'success', message: 'Employee updated.' });
        setSelectedEmployee(null);
      } else {
        await createEmployee(input);
        setNotice({ type: 'success', message: 'Employee added.' });
      }
      setEmployees(await listEmployees());
    } catch (error) {
      if (isApiError(error)) {
        setFieldErrors(error.fieldErrors ?? {});
        setNotice({ type: 'error', message: error.message });
      } else {
        setNotice({ type: 'error', message: 'Unable to save employee. Please try again.' });
      }
    } finally {
      setIsSaving(false);
    }
  }

  async function handleConfirmDelete(id: number) {
    setNotice(null);
    try {
      await deleteEmployee(id);
      setPendingDeleteId(null);
      if (selectedEmployee?.id === id) {
        setSelectedEmployee(null);
      }
      setEmployees(await listEmployees());
      setNotice({ type: 'success', message: 'Employee removed.' });
    } catch (error) {
      setNotice({
        type: 'error',
        message: isApiError(error) ? error.message : 'Unable to remove employee. Please try again.',
      });
    }
  }

  return (
    <main className="app-shell">
      <section className="page-header">
        <div>
          <h1>Employee List</h1>
          <p>Manage employee names, email addresses, and phone numbers.</p>
        </div>
      </section>

      {notice && <p className={`notice ${notice.type}`}>{notice.message}</p>}

      <section className="content-grid">
        <EmployeeForm
          selectedEmployee={selectedEmployee}
          fieldErrors={fieldErrors}
          isSaving={isSaving}
          onSubmit={handleSubmit}
          onCancelEdit={() => {
            setSelectedEmployee(null);
            setFieldErrors({});
          }}
        />

        <section className="list-panel" aria-live="polite">
          <h2>Current employees</h2>
          {isLoading ? (
            <p className="empty-state">Loading employees...</p>
          ) : (
            <EmployeeTable
              employees={employees}
              selectedEmployeeId={selectedEmployee?.id ?? null}
              pendingDeleteId={pendingDeleteId}
              onEdit={(employee) => {
                setSelectedEmployee(employee);
                setPendingDeleteId(null);
                setFieldErrors({});
              }}
              onRequestDelete={setPendingDeleteId}
              onConfirmDelete={handleConfirmDelete}
              onCancelDelete={() => setPendingDeleteId(null)}
            />
          )}
        </section>
      </section>
    </main>
  );
}
