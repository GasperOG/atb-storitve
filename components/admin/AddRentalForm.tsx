"use client";

import React, { useState, useEffect } from "react";
import { setDoc, doc } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { Rental, Kovcek } from "@/lib/types";
import { checkIfAvailable } from "@/lib/rentals";

type Props = {
  kovcki: Kovcek[]; // že filtrirani kovčki glede na datum
  rentals: Rental[];
  setRentals: React.Dispatch<React.SetStateAction<Rental[]>>;
};

export default function AddRentalForm({ kovcki, rentals, setRentals }: Props) {

  const [formData, setFormData] = useState<Rental & {
    hasOwnKovcek: boolean;
    hasOwnNosilci: boolean;
    thuleKit: string;
    thuleNoge: string;
    thulePalice: string;
    keyNumber: string;
    address: string;
    phone: string;
  }>({
    id: "",
    customer: "",
    itemId: "",
    startDate: "",
    endDate: "",
    hasOwnKovcek: false,
    hasOwnNosilci: false,
    thuleKit: "",
    thuleNoge: "",
    thulePalice: "",
    keyNumber: "",
    address: "",
    phone: "",
  });

  const [availableKovcki, setAvailableKovcki] = useState<Kovcek[]>([]);
  const [modalData, setModalData] = useState<{ endDate: string; customer: string } | null>(null);
  const [successModal, setSuccessModal] = useState<boolean>(false);

  useEffect(() => {
    // Če uporabnik še ni izbral obeh datumov ali ima svoj kovček, prikaži vse kovčke brez async klicev
    if (formData.hasOwnKovcek || !formData.startDate || !formData.endDate) {
      setAvailableKovcki(formData.hasOwnKovcek ? [] : kovcki);
      if (!formData.hasOwnKovcek) {
        setFormData((fd) => ({ ...fd, itemId: "" }));
      }
      return;
    }
    // Ko sta oba datuma izbrana in nima svojega kovčka, filtriraj lokalno glede na rentals
    const filtered: Kovcek[] = kovcki.filter((kovcek) => {
      // Poišči vse najeme za ta kovček
      const najemiZaKovcek = rentals.filter((r) => r.itemId === kovcek.id);
      // Preveri, če se kateri najem prekriva z izbranimi datumi
      const zaseden = najemiZaKovcek.some((r) => {
        return !(
          formData.endDate < r.startDate || formData.startDate > r.endDate
        );
      });
      return !zaseden;
    });
    setAvailableKovcki(filtered);
  }, [formData.startDate, formData.endDate, formData.hasOwnKovcek, kovcki, rentals]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const target = e.target as HTMLInputElement | HTMLSelectElement;
    const { name, value, type } = target;
    const checked = (target as HTMLInputElement).checked;

    if (name === "hasOwnNosilci") {
      if (checked) {
        setFormData((prev) => ({
          ...prev,
          hasOwnNosilci: true,
          thuleKit: "",
          thuleNoge: "",
          thulePalice: "",
          keyNumber: "",
        }));
      } else {
        setFormData((prev) => ({
          ...prev,
          hasOwnNosilci: false,
        }));
      }
      return;
    }

    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const formatDate = (dateString: string) => {
    const d = new Date(dateString);
    return d.toLocaleDateString("sl-SI");
  };

  const areAllEquipmentFieldsFilled = () => {
    return (
      formData.thuleKit.trim() !== "" &&
      formData.thuleNoge.trim() !== "" &&
      formData.thulePalice.trim() !== "" &&
      formData.keyNumber.trim() !== ""
    );
  };

  // Tu je ključna sprememba: pokaže osebne podatke samo, če je izpolnjen kovček (ali ima svojega)
  // in so izpolnjeni nosilci ali ima svoje nosilce
  const showPersonalInfoFields =
    (formData.hasOwnKovcek || formData.itemId) &&
    (formData.hasOwnNosilci || areAllEquipmentFieldsFilled());

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.hasOwnKovcek && !formData.itemId) {
      alert("Prosim izberi kovček ali označi, da ima stranka svoj kovček.");
      return;
    }

    if (!formData.hasOwnNosilci && !areAllEquipmentFieldsFilled()) {
      alert("Prosim izpolni vsa polja za Thule Kit, Noge, Palice in Številko ključa ali označi, da ima stranka svoje nosilce.");
      return;
    }

    if (formData.customer.trim() === "" || formData.address.trim() === "" || formData.phone.trim() === "") {
      alert("Prosim izpolni ime, naslov in telefonsko številko.");
      return;
    }

    if (!formData.hasOwnKovcek) {
      const result = await checkIfAvailable(formData.itemId, formData.startDate, formData.endDate);
      if (result.zaseden) {
        const { najem } = result;
        setModalData({
          endDate: najem?.endDate || "",
          customer: najem?.customer || "Nepoznano",
        });
        return;
      }
    }

    const maxId = rentals.reduce((max, r) => {
      const idNum = parseInt(r.id || "0");
      return !isNaN(idNum) && idNum > max ? idNum : max;
    }, 0);
    const newId = (maxId + 1).toString();

    const newRentalWithId = {
      ...formData,
      id: newId,
    };

    await setDoc(doc(db, "rentals", newId), newRentalWithId);

    setRentals([...rentals, newRentalWithId]);

    setSuccessModal(true);
    setFormData({
      id: "",
      customer: "",
      itemId: "",
      startDate: "",
      endDate: "",
      hasOwnKovcek: false,
      hasOwnNosilci: false,
      thuleKit: "",
      thuleNoge: "",
      thulePalice: "",
      keyNumber: "",
      address: "",
      phone: "",
    });
    setAvailableKovcki([]);
  };

  return (
    <>
      <form
        onSubmit={handleSubmit}
        className="bg-white p-8 rounded-2xl shadow-lg max-w-lg mx-auto space-y-5"
      >
        <p className="text-2xl font-semibold text-gray-900 mb-6 border-b border-blue-300 pb-2">
          Datum montaže in demontaže
        </p>

        {/* Datumi */}
        <input
          className="w-full border border-gray-300 rounded-md px-4 py-3 text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent transition"
          type="date"
          name="startDate"
          value={formData.startDate}
          onChange={handleChange}
          required
        />
        <input
          className="w-full border border-gray-300 rounded-md px-4 py-3 text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent transition"
          type="date"
          name="endDate"
          value={formData.endDate}
          onChange={handleChange}
          required
        />

        {/* Checkbox: ima svoj kovček */}
        {formData.startDate && formData.endDate && (
          <label className="inline-flex items-center space-x-2 text-gray-900 font-medium">
            <input
              type="checkbox"
              name="hasOwnKovcek"
              checked={formData.hasOwnKovcek}
              onChange={handleChange}
              className="rounded border-gray-300 text-blue-600 focus:ring-blue-400"
            />
            <span>Stranka ima svoj kovček</span>
          </label>
        )}

        {/* Select kovček, če nima svojega */}
        {!formData.hasOwnKovcek && formData.startDate && formData.endDate && (
          <select
            className="w-full border border-gray-300 rounded-md px-4 py-3 text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent transition"
            name="itemId"
            value={formData.itemId}
            onChange={handleChange}
            required
          >
            <option value="">-- Izberi kovček --</option>
            {availableKovcki.map((k) => (
              <option key={k.id} value={k.id}>
                {k.name} ({k.desc})
              </option>
            ))}
          </select>
        )}

        {/* Checkbox in polja za nosilce */}
        {(formData.hasOwnKovcek || formData.itemId) && (
          <>
            <label className="inline-flex items-center space-x-2 mt-4 mb-2 text-gray-900 font-medium">
              <input
                type="checkbox"
                name="hasOwnNosilci"
                checked={formData.hasOwnNosilci}
                onChange={handleChange}
                className="rounded border-gray-300 text-blue-600 focus:ring-blue-400"
              />
              <span>Stranka ima svoje nosilce</span>
            </label>

            {!formData.hasOwnNosilci && (
              <>
                <input
                  className="w-full border border-gray-300 rounded-md px-4 py-3 text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent transition mt-2"
                  type="text"
                  name="thuleKit"
                  placeholder="Thule Kit"
                  value={formData.thuleKit}
                  onChange={handleChange}
                  required={!formData.hasOwnNosilci}
                />
                <input
                  className="w-full border border-gray-300 rounded-md px-4 py-3 text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent transition mt-2"
                  type="text"
                  name="thuleNoge"
                  placeholder="Thule Noge"
                  value={formData.thuleNoge}
                  onChange={handleChange}
                  required={!formData.hasOwnNosilci}
                />
                <input
                  className="w-full border border-gray-300 rounded-md px-4 py-3 text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent transition mt-2"
                  type="text"
                  name="thulePalice"
                  placeholder="Thule Palice"
                  value={formData.thulePalice}
                  onChange={handleChange}
                  required={!formData.hasOwnNosilci}
                />
                <input
                  className="w-full border border-gray-300 rounded-md px-4 py-3 text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent transition mt-2"
                  type="text"
                  name="keyNumber"
                  placeholder="Številka ključa"
                  value={formData.keyNumber}
                  onChange={handleChange}
                  required={!formData.hasOwnNosilci}
                />
              </>
            )}
          </>
        )}

        {/* Osebni podatki - prikažejo se samo, če so izpolnjeni kovček in nosilci */}
        {showPersonalInfoFields && (
          <>
            <input
              className="w-full border border-gray-300 rounded-md px-4 py-3 text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent transition"
              type="text"
              name="customer"
              placeholder="Ime stranke"
              value={formData.customer}
              onChange={handleChange}
              required
            />
            <input
              className="w-full border border-gray-300 rounded-md px-4 py-3 text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent transition"
              type="text"
              name="address"
              placeholder="Naslov"
              value={formData.address}
              onChange={handleChange}
              required
            />
            <input
              className="w-full border border-gray-300 rounded-md px-4 py-3 text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent transition"
              type="tel"
              name="phone"
              placeholder="Telefon"
              value={formData.phone}
              onChange={handleChange}
              required
            />
          </>
        )}

        {/* Gumb za nazaj v admin */}
        <button
          type="submit"
          className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 rounded-lg shadow-md transition"
        >
          Dodaj najem
        </button>

        
      </form>

      {/* Modal za zaseden kovček */}
      {modalData && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center p-4">
          <div className="bg-white p-6 rounded-xl max-w-sm shadow-lg">
            <h3 className="text-xl font-semibold mb-4 text-gray-900">Kovček je že zaseden</h3>
            <p className="mb-2 text-gray-700">
              Kovček je zaseden do <strong>{formatDate(modalData.endDate)}</strong> s strani <strong>{modalData.customer}</strong>.
            </p>
            <button
              onClick={() => setModalData(null)}
              className="mt-4 w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 rounded-md transition"
            >
              Zapri
            </button>
          </div>
        </div>
      )}

      {/* Modal za uspešno dodan najem */}
      {successModal && (
        <div className="fixed inset-0 backdrop-blur-lg bg-opacity-40 flex items-center justify-center p-4">
          <div className="bg-white p-6 rounded-xl max-w-sm shadow-lg text-center">
            <h3 className="text-xl font-semibold mb-4 text-green-700">Uspešno dodan najem!</h3>
            <button
              onClick={() => setSuccessModal(false)}
              className="mt-4 w-full bg-green-600 hover:bg-green-700 text-white font-semibold py-2 rounded-md transition"
            >
              Zapri
            </button>
          </div>
        </div>
      )}
    </>
  );
}
