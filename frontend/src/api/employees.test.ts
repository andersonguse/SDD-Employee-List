import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { createEmployee, deleteEmployee, listEmployees, updateEmployee } from './employees';

const fetchMock = vi.fn();

beforeEach(() => {
  vi.stubGlobal('fetch', fetchMock);
});

afterEach(() => {
  vi.unstubAllGlobals();
  fetchMock.mockReset();
});

describe('employees api client', () => {
  it('lists employees', async () => {
    fetchMock.mockResolvedValue(jsonResponse([{ id: 1, name: 'Ada', email: 'ada@example.com', phoneNumber: '555-010-0100' }]));

    await expect(listEmployees()).resolves.toHaveLength(1);
    expect(fetchMock).toHaveBeenCalledWith('/api/employees');
  });

  it('creates employees', async () => {
    fetchMock.mockResolvedValue(jsonResponse({ id: 1, name: 'Ada', email: 'ada@example.com', phoneNumber: '555-010-0100' }, 201));

    await expect(createEmployee({ name: 'Ada', email: 'ada@example.com', phoneNumber: '555-010-0100' }))
      .resolves.toMatchObject({ id: 1 });
    expect(fetchMock).toHaveBeenCalledWith('/api/employees', expect.objectContaining({ method: 'POST' }));
  });

  it('updates employees', async () => {
    fetchMock.mockResolvedValue(jsonResponse({ id: 1, name: 'Ada Byron', email: 'ada@example.com', phoneNumber: '555-010-0100' }));

    await expect(updateEmployee(1, { name: 'Ada Byron', email: 'ada@example.com', phoneNumber: '555-010-0100' }))
      .resolves.toMatchObject({ name: 'Ada Byron' });
    expect(fetchMock).toHaveBeenCalledWith('/api/employees/1', expect.objectContaining({ method: 'PUT' }));
  });

  it('deletes employees', async () => {
    fetchMock.mockResolvedValue(new Response(null, { status: 204 }));

    await expect(deleteEmployee(1)).resolves.toBeUndefined();
    expect(fetchMock).toHaveBeenCalledWith('/api/employees/1', { method: 'DELETE' });
  });

  it('throws parsed api errors', async () => {
    fetchMock.mockResolvedValue(jsonResponse({ message: 'Bad data', fieldErrors: { email: 'Duplicate' } }, 409));

    await expect(createEmployee({ name: 'Ada', email: 'ada@example.com', phoneNumber: '555-010-0100' }))
      .rejects.toMatchObject({ message: 'Bad data', fieldErrors: { email: 'Duplicate' } });
  });
});

function jsonResponse(body: unknown, status = 200) {
  return new Response(JSON.stringify(body), {
    status,
    headers: { 'Content-Type': 'application/json' },
  });
}
