import { useEffect, useState } from "react";
import OfficeCard from "../components/OfficeCard";
import axios from "axios";
import { Office } from "../types/type";
import { Link } from "react-router-dom";

export function BrowseOfficeWrapper() {
  const [offices, setOffices] = useState<Office[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPage, setTotalPage]  = useState(0);

  useEffect(() => {
    console.log("Current Page:", currentPage);
    const fetchOffices = async () => {
      try {
        const response = await axios.get(`http://localhost:8000/api/offices?page=${currentPage}`, {
          headers: {
            "X-API-KEY": "adkukgi28262eih98209",
          },
        });
        setOffices(response.data.data);
        setTotalPage(response.data.meta.last_page);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Unknown error occurred");
      } finally {
        setLoading(false);
      }
    };

    fetchOffices();
  }, [currentPage]);

  const handleNextpage = () => {
    if (currentPage < totalPage) {
      setCurrentPage(currentPage + 1);
    }
  }; 

  const handlePrevPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  if (loading) {
    return <p>Loading...</p>;
  }

  if (error) {
    return <p>Error loading data: {error}</p>;
  }

  return (
    <section
      id="Fresh-Space"
      className="flex flex-col gap-[30px] w-full max-w-[1130px] mx-auto mt-[100px] mb-[120px]"
    >
      <h2 className="font-bold text-[32px] leading-[48px] text-nowrap text-center">
        Browse Our Fresh Space.
        <br />
        For Your Better Productivity.
      </h2>
      <div className="grid grid-cols-3 gap-[30px]">
        {offices.map((office) => (
          <Link key={office.id} to={`/office/${office.slug}`}>
            <OfficeCard office={office} />
          </Link>
        ))}
      </div>

      <div className="flex justify-center mt-4">
          <button
          onClick={handlePrevPage} 
          disabled={currentPage === 1}
          className="px-4 py-2 mr-2 bg-green-500 text-black rounded disabled:bg-gray-300 disabled:text-gray-500"
          > Previous
          </button>
          <span className="mx-4">
          Page {currentPage} of {totalPage}
        </span>
      </div>

      <button 
          onClick={handleNextpage} 
          disabled={currentPage === totalPage}
          className="px-4 py-2 mr-2 bg-green-500 text-black rounded disabled:bg-gray-300 disabled:text-gray-500"
        >
          Next
        </button>
    </section>
  );
}
