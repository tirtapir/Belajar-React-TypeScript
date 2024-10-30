import { render, screen, waitFor } from "@testing-library/react";
import Details from "../../pages/Details";
import "@testing-library/jest-dom";
import axios from "axios";
import { MemoryRouter } from "react-router-dom";
import { vi, describe, it, expect } from "vitest";
import { test_ids } from "../../pages/Details";

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
      <MemoryRouter initialEntries={[`/office/${mockOfficeData.name}`]}>
        <Details />
      </MemoryRouter>
    );
    expect(screen.getByTestId(test_ids.loadingState)).toBeInTheDocument();
  });

  it("renders error message when API call fails", async () => {
    (axios.get as jest.Mock).mockRejectedValue(
      new Error("Unknown error occurred")
    );
    render(
      <MemoryRouter initialEntries={[`/office/${mockOfficeData.name}`]}>
        <Details />
      </MemoryRouter>
    );

    await waitFor(() => {
      const errorLoadingState = screen.getByTestId(test_ids.errorLoadingState);
      expect(errorLoadingState).toBeInTheDocument();
      expect(errorLoadingState).toHaveTextContent(
        "Error loading data: Unknown error occurred"
      );
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
      expect(screen.getByTestId(test_ids.dataNotFound)).toBeInTheDocument();
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
      const photos = screen.getAllByTestId(test_ids.photo);
      expect(photos.length).toBe(mockOfficeData.photos.length);
      mockOfficeData.photos.forEach((photo, index) => {
        expect(photos[index]).toHaveAttribute(
          "src",
          expect.stringContaining(photo.photo)
          );
      });

      const officeName = screen.getByTestId(test_ids.officeName);
      expect(officeName).toHaveTextContent(mockOfficeData.name);

      const cityName = screen.getByTestId(test_ids.cityName);
      expect(cityName).toHaveTextContent(mockOfficeData.city.name);

      const about = screen.getByTestId(test_ids.about);
      expect(about).toHaveTextContent(mockOfficeData.about);

      const address = screen.getByTestId(test_ids.address);
      expect(address).toHaveTextContent(mockOfficeData.address);

      const price = screen.getByTestId(test_ids.price);
      expect(price).toHaveTextContent(mockOfficeData.price.toLocaleString("id"));

      const benefits = screen.getAllByTestId(test_ids.benefits);
      expect(benefits.length).toBe(mockOfficeData.benefits.length);
      mockOfficeData.benefits.forEach((benefit, index) => {
        expect(benefits[index]).toHaveTextContent(benefit.name);
      })      
    });
    
  });
});
