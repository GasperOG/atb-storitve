import { db } from "./firebase";
import { collection, addDoc, getDocs, updateDoc, deleteDoc, doc, setDoc } from "firebase/firestore";
import { Rental, Nosilec, ThuleItem } from "./types";

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

// Pridobi vse nosilce (inventura)
export const pridobiVseNosilce = async (): Promise<Nosilec[]> => {
  try {
    const nosilciCollection = collection(db, "nosilci");
    const querySnapshot = await getDocs(nosilciCollection);
    const nosilci: Nosilec[] = [];
    querySnapshot.forEach((doc) => {
      nosilci.push({ id: doc.id, ...(doc.data() as Omit<Nosilec, "id">) });
    });
    return nosilci;
  } catch (e) {
    console.error("Napaka pri pridobivanju nosilcev:", e);
    throw e;
  }
};

// Dodaj nosilec
export const dodajNosilec = async (data: Omit<Nosilec, "id">) => {
  try {
    const nosilciCollection = collection(db, "Nosilci");
    const docRef = await addDoc(nosilciCollection, data);
    return docRef.id;
  } catch (e) {
    console.error("Napaka pri dodajanju nosilca:", e);
    throw e;
  }
};

export const updateNosilec = async (id: string, data: Partial<Omit<Nosilec, "id">>) => {
  try {
    const ref = doc(db, "nosilci", id);
    await updateDoc(ref, data as any);
  } catch (e) {
    console.error("Napaka pri posodabljanju nosilca:", e);
    throw e;
  }
};

export const deleteNosilec = async (id: string) => {
  try {
    await deleteDoc(doc(db, "nosilci", id));
  } catch (e) {
    console.error("Napaka pri brisanju nosilca:", e);
    throw e;
  }
};

// Thule items (Kit, Foot, Bars)
export const pridobiVseThule = async (): Promise<ThuleItem[]> => {
  try {
    const col = collection(db, "thule_items");
    const snap = await getDocs(col);
    const items: ThuleItem[] = [];
    snap.forEach((d) => items.push({ id: d.id, ...(d.data() as Omit<ThuleItem, "id">) }));
    return items;
  } catch (e) {
    console.error("Napaka pri pridobivanju Thule artiklov:", e);
    throw e;
  }
};

export const dodajThule = async (data: Omit<ThuleItem, "id">) => {
  try {
    const col = collection(db, "thule_items");
    
    // Get all items to determine next serial number and check for duplicates
    const snap = await getDocs(col);
    const items: ThuleItem[] = [];
    snap.forEach((d) => items.push({ id: d.id, ...(d.data() as Omit<ThuleItem, "id">) }));
    
    // Calculate next serial number - find the maximum ID and add 1
    const maxId = items.length > 0 
      ? Math.max(...items.map(item => parseInt(item.id, 10)))
      : 0;
    const nextSerial = String(maxId + 1);
    
    // Check if duplicate exists (same category, series, model, condition, and when present variant/length)
    const duplicate = items.find((item) => {
      if (item.category !== data.category) return false;
      if (item.series !== data.series) return false;
      if (item.model !== data.model) return false;
      if (item.condition !== data.condition) return false;
      // If data includes variant, ensure it matches
      if ((data as any).variant !== undefined) {
        if (item.variant !== (data as any).variant) return false;
      }
      // If data includes length, ensure it matches
      if ((data as any).length !== undefined) {
        if (item.length !== (data as any).length) return false;
      }
      return true;
    });
    
    if (duplicate) {
      // If duplicate exists, increment quantity instead of creating new
      await updateThule(duplicate.id, {
        quantity: (duplicate.quantity || 1) + 1
      });
      return duplicate.id;
    }
    
    // Create new document with serial number as ID using setDoc
    const ref = doc(db, "thule_items", nextSerial);
    await setDoc(ref, { ...data, quantity: 1 });
    return nextSerial;
  } catch (e) {
    console.error("Napaka pri dodajanju Thule artikla:", e);
    throw e;
  }
};

export const updateThule = async (id: string, data: Partial<Omit<ThuleItem, "id">>) => {
  try {
    const ref = doc(db, "thule_items", id);
    await updateDoc(ref, data as any);
  } catch (e) {
    console.error("Napaka pri posodabljanju Thule artikla:", e);
    throw e;
  }
};

export const deleteThule = async (id: string) => {
  try {
    await deleteDoc(doc(db, "thule_items", id));
  } catch (e) {
    console.error("Napaka pri brisanju Thule artikla:", e);
    throw e;
  }
};
