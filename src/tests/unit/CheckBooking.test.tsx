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

  it('show office details when booking is found', async () => {
    const mockBookingData = {
      id: 1,
      name : 'John Doe',
      booking_trx_id: 'OTRX12345',
      phone_number: '08123456789',
      is_paid: 0,
      office: {
        id: 15,
        name: 'Nusa Dua Workspace',
        slug: 'nusa-dua-workspace',
        city: {
          name: 'Bali',
          slug: 'bali',
          photo: 'bali_city.jpg',
        },
        thumbnail: 'office_thumbnail.jpg'
      },
      duration: 7,
      total_amount: 7000000,
      started_date: '2024-09-01',
      ended_date: '2024-09-08',
    };

    (axios.post as jest.Mock).mockResolvedValueOnce({
      data: {
        data: mockBookingData,
      },
    });

    render(
      <MemoryRouter>
        <CheckBooking />
      </MemoryRouter>
    );
    
    const trxIdInput = screen.getByPlaceholderText(/write your booking trx id/i);
    const phoneInput = screen.getByPlaceholderText(/write your valid number/i);
    const submitButton = screen.getByText(/check booking/i);

    fireEvent.change(trxIdInput, { target: { value: 'OTRX12345' } });
    fireEvent.change(phoneInput, { target: { value: '08123456789' } });

    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(screen.getByText(/john doe/i)).toBeInTheDocument();
      expect(screen.getByText(/nusa dua workspace/i)).toBeInTheDocument();
      expect(screen.getByText(/bali/i)).toBeInTheDocument();
      expect(screen.getByText(/7 days/i)).toBeInTheDocument();
      expect(screen.getByText(/2024-09-01/i)).toBeInTheDocument();
      expect(screen.getByText(/2024-09-08/i)).toBeInTheDocument();
    });
  });

});
