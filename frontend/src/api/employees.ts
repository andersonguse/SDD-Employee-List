export type Employee = {
  id: number;
  name: string;
  email: string;
  phoneNumber: string;
};

export type EmployeeInput = {
  name: string;
  email: string;
  phoneNumber: string;
};

export type ApiError = {
  message: string;
  fieldErrors: Record<string, string>;
};

const baseUrl = '/api/employees';

export async function listEmployees(): Promise<Employee[]> {
  const response = await fetch(baseUrl);
  return parseResponse<Employee[]>(response);
}

export async function createEmployee(input: EmployeeInput): Promise<Employee> {
  const response = await fetch(baseUrl, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(input),
  });
  return parseResponse<Employee>(response);
}

export async function updateEmployee(id: number, input: EmployeeInput): Promise<Employee> {
  const response = await fetch(`${baseUrl}/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(input),
  });
  return parseResponse<Employee>(response);
}

export async function deleteEmployee(id: number): Promise<void> {
  const response = await fetch(`${baseUrl}/${id}`, { method: 'DELETE' });
  if (response.status === 204) {
    return;
  }
  await parseResponse<never>(response);
}

export function isApiError(error: unknown): error is ApiError {
  return Boolean(
    error &&
      typeof error === 'object' &&
      'message' in error &&
      'fieldErrors' in error,
  );
}

async function parseResponse<T>(response: Response): Promise<T> {
  if (response.ok) {
    if (response.status === 204) {
      return undefined as T;
    }
    return (await response.json()) as T;
  }

  const fallback: ApiError = {
    message: 'Something went wrong. Please try again.',
    fieldErrors: {},
  };

  try {
    throw { ...fallback, ...(await response.json()) };
  } catch (error) {
    if (isApiError(error)) {
      throw error;
    }
    throw fallback;
  }
}
