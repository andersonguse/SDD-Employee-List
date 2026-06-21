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

  const fallback = errorForStatus(response.status);

  try {
    const body = await response.json();
    throw normalizeApiError(body, fallback);
  } catch (error) {
    if (isApiError(error)) {
      throw error;
    }
    throw fallback;
  }
}

function normalizeApiError(body: unknown, fallback: ApiError): ApiError {
  if (!body || typeof body !== 'object') {
    return fallback;
  }

  const maybeError = body as Partial<ApiError>;
  return {
    message: typeof maybeError.message === 'string' ? maybeError.message : fallback.message,
    fieldErrors: isFieldErrors(maybeError.fieldErrors) ? maybeError.fieldErrors : fallback.fieldErrors,
  };
}

function isFieldErrors(value: unknown): value is Record<string, string> {
  return Boolean(
    value &&
      typeof value === 'object' &&
      Object.values(value).every((fieldError) => typeof fieldError === 'string'),
  );
}

function errorForStatus(status: number): ApiError {
  if (status === 409) {
    return {
      message: 'Cannot use existing email',
      fieldErrors: { email: 'Cannot use existing email' },
    };
  }

  if (status === 400) {
    return {
      message: 'Please correct the highlighted fields',
      fieldErrors: {},
    };
  }

  if (status === 403) {
    return {
      message: 'The save request was blocked. Please check the form values and try again.',
      fieldErrors: {},
    };
  }

  return {
    message: 'Unable to save employee. Please try again.',
    fieldErrors: {},
  };
}
