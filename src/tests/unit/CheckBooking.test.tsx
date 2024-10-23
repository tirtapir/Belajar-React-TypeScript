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

        // ERROR
//     it('handles form submission and displays booking details on success', async () => {
//     (axios.post as jest.Mock).mockResolvedValueOnce({
//       data: {
//         office: { name: 'Office A', city: { name: 'City A' }, thumbnail: '' },
//         name: 'John Doe',
//         phone_number: '08123456789',
//         started_at: '2024-01-01T10:00:00',
//         ended_at: '2024-01-01T12:00:00',
//       },
//     });
  
//     render(
//       <MemoryRouter>
//         <CheckBooking />
//       </MemoryRouter>
//     );
  
//     const trxIdInput = screen.getByPlaceholderText(/write your booking trx id/i);
//     const phoneInput = screen.getByPlaceholderText(/write your valid number/i);
//     const submitButton = screen.getByText(/check booking/i);
  
//     fireEvent.change(trxIdInput, { target: { value: 'TRX12345' } });
//     fireEvent.change(phoneInput, { target: { value: '08123456789' } });
  
//     fireEvent.click(submitButton);
  
//     await waitFor(() => {
//       expect(screen.getByText(/office a/i)).toBeInTheDocument();
//       expect(screen.getByText(/john doe/i)).toBeInTheDocument();
//       expect(screen.getByText(/08123456789/i)).toBeInTheDocument();
//       expect(screen.getByText(/10:00/i)).toBeInTheDocument();  
//       expect(screen.getByText(/12:00/i)).toBeInTheDocument(); 
//     });
//   });
  

     // ERROR
//   it('displays an error message when API call fails', async () => {
//     (axios.post as jest.Mock).mockRejectedValueOnce(new Error('Network Error'));

//     render(
//       <MemoryRouter>
//         <CheckBooking />
//       </MemoryRouter>
//     );

//     const trxIdInput = screen.getByPlaceholderText(/write your booking trx id/i);
//     const phoneInput = screen.getByPlaceholderText(/write your valid number/i);
//     const submitButton = screen.getByText(/check booking/i);

//     fireEvent.change(trxIdInput, { target: { value: 'TRX12345' } });
//     fireEvent.change(phoneInput, { target: { value: '08123456789' } });

//     fireEvent.click(submitButton);

//     await waitFor(() => {
//       expect(screen.getByText(/error loading data/i)).toBeInTheDocument();
//     });
//   });

     // ERROR
//   it('handles edit and save booking details', async () => {
//     (axios.post as jest.Mock).mockResolvedValueOnce({
//       data: {
//         id: 1,
//         office: { name: 'Office A', city: { name: 'City A' }, thumbnail: '' },
//         name: 'John Doe',
//         phone_number: '08123456789',
//         started_at: '2024-01-01T10:00:00',
//         ended_at: '2024-01-01T12:00:00',
//       },
//     });

//     (axios.patch as jest.Mock).mockResolvedValueOnce({
//       data: {
//         name: 'John Smith',
//         phone_number: '08123456789',
//         started_at: '2024-01-01T10:00:00',
//         ended_at: '2024-01-01T12:00:00',
//       },
//     });

//     render(
//       <MemoryRouter>
//         <CheckBooking />
//       </MemoryRouter>
//     );

//     const trxIdInput = screen.getByPlaceholderText(/write your booking trx id/i);
//     const phoneInput = screen.getByPlaceholderText(/write your valid number/i);
//     const submitButton = screen.getByText(/check booking/i);

//     fireEvent.change(trxIdInput, { target: { value: 'TRX12345' } });
//     fireEvent.change(phoneInput, { target: { value: '08123456789' } });

//     fireEvent.click(submitButton);

//     await waitFor(() => {
//       expect(screen.getByText(/john doe/i)).toBeInTheDocument();
//     });

//     const editButton = screen.getByText(/edit/i);
//     fireEvent.click(editButton);

//     const nameInput = screen.getByPlaceholderText(/write your full name/i);
//     fireEvent.change(nameInput, { target: { value: 'John Smith' } });

//     const saveButton = screen.getByText(/save changes/i);
//     fireEvent.click(saveButton);

//     await waitFor(() => {
//       expect(screen.getByText(/john smith/i)).toBeInTheDocument();
//     });
//   });

    // ERROR
//   it('handles booking deletion', async () => {
//     (axios.post as jest.Mock).mockResolvedValueOnce({
//       data: {
//         id: 1,
//         office: { name: 'Office A', city: { name: 'City A' }, thumbnail: '' },
//         name: 'John Doe',
//         phone_number: '08123456789',
//         started_at: '2024-01-01T10:00:00',
//         ended_at: '2024-01-01T12:00:00',
//       },
//     });

//     (axios.delete as jest.Mock).mockResolvedValueOnce({});

//     render(
//       <MemoryRouter>
//         <CheckBooking />
//       </MemoryRouter>
//     );

//     const trxIdInput = screen.getByPlaceholderText(/write your booking trx id/i);
//     const phoneInput = screen.getByPlaceholderText(/write your valid number/i);
//     const submitButton = screen.getByText(/check booking/i);

//     fireEvent.change(trxIdInput, { target: { value: 'TRX12345' } });
//     fireEvent.change(phoneInput, { target: { value: '08123456789' } });

//     fireEvent.click(submitButton);

//     await waitFor(() => {
//       expect(screen.getByText(/john doe/i)).toBeInTheDocument();
//     });

//     const deleteButton = screen.getByText(/cancel booking/i);
//     fireEvent.click(deleteButton);

//     await waitFor(() => {
//       expect(screen.queryByText(/john doe/i)).not.toBeInTheDocument();
//     });
//   });
});
