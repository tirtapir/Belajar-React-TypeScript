import { render, screen, waitFor } from "@testing-library/react";
import Details from "../../pages/Details";
import "@testing-library/jest-dom";
import axios from "axios";
import { MemoryRouter } from "react-router-dom";
import { vi, describe, it, expect } from "vitest";

vi.mock("axios");

describe("Office Space details page", () => {
  const mockOfficeData = {
    id: 1,
    price: 15000000,
    duration: 30,
    name: "Nusa Dua Workspace",
    slug: "nusa-dua-workspace",
    city: {
      id: 1,
      name: "bali",
      slug: "bali",
      photo: "bali_city.jpg",
      officeSpaces_count: 1,
      officeSpaces: [],
    },
    thumbnail: "office_thumbanail.jpg",
    photos: [
      { id: 1, photo: "photo1.jpg" },
      { id: 2, photo: "photo2.jpg" },
      { id: 3, photo: "photo3.jpg" },
    ],
    benefits: [
      { id: 1, name: "Fast-Connection" },
      { id: 2, name: "Secure 100%" },
      { id: 3, name: "Parking space area" },
    ],
    about: "This is an awesome office space.",
    address: "1234 Street, Nusa Dua, Bali",
  };

  it("display loading state initially", () => {
    render(
      <MemoryRouter
        initialEntries={[`/office/${mockOfficeData.name}`]}
      >
        <Details />
      </MemoryRouter>
    );
    expect(screen.getByText(/loading.../i)).toBeInTheDocument();
  });

  it("renders error message when API call fails", async () => {
    (axios.get as jest.Mock).mockRejectedValue(new Error("Unknown error occurred"));
    render(
      <MemoryRouter
        initialEntries={[`/office/${mockOfficeData.name}`]}
      >
        <Details />
      </MemoryRouter>
    );

    await waitFor(() => {
      expect(
        screen.getByText(/error loading data: unknown error occurred/i)
      ).toBeInTheDocument();
    });
  });

  it('renders "office not found" if there is no office data', async () => {
    (axios.get as jest.Mock).mockResolvedValueOnce({ data: { data: null } });
    render(
      <MemoryRouter initialEntries={[`/office/${mockOfficeData.name}`]}>
        <Details />
      </MemoryRouter>
    );

    await waitFor(() => {
      expect(screen.getByText(/office not found/i)).toBeInTheDocument();
    });
  });

  it("renders office's data when API Call successfully gets data", async () => {
    (axios.get as jest.Mock).mockResolvedValueOnce({
      data: { data: mockOfficeData },
    });
    render(
      <MemoryRouter initialEntries={[`/office/${mockOfficeData.name}`]}>
        <Details />
      </MemoryRouter>
    );
  
    await waitFor(() => {
      const images = screen.getAllByAltText("thumbnail");
        expect(images.length).toBe(mockOfficeData.photos.length);
      mockOfficeData.photos.forEach((photo, index) => {
        expect(images[index]).toHaveAttribute('src', expect.stringContaining(photo.photo));
    });
      expect(screen.getByText(mockOfficeData.name)).toBeInTheDocument();
      expect(screen.getByText(mockOfficeData.city.name)).toBeInTheDocument();
      expect(screen.getByText(mockOfficeData.address)).toBeInTheDocument();
      expect(screen.getByText(mockOfficeData.price.toLocaleString("id"))).toBeInTheDocument();
      mockOfficeData.benefits.forEach((benefit) => {
        expect(screen.getByText(benefit.name)).toBeInTheDocument();
      });
    });
  });
});
