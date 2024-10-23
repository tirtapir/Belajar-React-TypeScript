import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import BookOffice from "../../pages/BookOffice";
import { MemoryRouter, useParams } from "react-router-dom";
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
        const mockOfficeData = {
          data: {
            id: 1,
            name: 'Test Office',
            price: 7000000,
            thumbnail: 'thumbnail.png',
            city: { name: 'Test City' },
            duration: 7,
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

});