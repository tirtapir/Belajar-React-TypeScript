import { BrowseOfficeWrapper } from "../../components/BrowseOfficeWrapper";
import { render, screen, waitFor, fireEvent } from '@testing-library/react';
import axios from 'axios';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import '@testing-library/jest-dom';
import { MemoryRouter } from 'react-router-dom';

vi.mock('axios');

describe('BrowseOfficeWrapper', () => {
  beforeEach(() => {
    vi.resetAllMocks();
  });

  it('renders loading state initially', () => {
    render(
      <MemoryRouter>
        <BrowseOfficeWrapper />
      </MemoryRouter>
    );
    expect(screen.getByText(/loading.../i)).toBeInTheDocument();
  });

  it('renders error message when API call fails', async () => {
    (axios.get as jest.Mock).mockRejectedValueOnce(new Error('Network Error'));

    render(
      <MemoryRouter>
        <BrowseOfficeWrapper />
      </MemoryRouter>
    );
    
    await waitFor(() => {
      expect(screen.getByText(/error loading data: Network Error/i)).toBeInTheDocument();
    });
  });

  it('renders office cards and pagination when API call is successful', async () => {
    const officesMock = [
      { id: 1, price: 100, duration: 1, name: 'Office 1', slug: 'office-1', city: {}, thumbnail: '', photos: [], benefits: [], about: '', address: '' },
      { id: 2, price: 200, duration: 2, name: 'Office 2', slug: 'office-2', city: {}, thumbnail: '', photos: [], benefits: [], about: '', address: '' },
    ];
    
    (axios.get as jest.Mock).mockResolvedValueOnce({ 
      data: { 
        data: officesMock,
        meta: { last_page: 3 }
      } 
    });

    render(
      <MemoryRouter>
        <BrowseOfficeWrapper />
      </MemoryRouter>
    );
    
    await waitFor(() => {
      expect(screen.getByText(/browse our fresh space/i)).toBeInTheDocument();
      expect(screen.getByText('Office 1')).toBeInTheDocument();
      expect(screen.getByText('Office 2')).toBeInTheDocument();
      expect(screen.getByText('Page 1 of 3')).toBeInTheDocument();
      expect(screen.getByText('Previous')).toBeDisabled();
      expect(screen.getByText('Next')).toBeEnabled();
    });
  });

  it('handles pagination correctly', async () => {
    const page1Mock = [{ id: 1, name: 'Office 1', slug: 'office-1', city: {}, thumbnail: '', photos: [], benefits: [], about: '', address: '', price: 100000, duration: 1 }];
    const page2Mock = [{ id: 2, name: 'Office 2', slug: 'office-2', city: {}, thumbnail: '', photos: [], benefits: [], about: '', address: '', price: 200000, duration: 2 }];

    (axios.get as jest.Mock)
      .mockResolvedValueOnce({ data: { data: page1Mock, meta: { last_page: 2 } } })
      .mockResolvedValueOnce({ data: { data: page2Mock, meta: { last_page: 2 } } });

    render(
      <MemoryRouter>
        <BrowseOfficeWrapper />
      </MemoryRouter>
    );

    await waitFor(() => {
      expect(screen.getByText('Office 1')).toBeInTheDocument();
    });

    fireEvent.click(screen.getByText('Next'));

    await waitFor(() => { expect(screen.getByText('Office 2')).toBeInTheDocument();
      expect(screen.getByText('Page 2 of 2')).toBeInTheDocument();
      expect(screen.getByText('Previous')).toBeEnabled();
      expect(screen.getByText('Next')).toBeDisabled();
    });
  });
});