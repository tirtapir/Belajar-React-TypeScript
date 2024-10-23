import { render, screen, waitFor, fireEvent, getByPlaceholderText } from "@testing-library/react";
import axios from "axios";
import { describe, it, expect, vi, beforeEach } from "vitest";
import "@testing-library/jest-dom";
import { MemoryRouter } from "react-router-dom";
import CheckBooking from "../../pages/CheckBooking";
import { aw } from "vitest/dist/chunks/reporters.C4ZHgdxQ.js";

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
      screen.getByPlaceholderText(/write your booking trx id/i)
    ).toBeInTheDocument();
    expect(
      screen.getByPlaceholderText(/write your valid number/i)
    ).toBeInTheDocument();
  });

  it("handles input changes for booking_trx_id and phone_number", () => {
    render(
      <MemoryRouter>
        <CheckBooking />
      </MemoryRouter>
    );

    const trxIdInput = screen.getByPlaceholderText(
      /write your booking trx id/i
    );
    const phoneInput = screen.getByPlaceholderText(/write your valid number/i);

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

    const SubmitButton = screen.getByRole("button", { name: /check booking/i });

    fireEvent.click(SubmitButton);

    await waitFor(() => {
      expect(
        screen.getByText(/Booking transaction ID is requred/i)
      ).toBeInTheDocument();
      expect(screen.getByText(/Phone number is requred/i)).toBeInTheDocument();
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

    fireEvent.change(screen.getByLabelText(/Booking TRX ID/i), {
      target: { value: "OTRX12345" },
    });
    fireEvent.change(screen.getByLabelText(/Phone Number/i), {
      target: { value: "08123456789" },
    });

    fireEvent.click(screen.getByRole("button", { name: /check booking/i }));

    await waitFor(() => {
      const thumbnailElement = screen.getByAltText(
        "thumbnail"
      ) as HTMLImageElement;
      expect(thumbnailElement).toBeInTheDocument();
      expect(thumbnailElement.src).toContain(`${baseURL}/thumbnail.jpg`);

      const officeNameElement = screen.getByText((content) =>
        content.includes("Test Office")
      );
      expect(officeNameElement).toBeInTheDocument();

      const cityNameElement = screen.getByText((content) =>
        content.includes("Test City")
      );
      expect(cityNameElement).toBeInTheDocument();

      const nameElement = screen.getByText((content) =>
        content.includes("John Doe")
      );
      expect(nameElement).toBeInTheDocument();

      const phoneNumberElement = screen.getByText((content) =>
        content.includes("08123456789")
      );
      expect(phoneNumberElement).toBeInTheDocument();

      const startedAtElement = screen.getByText((content) =>
        content.includes("2023-10-01")
      );
      expect(startedAtElement).toBeInTheDocument();

      const endedAtElement = screen.getByText((content) =>
        content.includes("2023-10-15")
      );
      expect(endedAtElement).toBeInTheDocument();

      const durationElement = screen.getByText((content) =>
        content.includes("7 Days Working")
      );
      expect(durationElement).toBeInTheDocument();

      const totalAmountElement = screen.getByText((content) =>
        content.includes("7.000.000")
      );
      expect(totalAmountElement).toBeInTheDocument();

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

    fireEvent.change(screen.getByLabelText(/Booking TRX ID/i), { target: { value: 'OTRX1234' } });
    fireEvent.change(screen.getByLabelText(/Phone Number/i), { target: { value: '08123456789' } });

    fireEvent.click(screen.getByRole('button', { name: /Check Booking/i }));

    await waitFor(() => {

      let nameElement = screen.getByText((content) =>
        content.includes("John Doe")
      );
      expect(nameElement).toBeInTheDocument();

      fireEvent.click(screen.getByRole('button', { name: /Edit Booking Details/i }));

      fireEvent.click(nameElement);

      const nameInput = screen.getByPlaceholderText(/Write your full name/i);
      fireEvent.change(nameInput, { target: { value: 'Jane Doe' } });
      fireEvent.click(screen.getByRole('button', { name: /Save Changes/i }));
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

    fireEvent.change(screen.getByLabelText(/Booking TRX ID/i), { target: { value: '123456' } });
    fireEvent.change(screen.getByLabelText(/Phone Number/i), { target: { value: '08123456789' } });

    fireEvent.click(screen.getByRole('button', { name: /Check Booking/i }));

    await waitFor(() => {
      const nameElement = screen.getByText((content) =>
        content.includes("John Doe")
        );
      expect(nameElement).toBeInTheDocument();
    });

    fireEvent.click(screen.getByRole('button', { name: /Cancel Booking/i }));

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
