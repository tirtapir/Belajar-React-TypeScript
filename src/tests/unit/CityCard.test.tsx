import { render, screen } from "@testing-library/react";
import "@testing-library/jest-dom";
import { describe, expect, it } from "vitest";
import CityCard from "../../components/CityCard";
import { City } from "../../types/type";
import { MemoryRouter } from "react-router-dom";

const city: City = {
  id: 1,
  name: "Jakarta",
  slug: "jakarta",
  photo: "jakarta_city.jpg",
  officeSpaces_count: 3,
  officeSpaces: [],
};

describe("CityCard Component", () => {
  it("renders city name", () => {
    render(
      <MemoryRouter>
        <CityCard city={city} />
      </MemoryRouter>
    );
    const cityName = screen.getByText(/jakarta/i);
    expect(cityName).toBeInTheDocument();
  });

  it("renders offices count in the city", () => {
    render(
      <MemoryRouter>
        <CityCard city={city} />
      </MemoryRouter>
    );
    const officesCount = screen.getByText(/3 Offices/i);
    expect(officesCount).toBeInTheDocument();
  });

  it("renders city photo with correct src and alt attributes", () => {
    render(
      <MemoryRouter>
        <CityCard city={city} />
      </MemoryRouter>
    );
    const cityPhoto = screen.getByAltText(/thumbnails/i);
    expect(cityPhoto).toBeInTheDocument();
    expect(cityPhoto).toHaveAttribute(
      "src",
      `http://localhost:8000/storage/${city.photo}`
    );
  });

  it("has the correct class names for layout", () => {
    render(
      <MemoryRouter>
        <CityCard city={city} />
      </MemoryRouter>
    );
    const cardElement = screen
      .getByRole("img", { name: /thumbnails/i })
      .closest("div");
    expect(cardElement).toHaveClass(
      "relative flex shrink-0 w-[230px] h-[300px] rounded-[20px] overflow-hidden"
    );
  });
});
