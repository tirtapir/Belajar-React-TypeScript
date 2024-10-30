import { BrowseOfficeWrapper } from "../../components/BrowseOfficeWrapper";
import { render, screen, waitFor, fireEvent } from '@testing-library/react';
import axios from 'axios';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import '@testing-library/jest-dom';
import { MemoryRouter } from 'react-router-dom';
import { test_ids } from '../../components/BrowseOfficeWrapper';
import { test_ids as officeCard_test_id } from '../../components/OfficeCard';
import { a } from "vitest/dist/chunks/suite.BMWOKiTe.js";
import { aw } from "vitest/dist/chunks/reporters.C4ZHgdxQ.js";

vi.mock('axios');

describe('BrowseOfficeWrapper', () => {

  const mockOfficesPage1 = [
    { id: 1, price: 100, duration: 1, name: 'Office 1', slug: 'office-1', city: { name: 'City 1' }, thumbnail: 'office1.jpg' },
    { id: 2, price: 200, duration: 2, name: 'Office 2', slug: 'office-2', city: { name: 'City 2' }, thumbnail: 'office2.jpg' },
    { id: 3, price: 300, duration: 3, name: 'Office 3', slug: 'office-3', city: { name: 'City 3' }, thumbnail: 'office3.jpg' },
    { id: 4, price: 400, duration: 4, name: 'Office 4', slug: 'office-4', city: { name: 'City 4' }, thumbnail: 'office4.jpg' },
    { id: 5, price: 500, duration: 5, name: 'Office 5', slug: 'office-5', city: { name: 'City 5' }, thumbnail: 'office5.jpg' },
    { id: 6, price: 600, duration: 6, name: 'Office 6', slug: 'office-6', city: { name: 'City 6' }, thumbnail: 'office6.jpg' },
  ];
  const mockOfficesPage2 = [    
    { id: 7, price: 700, duration: 7, name: 'Office 7', slug: 'office-7', city: { name: 'City 7' }, thumbnail: 'office7.jpg' },
    { id: 8, price: 800, duration: 8, name: 'Office 8', slug: 'office-8', city: { name: 'City 8' }, thumbnail: 'office8.jpg' },
    { id: 9, price: 900, duration: 9, name: 'Office 9', slug: 'office-9', city: { name: 'City 9' }, thumbnail: 'office9.jpg' },
    { id: 10, price: 1000, duration: 10, name: 'Office 10', slug: 'office-10', city: { name: 'City 10' }, thumbnail: 'office10.jpg' },
  ];

  beforeEach(() => {
    vi.resetAllMocks();
  });

  it('renders loading state initially', () => {
    render(
      <MemoryRouter>
        <BrowseOfficeWrapper />
      </MemoryRouter>
    );

    const loadingText = screen.getByTestId(test_ids.loading);
    expect(loadingText).toBeInTheDocument();
    expect(loadingText).toHaveTextContent("Loading...");
  });

  it('renders error message when API call fails', async () => {
    (axios.get as jest.Mock).mockRejectedValueOnce(new Error('Network Error'));

    render(
      <MemoryRouter>
        <BrowseOfficeWrapper />
      </MemoryRouter>
    );
    
    await waitFor(() => {
      const errorLoadingData = screen.getByTestId(test_ids.error);
      expect(errorLoadingData).toBeInTheDocument();
      expect(errorLoadingData).toHaveTextContent(
        "Error loading data: Network Error"
      );
    });
  });

  it('renders only 6 office cards per pagination pagination when API call is successful', async () => {
    
    (axios.get as jest.Mock).mockResolvedValueOnce({ 
      data: { 
        data: mockOfficesPage1,
        meta: { last_page: 2 }
      } 
    });

    render(
      <MemoryRouter>
        <BrowseOfficeWrapper />
      </MemoryRouter>
    );
    
    await waitFor(() => {
      expect(screen.queryByTestId(test_ids.loading)).not.toBeInTheDocument();
      
      const officeCards = screen.getAllByTestId(officeCard_test_id.officeCard);
      expect(officeCards.length).toBe(6);

      expect(officeCards[0]).toHaveTextContent('Office 1');
      expect(officeCards[1]).toHaveTextContent('Office 2');
      expect(officeCards[2]).toHaveTextContent('Office 3');
      expect(officeCards[3]).toHaveTextContent('Office 4');
      expect(officeCards[4]).toHaveTextContent('Office 5');
      expect(officeCards[5]).toHaveTextContent('Office 6');

      expect(screen.getByText('Page 1 of 2')).toBeInTheDocument();

      expect(screen.getByTestId(test_ids.prevButton)).toBeDisabled();
      expect(screen.getByTestId(test_ids.nextButton)).toBeEnabled();
    });
  });

  it('navigates to the next page and renders the next set of office cards', async () => {
    (axios.get as jest.Mock)
    .mockResolvedValueOnce({
      data: {
        data: mockOfficesPage1,
        meta: { last_page: 2 }
      }
    });
    (axios.get as jest.Mock)
    .mockResolvedValueOnce({ 
      data: { 
        data: mockOfficesPage2,
        meta: { last_page: 2 }
      } 
    });

    render(
      <MemoryRouter>
        <BrowseOfficeWrapper />
      </MemoryRouter>
    )

    await waitFor(() => {
      expect(screen.queryByTestId(test_ids.loading)).not.toBeInTheDocument();
    });

    fireEvent.click(screen.getByTestId(test_ids.nextButton));

    await waitFor(() => {
      const officeCards = screen.getAllByTestId(officeCard_test_id.officeCard);
      expect(officeCards.length).toBe(4);

      expect(officeCards[0]).toHaveTextContent('Office 7');
      expect(officeCards[1]).toHaveTextContent('Office 8');
      expect(officeCards[2]).toHaveTextContent('Office 9');
      expect(officeCards[3]).toHaveTextContent('Office 10');

      expect(screen.getByText('Page 2 of 2')).toBeInTheDocument();

      expect(screen.getByTestId(test_ids.prevButton)).toBeEnabled();
      expect(screen.getByTestId(test_ids.nextButton)).toBeDisabled();
    });

  });

});