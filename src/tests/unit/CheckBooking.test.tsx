import { render, screen, waitFor, fireEvent } from '@testing-library/react';
import axios from 'axios';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import '@testing-library/jest-dom';
import { MemoryRouter } from 'react-router-dom';
import CheckBooking from '../../pages/CheckBooking';

vi.mock('axios');

describe('CheckBooking Component', () => {
  beforeEach(() => {
    vi.resetAllMocks();
  });

  it('renders input fields correctly', () => {
    render(
      <MemoryRouter>
        <CheckBooking />
      </MemoryRouter>
    );
    
    expect(screen.getByPlaceholderText(/write your booking trx id/i)).toBeInTheDocument();
    expect(screen.getByPlaceholderText(/write your valid number/i)).toBeInTheDocument();
  });

  it('handles input changes for booking_trx_id and phone_number', () => {
    render(
      <MemoryRouter>
        <CheckBooking />
      </MemoryRouter>
    );

    const trxIdInput = screen.getByPlaceholderText(/write your booking trx id/i);
    const phoneInput = screen.getByPlaceholderText(/write your valid number/i);

    fireEvent.change(trxIdInput, { target: { value: 'OTRX12345' } });
    fireEvent.change(phoneInput, { target: { value: '08123456789' } });

    expect(trxIdInput).toHaveValue('OTRX12345');
    expect(phoneInput).toHaveValue('08123456789');
  });

});
