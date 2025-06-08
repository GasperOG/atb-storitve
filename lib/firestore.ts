import { db } from "./firebase";
import { collection, addDoc, getDocs } from "firebase/firestore";
import { Rental } from "./types";

const najemiCollection = collection(db, "najemi");

// Dodaj najem
export const dodajNajem = async (data: Omit<Rental, "id">) => {
  try {
    const docRef = await addDoc(najemiCollection, data);
    return docRef.id;
  } catch (e) {
    console.error("Napaka pri dodajanju najema:", e);
    throw e;
  }
};

// Pridobi vse najeme
export const pridobiVseNajeme = async (): Promise<Rental[]> => {
  try {
    const querySnapshot = await getDocs(najemiCollection);
    const najemi: Rental[] = [];
    querySnapshot.forEach((doc) => {
      najemi.push({ id: doc.id, ...(doc.data() as Omit<Rental, "id">) });
    });
    return najemi;
  } catch (e) {
    console.error("Napaka pri pridobivanju najemov:", e);
    throw e;
  }
};
