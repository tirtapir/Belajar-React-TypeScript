import { BrowseOfficeWrapper } from "../../components/BrowseOfficeWrapper";
import { render, screen, waitFor } from '@testing-library/react';
import axios from 'axios';
import { describe, it, expect, vi } from 'vitest';
import '@testing-library/jest-dom'; // Import untuk matcher tambahan
import { MemoryRouter } from 'react-router-dom'; // Import MemoryRouter

// Mock axios
vi.mock('axios');

describe('BrowseOfficeWrapper', () => {
  it('renders loading state initially', () => {
    render(
      <MemoryRouter>
        <BrowseOfficeWrapper />
      </MemoryRouter>
    );
    expect(screen.getByText(/loading.../i)).toBeInTheDocument();
  });

  it('renders error message when API call fails', async () => {
    // Simulasi kesalahan jaringan
    (axios.get as jest.Mock).mockRejectedValueOnce(new Error('Network Error'));

    render(
      <MemoryRouter>
        <BrowseOfficeWrapper />
      </MemoryRouter>
    );
    
    await waitFor(() => {
      expect(screen.getByText(/error loading data: network error/i)).toBeInTheDocument();
    });
  });

  it('renders office cards when API call is successful', async () => {
    const officesMock = [
      { id: 1, price: 100, duration: 1, name: 'Office 1', slug: 'office-1', city: {}, thumbnail: '', photos: [], benefits: [], about: '', address: '' },
      { id: 2, price: 200, duration: 2, name: 'Office 2', slug: 'office-2', city: {}, thumbnail: '', photos: [], benefits: [], about: '', address: '' },
    ];
    
    // Simulasi respons sukses
    (axios.get as jest.Mock).mockResolvedValueOnce({ data: { data: officesMock } });

    render(
      <MemoryRouter>
        <BrowseOfficeWrapper />
      </MemoryRouter>
    );
    
    await waitFor(() => {
      expect(screen.getByText(/browse our fresh space/i)).toBeInTheDocument();
      expect(screen.getByText('Office 1')).toBeInTheDocument();
      expect(screen.getByText('Office 2')).toBeInTheDocument();
    });
  });
});