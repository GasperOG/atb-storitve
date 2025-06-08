import { collection, query, where, getDocs } from "firebase/firestore";
import { db } from "@/lib/firebase";

export async function checkIfAvailable(itemId: string, startDate: string, endDate: string) {
  const rentalsRef = collection(db, "rentals");
  const q = query(rentalsRef, where("itemId", "==", itemId));
  const snapshot = await getDocs(q);

  for (const doc of snapshot.docs) {
    const rental = doc.data();
    // Preveri, če se termini prekrivajo
    if (!(endDate < rental.startDate || startDate > rental.endDate)) {
      return { zaseden: true, najem: rental };
    }
  }

  return { zaseden: false };
}
