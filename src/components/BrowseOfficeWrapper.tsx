import { useEffect, useState } from "react";
import OfficeCard from "../components/OfficeCard";
import axios from "axios";
import { Office } from "../types/type";
import { Link } from "react-router-dom";

export function BrowseOfficeWrapper() {
  const [offices, setOffices] = useState<Office[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchOffices = async () => {
      try {
        const response = await axios.get("http://localhost:8000/api/offices", {
          headers: {
            "X-API-KEY": "adkukgi28262eih98209",
          },
        });
        setOffices(response.data.data);
      } catch (err) {
        // Menangani kesalahan dengan lebih baik
        setError(err instanceof Error ? err.message : "Unknown error occurred");
      } finally {
        setLoading(false); // Pastikan loading di-set ke false setelah mencoba
      }
    };

    fetchOffices(); // Memanggil fungsi untuk mendapatkan data
  }, []);

  // Menampilkan loading state
  if (loading) {
    return <p>Loading...</p>;
  }

  // Menampilkan pesan kesalahan
  if (error) {
    return <p>Error loading data: {error}</p>;
  }

  // Menampilkan daftar kantor
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
    </section>
  );
}
