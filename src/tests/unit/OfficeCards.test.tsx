import { render, screen } from "@testing-library/react";
import '@testing-library/jest-dom';
import { describe, expect, it } from "vitest";
import OfficeCard from "../../components/OfficeCard";
import { Office } from "../../types/type";


const office: Office = {
    id : 1,
    price : 15000000,
    duration : 30,
    name : 'Nusa Dua Workspace',
    slug : 'nusa-dua-workspace',
    city : {
        id : 1,
        name : 'bali',
        slug : 'bali',
        photo : 'bali_city.jpg',
        officeSpaces_count : 1,
        officeSpaces: []
    },
    thumbnail : "office.jpg",
    photos : [{ id: 1, photo: "photo1.jpg" }],
    benefits : [{ id: 1, name: "Fast-Connection" }, { id: 2, name: "Secure 100%" }],
    about : "This is an awesome office space.",
    address :"1234 Street, Nusa Dua, Bali"
};

describe("OfficeCard Component", () => {
    it("renders office name correctly", () => {
        render (<OfficeCard office={office}></OfficeCard>);
        const officeName = screen.getByText(/Nusa Dua Workspace/i);
        expect(officeName).toBeInTheDocument();
    });

    it("renders office price correctly", () => {
        render(<OfficeCard office={office}></OfficeCard>);
        const officePrice = screen.getByText(/15.000.000/i);
        expect(officePrice).toBeInTheDocument;
    });

    it("renders office duration correctly", () => {
        render(<OfficeCard office={office} />);
        const officeDuration = screen.getByText(/30 days/i);
        expect(officeDuration).toBeInTheDocument();
      });
    
      it("renders office city correctly", () => {
        render(<OfficeCard office={office} />);
        const officeCity = screen.getByText(/bali/i);
        expect(officeCity).toBeInTheDocument();
      });
    
      it("renders office facilities correctly", () => {
        render(<OfficeCard office={office} />);
        const benefits1 = screen.getByText(/Fast-Connection/i);
        const benefits2 = screen.getByText(/Secure 100%/i);
        expect(benefits1).toBeInTheDocument();
        expect(benefits2).toBeInTheDocument();
      });
});