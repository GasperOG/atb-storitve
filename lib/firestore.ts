import { db } from "./firebase";
import { collection, addDoc, getDocs } from "firebase/firestore";

const najemiCollection = collection(db, "najemi");

// Dodaj najem
export const dodajNajem = async (data) => {
  try {
    const docRef = await addDoc(najemiCollection, data);
    return docRef.id;
  } catch (e) {
    console.error("Napaka pri dodajanju najema:", e);
    throw e;
  }
};

// Pridobi vse najeme
export const pridobiVseNajeme = async () => {
  try {
    const querySnapshot = await getDocs(najemiCollection);
    const najemi = [];
    querySnapshot.forEach((doc) => {
      najemi.push({ id: doc.id, ...doc.data() });
    });
    return najemi;
  } catch (e) {
    console.error("Napaka pri pridobivanju najemov:", e);
    throw e;
  }
};
