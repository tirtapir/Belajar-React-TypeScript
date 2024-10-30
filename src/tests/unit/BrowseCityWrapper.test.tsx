import { render, screen, waitFor } from "@testing-library/react";
import { BrowseCityWraper } from "../../components/BrowsCityWraper";
import axios from "axios";
import { describe, it, expect, vi } from "vitest";
import "@testing-library/jest-dom";
import { MemoryRouter } from "react-router-dom";
import { test_ids } from "../../components/BrowsCityWraper";
import { test_ids as cityCard_test_id } from "../../components/CityCard";

vi.mock("axios");

const mockCities = [
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

const baseURL = "http://localhost:8000/storage";

describe("BrowseCityWrapper", () => {
  it("renders loading state intially", () => {
    render(
      <MemoryRouter>
        <BrowseCityWraper />
      </MemoryRouter>
    );

    const loadingText = screen.getByTestId(test_ids.loading);
    expect(loadingText).toBeInTheDocument();
    expect(loadingText).toHaveTextContent("Loading...");
  });

  it("renders error message when API call fails", async () => {
    (axios.get as jest.Mock).mockRejectedValueOnce(new Error("Network Error"));

    render(
      <MemoryRouter>
        <BrowseCityWraper />
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

  it("renders city cards when data is fetched successfully and linking", async () => {
    (axios.get as jest.Mock).mockResolvedValue({ data: { data: mockCities } });

    render(
      <MemoryRouter>
        <BrowseCityWraper />
      </MemoryRouter>
    );

    await waitFor(() => {
      const cityPhoto = screen.getAllByTestId(cityCard_test_id.cityPhoto);
      const cityName = screen.getAllByTestId(cityCard_test_id.cityName);
      const cityOfficeCount = screen.getAllByTestId(
        cityCard_test_id.cityOfficeCount
      );

      mockCities.forEach((city, index) => {
        expect(cityPhoto[index]).toHaveAttribute(
          "src",
          `${baseURL}/${city.photo}`
        );
        expect(cityName[index]).toHaveTextContent(city.name);
        expect(cityOfficeCount[index]).toHaveTextContent(
          `${city.officeSpaces_count} Offices`
        );
      });
    });
  });

  it("renders link for each city card", async () => {
    (axios.get as jest.Mock).mockResolvedValue({ data: { data: mockCities } });

    render(
      <MemoryRouter>
        <BrowseCityWraper />
      </MemoryRouter>
    );

    await waitFor(() => {
      const onClickCity = screen.getAllByTestId(test_ids.onClickCity);
      mockCities.forEach((city, index) => {
        expect(onClickCity[index]).toHaveAttribute(
          "href",
          `/city/${city.slug}`
        );
      });
    });
  });
});
