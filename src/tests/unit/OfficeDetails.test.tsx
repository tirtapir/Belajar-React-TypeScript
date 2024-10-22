import { render, screen, waitFor } from "@testing-library/react";
import Details from "../../pages/Details";
import "@testing-library/jest-dom";
import axios from "axios";
import { MemoryRouter } from "react-router-dom";
import { vi, describe, it, expect } from "vitest";

vi.mock("axios");

describe("Office Space details page", () => {

  const mockOfficeData = {
    data: {
      data: {
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
      }
    }
  };

  it("display loading state initially", () => {
    render(
      <MemoryRouter initialEntries={[`/office/${mockOfficeData.data.data.name}`]}>
        <Details />
      </MemoryRouter>
    );
    expect(screen.getByText(/loading.../i)).toBeInTheDocument();
  });

  it("renders error message when API call fails", async () => {
    (axios.get as jest.Mock).mockRejectedValue(new Error("Network Error"));
    render(
      <MemoryRouter initialEntries={[`/office/${mockOfficeData.data.data.name}`]}>
        <Details />
      </MemoryRouter>
    );

    await waitFor(() => {
      expect(
        screen.getByText(/error loading data: network error/i)).toBeInTheDocument();
    });
  });

  it('renders "office not found" if there is no office data', async () => {
    (axios.get as jest.Mock).mockResolvedValueOnce({ data: { data: null } });
    render(
      <MemoryRouter initialEntries={["/office/{nusa-dua-workspace}"]}>
        <Details />
      </MemoryRouter>
    );

    await waitFor(() => {
      expect(screen.getByText(/office not found/i)).toBeInTheDocument();
    });
  });

  // it("renders office's data when API Call successfully gets  data", async () => {
  //   (axios.get as jest.Mock).mockResolvedValueOnce({
  //     data: { data: mockOfficeData },
  //   });
  //   render(
  //   <MemoryRouter initialEntries={[`/office/${mockOfficeData.data.data.name}`]}>
  //       <Details />
  //     </MemoryRouter>
  //   );

  //   await waitFor(() => {
  //     // mockOfficeData.photos.forEach((photo) => {
  //     //   expect(screen.getByText(photo.photo)).toBeInTheDocument();
  //     // });
  //     expect(screen.getByText(mockOfficeData.data.data.name)).toBeInTheDocument();
  //     expect(screen.getByText(mockOfficeData.data.data.city.name)).toBeInTheDocument();
  //     expect(screen.getByText(mockOfficeData.data.data.address)).toBeInTheDocument();
  //     expect(
  //       screen.getByText(mockOfficeData.data.data.price.toLocaleString("id"))
  //     ).toBeInTheDocument();
  //     mockOfficeData.data.data.benefits.forEach((benefit) => {
  //       expect(screen.getByText(benefit.name)).toBeInTheDocument();
  //     });
  //   });
  // });

  // it("renders office's data when API Call successfully gets data", async () => {
  //   (axios.get as jest.Mock).mockResolvedValueOnce(mockOfficeData);
  //   render(
  //     <MemoryRouter initialEntries={[`/office/${mockOfficeData.data.data.name}`]}>
  //       <Details />
  //     </MemoryRouter>
  //   );
  
  //   await waitFor(() => {
  //     // expect(screen.getByText(mockOfficeData.name)).toBeInTheDocument();
  //     expect(screen.getByText(/Nusa Dua Workspace/i)).toBeInTheDocument();
  //   expect(screen.getByText(/Bali/i)).toBeInTheDocument();
  //   expect(screen.getByText(/This is a workspace in Nusa Dua./i)).toBeInTheDocument();
  //   expect(screen.getByText(/1,500,000/i)).toBeInTheDocument(); // Price formatted
  //   });
  // });

});
