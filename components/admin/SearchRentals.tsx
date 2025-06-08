"use client";

import { useState } from "react";

type RentalSearchProps = {
  onSearch: (startDate: string, endDate: string) => void;
};

export default function SearchRentals({ onSearch }: RentalSearchProps) {
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!startDate || !endDate) {
      alert("Izberi oba datuma!");
      return;
    }
    if (endDate < startDate) {
      alert("Datum demontaže ne more biti prej kot datum montaže!");
      return;
    }
    onSearch(startDate, endDate);
  };

  return (
    <form onSubmit={handleSubmit} className="max-w-md mx-auto p-4 bg-white rounded shadow">
      <h2 className="text-xl font-semibold mb-4">Izberi datume najema</h2>
      <div className="mb-4">
        <label className="block mb-1 font-medium">Datum montaže:</label>
        <input
          type="date"
          value={startDate}
          onChange={(e) => setStartDate(e.target.value)}
          className="w-full border border-gray-300 rounded px-3 py-2"
          required
        />
      </div>
      <div className="mb-4">
        <label className="block mb-1 font-medium">Datum demontaže:</label>
        <input
          type="date"
          value={endDate}
          onChange={(e) => setEndDate(e.target.value)}
          className="w-full border border-gray-300 rounded px-3 py-2"
          required
        />
      </div>
      <button
        type="submit"
        className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 transition"
      >
        Poišči proste kovčke
      </button>
    </form>
  );
}
