import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import BookOffice from "../../pages/BookOffice";
import { MemoryRouter, useParams } from "react-router-dom";
import { test_ids } from "../../pages/BookOffice";
import axios from 'axios';
import { describe, it, expect, vi, beforeEach } from "vitest";
import '@testing-library/jest-dom';

vi.mock("axios");

const mockOfficeData = {
    id: 1,
    name: "Test Office",
    city: { name: "Test City" },
    price: 1000000,
    duration: 7,
    thumbnail: "thumbnail.jpg",
};

describe('BookOffice Page', () => {
    beforeEach(() => {
        vi.clearAllMocks();
    });;

    it('renders loading state initially', () => {
        render(
          <MemoryRouter>
            <BookOffice />
          </MemoryRouter>
        );
        expect(screen.getByText(/loading.../i)).toBeInTheDocument();
      });
    
      it('fetches office data and displays it correctly', async () => {
        const baseURL = "http://localhost:8000/storage/";
    
        (axios.get as jest.Mock).mockResolvedValueOnce({ data: { data: mockOfficeData.data } });
    
        render(
          <MemoryRouter>
            <BookOffice />
          </MemoryRouter>
        );
    
        await waitFor(() => {
          const thumbnailElement = screen.getByTestId(
            test_ids.thumbnail
          ) as HTMLImageElement;
          expect(thumbnailElement).toBeInTheDocument();
          expect(thumbnailElement.src).toContain(`${baseURL}/thumbnail.jpg`);
          expect(screen.getByText('Test Office')).toBeInTheDocument();
          expect(screen.getByText('Test City')).toBeInTheDocument();
          expect(screen.getByText(/7 Days Working/)).toBeInTheDocument();
        });
      });

      it('displays error message when API request fails', async () => {
        (axios.get as jest.Mock).mockRejectedValueOnce(new Error('Failed to fetch office data'));
    
        render(
          <MemoryRouter>
            <BookOffice />
          </MemoryRouter>
        );
    
        await waitFor(() => {
          expect(screen.getByText(/Error loading data/i)).toBeInTheDocument();
        });
      });


        it('validates form inputs and shows error messages when validation fails', async () => {
        const mockOfficeData = {
          data: {
            id: 1,
            name: 'Test Office',
            price: 100000,
            thumbnail: 'thumbnail.png',
            city: { name: 'Test City' },
            duration: 5,
          },
        };
    
        (axios.get as jest.Mock).mockResolvedValueOnce({ data: { data: mockOfficeData.data } });
    
        render(
          <MemoryRouter>
            <BookOffice />
          </MemoryRouter>
        );
    
        await waitFor(() => {
          expect(screen.getByText('Test Office')).toBeInTheDocument();
        });
    
        fireEvent.click(screen.getByRole('button', { name: /Book This Office Now/i }));
    
        expect(screen.getByText('Name is requred')).toBeInTheDocument();
        expect(screen.getByText('Phone number is requred')).toBeInTheDocument();
        expect(screen.getByText('started_at is requred')).toBeInTheDocument();
      });

    it('submits form data successfully after validation passes', async () => {
        const mockOfficeData = {
          data: {
            id: 1,
            name: 'Test Office',
            price: 100000,
            thumbnail: 'thumbnail.png',
            city: { name: 'Test City' },
            duration: 5,
          },
        };
    
        (axios.get as jest.Mock).mockResolvedValueOnce({ data: { data: mockOfficeData.data } });
    
        (axios.post as jest.Mock).mockResolvedValueOnce({
          data: {
            data: { id: 1, name: 'Test Booking', office_space_id: 1 },
          },
        });
    
        render(
          <MemoryRouter>
            <BookOffice />
          </MemoryRouter>
        );
    
        await waitFor(() => {
          expect(screen.getByText('Test Office')).toBeInTheDocument();
        });
    
        // Fill form inputs
        fireEvent.change(screen.getByPlaceholderText(/Write your complete name/i), {
          target: { value: 'John Doe' },
        });
        fireEvent.change(screen.getByPlaceholderText(/Write your valid number/i), {
          target: { value: '08123456789' },
        });
        fireEvent.change(screen.getByLabelText(/Started At/i), {
          target: { value: '2023-10-01' },
        });
    
        fireEvent.click(screen.getByRole('button', { name: /Book This Office Now/i }));
    
        await waitFor(() => {
          expect((axios.post as jest.Mock)).toHaveBeenCalledWith(
            'http://localhost:8000/api/booking-transaction',
            expect.objectContaining({
              name: 'John Doe',
              phone_number: '08123456789',
              started_at: '2023-10-01',
              office_space_id: 1,
            }),
            { headers: { 'X-API-KEY': 'adkukgi28262eih98209' } }
          );
        });
    
        expect(screen.getByText('Test Office')).toBeInTheDocument();
      });
});