import { render, screen, waitFor } from "@testing-library/react";
import { BrowseCityWraper } from "../../components/BrowsCityWraper";
import axios from "axios";
import { describe, it, expect, vi } from "vitest";
import "@testing-library/jest-dom";
import { MemoryRouter } from "react-router-dom";

vi.mock("axios");

describe("BrowseCityWrapper", () => {
  it("renders loading state intially", () => {
    render(
      <MemoryRouter>
        <BrowseCityWraper />
      </MemoryRouter>
    );
    expect(screen.getByText(/loading.../i)).toBeInTheDocument();
  });

  it("renders error message when API call fails", async () => {
    (axios.get as jest.Mock).mockRejectedValueOnce(new Error("Network Error"));

    render(
      <MemoryRouter>
        <BrowseCityWraper />
      </MemoryRouter>
    );

    await waitFor(() => {
      expect(
        screen.getByText(/Error loading data: network error/i)
      ).toBeInTheDocument();
    });
  });

  it("renders city cards when data is fetched successfully", async () => {
    const cities = [
      {
        id: 1,
        name: "Jakarta",
        slug: "jakarta",
        photo: "jakarta_city.jpg",
        officeSpaces_count: 3,
      },
      {
        id: 2,
        name: "Bandung",
        slug: "bandung",
        photo: "bandung_city.jpg",
        officeSpaces_count: 5,
      },
    ];
    (axios.get as jest.Mock).mockResolvedValue({ data: { data: cities } });

    render(
      <MemoryRouter>
        <BrowseCityWraper />
      </MemoryRouter>
    );

    await waitFor(() => {
      expect(screen.getByText(/you can choose/i)).toBeInTheDocument();
      expect(screen.getByText(/jakarta/i)).toBeInTheDocument();
      expect(screen.getByText(/bandung/i)).toBeInTheDocument();
    });
  });

  it("renders link for each city card", async () => {
    const cities = [
      {
        id: 1,
        name: "Jakarta",
        slug: "jakarta",
        photo: "jakarta_city.jpg",
        officeSpaces_count: 3,
      },
    ];
  });
});
