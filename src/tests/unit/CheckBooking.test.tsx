import { render, screen, waitFor, fireEvent } from "@testing-library/react";
import axios from "axios";
import { describe, it, expect, vi, beforeEach } from "vitest";
import { test_ids } from "../../pages/CheckBooking";
import "@testing-library/jest-dom";
import { MemoryRouter } from "react-router-dom";
import CheckBooking from "../../pages/CheckBooking";

vi.mock("axios");

describe("CheckBooking Page", () => {
  beforeEach(() => {
    vi.resetAllMocks();
  });

  it("renders input Check Booking fields correctly", () => {
    render(
      <MemoryRouter>
        <CheckBooking />
      </MemoryRouter>
    );

    expect(
      screen.getByTestId(test_ids.trxIdLabel)
    ).toBeInTheDocument();
    expect(
      screen.getByTestId(test_ids.phoneNumberLabel)
    ).toBeInTheDocument();
  });

  it("handles input changes for booking_trx_id and phone_number", () => {
    render(
      <MemoryRouter>
        <CheckBooking />
      </MemoryRouter>
    );

    const trxIdInput = screen.getByTestId(test_ids.trxIdInput);
    const phoneInput = screen.getByTestId(test_ids.phoneInput);

    fireEvent.change(trxIdInput, { target: { value: "OTRX12345" } });
    fireEvent.change(phoneInput, { target: { value: "08123456789" } });

    expect(trxIdInput).toHaveValue("OTRX12345");
    expect(phoneInput).toHaveValue("08123456789");
});

  it("should show error message when validation is fails", async () => {
    render(
      <MemoryRouter>
        <CheckBooking />
      </MemoryRouter>
    );

    const SubmitButton = screen.getByTestId(test_ids.checkBookingButton);

    fireEvent.click(SubmitButton);

    await waitFor(() => {
      expect(screen.getByTestId(test_ids.invalidTrxID)).toBeInTheDocument();
      expect(screen.getByTestId(test_ids.invalidPhoneNumber)).toBeInTheDocument();
    });
  });


  it("should submit forms and fetch booking data details successfully", async () => {
    const baseURL = "http://localhost:8000/storage/";

    (axios.post as jest.Mock).mockResolvedValueOnce({
      data: {
        data: {
          id: 1,
          office: {
            name: "Test Office",
            city: { name: "Test City" },
            thumbnail: "thumbnail.jpg",
          },
          name: "John Doe",
          phone_number: "08123456789",
          started_at: "2023-10-01",
          ended_at: "2023-10-15",
          duration: 7,
          total_amount: 7000000,
          is_paid: 0,
        },
      },
    });

    render(
      <MemoryRouter>
        <CheckBooking />
      </MemoryRouter>
    );

    fireEvent.change(screen.getByTestId(test_ids.trxIdInput), {
      target: { value: "OTRX12345" },
    });
    fireEvent.change(screen.getByTestId(test_ids.phoneInput), {
      target: { value: "08123456789" },
    });

    fireEvent.click(screen.getByTestId(test_ids.checkBookingButton));

    await waitFor(() => {
      const thumbnailElement = screen.getByTestId(
        test_ids.thumbnail
      ) as HTMLImageElement;
      expect(thumbnailElement).toBeInTheDocument();
      expect(thumbnailElement.src).toContain(`${baseURL}/thumbnail.jpg`);

      const officeNameElement = screen.getByTestId(test_ids.officeName);
      expect(officeNameElement).toBeInTheDocument();
      expect(officeNameElement).toHaveTextContent("Test Office");

      const officeCityNameElement = screen.getByTestId(test_ids.cityName);
      expect(officeCityNameElement).toBeInTheDocument();
      expect(officeCityNameElement).toHaveTextContent("Test City");

      const nameElement = screen.getByTestId(test_ids.fullName);
      expect(nameElement).toBeInTheDocument();
      expect(nameElement).toHaveTextContent("John Doe");

      const phoneNumberElement = screen.getByTestId(test_ids.phoneNumber);
      expect(phoneNumberElement).toBeInTheDocument();

      const startedAtElement = screen.getByTestId(test_ids.startedAt);
      expect(startedAtElement).toBeInTheDocument();
      expect(startedAtElement).toHaveTextContent("2023-10-01");

      const endedAtElement = screen.getByTestId(test_ids.endedAt);
      expect(endedAtElement).toBeInTheDocument();
      expect(endedAtElement).toHaveTextContent("2023-10-15");

      const durationElement = screen.getByTestId(test_ids.duration);
      expect(durationElement).toBeInTheDocument();
      expect(durationElement).toHaveTextContent("7 Days Working");
      
      const totalAmountElement = screen.getByTestId(test_ids.totalAmount);
      expect(totalAmountElement).toBeInTheDocument();
      expect(totalAmountElement).toHaveTextContent("7.000.000");

      const isPaidElement = screen.getByTestId(test_ids.isPaid);
      expect(isPaidElement).toBeInTheDocument();
      expect(isPaidElement).toHaveTextContent("PENDING");

    });
  });

  it('should handle editing booking details', async () => {
    (axios.post as jest.Mock).mockResolvedValueOnce({
      data: {
        data: {
          id: 1,
          office: {
            name: "Test Office",
            city: { name: "Test City" },
            thumbnail: "thumbnail.jpg",
          },
          name: "John Doe",
          phone_number: "08123456789",
          started_at: "2023-10-01",
          ended_at: "2023-10-15",
          duration: 7,
          total_amount: 7000000,
          is_paid: 0,
        },
      },
    });

    render(
      <MemoryRouter>
        <CheckBooking />
      </MemoryRouter>
    );

    fireEvent.change(screen.getByTestId(test_ids.trxIdInput), {
      target: { value: "OTRX12345" },
    });
    fireEvent.change(screen.getByTestId(test_ids.phoneInput), {
      target: { value: "08123456789" },
    });

    fireEvent.click(screen.getByTestId(test_ids.checkBookingButton));

    await waitFor(() => {

      const nameElement = screen.getByTestId(test_ids.fullName);
      expect(nameElement).toBeInTheDocument();
      expect(nameElement).toHaveTextContent("John Doe");

      fireEvent.click(screen.getByTestId(test_ids.editButton));

      fireEvent.click(nameElement);

      const nameInput = screen.getByTestId(test_ids.nameInput);
      fireEvent.change(nameInput, { target: { value: 'Jane Doe' } });
      fireEvent.click(screen.getByTestId(test_ids.saveButton));
    });

    await waitFor(() => {
      expect((axios.patch as jest.Mock)).toHaveBeenCalledWith(
        'http://localhost:8000/api/update-booking/1',
        expect.objectContaining({
          name: 'Jane Doe',
        }),
        { headers: { 'X-API-KEY': 'adkukgi28262eih98209' } }
        );
    });

  });

  it('should handle deleting booking details', async () => {
    (axios.post as jest.Mock).mockResolvedValueOnce({
      data: {
        data: {
          id: 1,
          office: {
            name: "Test Office",
            city: { name: "Test City" },
            thumbnail: "thumbnail.jpg",
          },
          name: "John Doe",
          phone_number: "08123456789",
          started_at: "2023-10-01",
          ended_at: "2023-10-15",
          duration: 7,
          total_amount: 7000000,
          is_paid: 0,
        },
      },
    });

    window.confirm = vi.fn(() => true);

    render(
      <MemoryRouter>
        <CheckBooking />
      </MemoryRouter>
    );

    fireEvent.change(screen.getByTestId(test_ids.trxIdInput), {
      target: { value: "OTRX12345" },
    });
    fireEvent.change(screen.getByTestId(test_ids.phoneInput), {
      target: { value: "08123456789" },
    });

    fireEvent.click(screen.getByTestId(test_ids.checkBookingButton));

    await waitFor(() => {
      const nameElement = screen.getByTestId(test_ids.fullName);
      expect(nameElement).toBeInTheDocument();
      expect(nameElement).toHaveTextContent("John Doe");
    });

    fireEvent.click(screen.getByTestId(test_ids.cancelButton));

    (axios.delete as jest.Mock).mockResolvedValueOnce({});

    await waitFor(() => {
      expect(window.confirm).toHaveBeenCalled();
      expect((axios.delete as jest.Mock)).toHaveBeenCalledWith(
        'http://localhost:8000/api/cancel-booking/1',
        { headers: { 'X-API-KEY': 'adkukgi28262eih98209' } }
      );
    });

  });

});
