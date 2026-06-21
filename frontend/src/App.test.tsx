import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import App from './App';

const fetchMock = vi.fn();

beforeEach(() => {
  vi.stubGlobal('fetch', fetchMock);
});

afterEach(() => {
  vi.unstubAllGlobals();
  fetchMock.mockReset();
});

describe('App', () => {
  it('shows duplicate-email alert and keeps create form values after failed create', async () => {
    fetchMock
      .mockResolvedValueOnce(jsonResponse([]))
      .mockResolvedValueOnce(jsonResponse({
        message: 'Cannot use existing email',
        fieldErrors: { email: 'Cannot use existing email' },
      }, 409));

    render(<App />);

    await screen.findByText(/no employees yet/i);
    await userEvent.type(screen.getByLabelText(/name/i), 'Ada Lovelace');
    await userEvent.type(screen.getByLabelText(/email/i), 'ada@example.com');
    await userEvent.type(screen.getByLabelText(/phone/i), '555-010-0100');
    await userEvent.click(screen.getByRole('button', { name: /add employee/i }));

    expect(await screen.findByRole('alert')).toHaveTextContent('Cannot use existing email');
    expect(screen.getByLabelText(/name/i)).toHaveValue('Ada Lovelace');
    expect(screen.getByLabelText(/email/i)).toHaveValue('ada@example.com');
    expect(screen.getByLabelText(/phone/i)).toHaveValue('555-010-0100');
  });

  it('shows duplicate-email alert and keeps edit form values after failed update', async () => {
    fetchMock
      .mockResolvedValueOnce(jsonResponse([
        { id: 1, name: 'Ada Lovelace', email: 'ada@example.com', phoneNumber: '555-010-0100' },
        { id: 2, name: 'Grace Hopper', email: 'grace@example.com', phoneNumber: '555-010-0101' },
      ]))
      .mockResolvedValueOnce(jsonResponse({
        message: 'Cannot use existing email',
        fieldErrors: { email: 'Cannot use existing email' },
      }, 409));

    render(<App />);

    await screen.findByText('Ada Lovelace');
    await userEvent.click(screen.getAllByRole('button', { name: /edit/i })[0]);
    await userEvent.clear(screen.getByLabelText(/name/i));
    await userEvent.type(screen.getByLabelText(/name/i), 'Ada Byron');
    await userEvent.clear(screen.getByLabelText(/email/i));
    await userEvent.type(screen.getByLabelText(/email/i), 'grace@example.com');
    await userEvent.click(screen.getByRole('button', { name: /save changes/i }));

    expect(await screen.findByRole('alert')).toHaveTextContent('Cannot use existing email');
    expect(screen.getByLabelText(/name/i)).toHaveValue('Ada Byron');
    expect(screen.getByLabelText(/email/i)).toHaveValue('grace@example.com');
    expect(screen.getByLabelText(/phone/i)).toHaveValue('555-010-0100');
    await waitFor(() => expect(fetchMock).toHaveBeenCalledTimes(2));
  });
});

function jsonResponse(body: unknown, status = 200) {
  return new Response(JSON.stringify(body), {
    status,
    headers: { 'Content-Type': 'application/json' },
  });
}
