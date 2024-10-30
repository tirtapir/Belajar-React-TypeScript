import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import BookOffice from "../../pages/BookOffice";
import { MemoryRouter, useParams } from "react-router-dom";
import { test_ids } from "../../pages/BookOffice";
import axios from 'axios';
import { describe, it, expect, vi, beforeEach } from "vitest";
import '@testing-library/jest-dom';

vi.mock("axios");

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

const baseURL = "http://localhost:8000/storage";

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
        const loadingState = (screen.getByTestId(test_ids.loadingState));
        expect(loadingState).toBeInTheDocument();
        expect(loadingState).toHaveTextContent('Loading...');
      });
    
      it('fetches office data and displays it correctly', async () => {
    
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
          expect(thumbnailElement.src).toContain(`${baseURL}/thumbnail.png`);

          expect(screen.getByTestId(test_ids.officeName)).toHaveTextContent('Test Office');
          expect(screen.getByTestId(test_ids.cityName)).toHaveTextContent('Test City');
          
          expect(screen.getByTestId(test_ids.duration)).toHaveTextContent('7 Days Working');
        });
      });

      it('handles input changes for form inputs correctly', async () => {
        
        (axios.get as jest.Mock).mockResolvedValueOnce({ data: { data: mockOfficeData.data } });
        
        render(
          <MemoryRouter>
            <BookOffice />
          </MemoryRouter>
        );

          const  nameInput = await screen.findByTestId(test_ids.nameInput);
          const  phoneInput = await screen.findByTestId(test_ids.phoneInput);
          const  startedAtInput = await screen.findByTestId(test_ids.dateInput);

          fireEvent.change(nameInput, { target: { value: 'John Doe' }});
          fireEvent.change(phoneInput, { target: { value: '08123456789' }});
          fireEvent.change(startedAtInput, { target: { value: '2023-10-01' }});

          expect(nameInput).toHaveValue('John Doe');
          expect(phoneInput).toHaveValue('08123456789');
          expect(startedAtInput).toHaveValue('2023-10-01');
      });

      it('displays error message when API request fails', async () => {
        (axios.get as jest.Mock).mockRejectedValueOnce(new Error('Failed to fetch office data'));
    
        render(
          <MemoryRouter>
            <BookOffice />
          </MemoryRouter>
        );
    
        await waitFor(() => {
          const errorLoadingState = screen.getByTestId(test_ids.errorLoading);
          expect(errorLoadingState).toBeInTheDocument();
          expect(errorLoadingState).toHaveTextContent('Error loading data');
        });
      });

        it('validates form inputs and shows error messages when validation fails', async () => {
    
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
          expect(thumbnailElement.src).toContain(`${baseURL}/thumbnail.png`);

          expect(screen.getByTestId(test_ids.officeName)).toHaveTextContent('Test Office');
          expect(screen.getByTestId(test_ids.cityName)).toHaveTextContent('Test City');
          
          expect(screen.getByTestId(test_ids.duration)).toHaveTextContent('7 Days Working');
        });
    
        fireEvent.click(screen.getByTestId(test_ids.bookButton));
        
        const nameElement = screen.getByTestId(test_ids.nameRequired);
        expect(nameElement).toBeInTheDocument();
        expect(nameElement).toHaveTextContent("Name is required");

        const phoneElement = screen.getByTestId(test_ids.phoneNumberRequired);
        expect(phoneElement).toBeInTheDocument();
        expect(phoneElement).toHaveTextContent("Phone number is required");

        const dateElement = screen.getByTestId(test_ids.dateRequired);
        expect(dateElement).toBeInTheDocument();
        expect(dateElement).toHaveTextContent("Date to book is required");
      });

    it('submits form data successfully after validation passes', async () => {
    
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
          expect(screen.getByTestId(test_ids.officeName)).toBeInTheDocument();
        });
    
        const  nameInput = await screen.findByTestId(test_ids.nameInput);
        const  phoneInput = await screen.findByTestId(test_ids.phoneInput);
        const  startedAtInput = await screen.findByTestId(test_ids.dateInput);

        fireEvent.change(nameInput, { target: { value: 'John Doe' }});
        fireEvent.change(phoneInput, { target: { value: '08123456789' }});
        fireEvent.change(startedAtInput, { target: { value: '2023-10-01' }});

    
        fireEvent.click(screen.getByTestId(test_ids.bookButton));
    
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
      });
});