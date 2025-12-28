import { db } from "./firebase";
import { collection, addDoc, getDocs, updateDoc, deleteDoc, doc, setDoc, query, orderBy, limit, serverTimestamp, getDoc, type UpdateData, type QueryDocumentSnapshot, type DocumentData } from "firebase/firestore";
import { Rental, Nosilec, ThuleItem, Kovcek } from "./types";

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
    querySnapshot.forEach((doc: QueryDocumentSnapshot<DocumentData>) => {
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
    querySnapshot.forEach((doc: QueryDocumentSnapshot<DocumentData>) => {
      nosilci.push({ id: doc.id, ...(doc.data() as Omit<Nosilec, "id">) });
    });
    return nosilci;
  } catch (e) {
    console.error("Napaka pri pridobivanju nosilcev:", e);
    throw e;
  }
};

// Pridobi vse kovčke
export const pridobiVseKovcki = async (): Promise<Kovcek[]> => {
  try {
    const kovckiCollection = collection(db, "kovcki");
    const snap = await getDocs(kovckiCollection);
    const kovcki: Kovcek[] = [];
    snap.forEach((d: QueryDocumentSnapshot<DocumentData>) => kovcki.push({ id: d.id, ...(d.data() as Omit<Kovcek, "id">) }));
    return kovcki;
  } catch (e) {
    console.error("Napaka pri pridobivanju kovčkov:", e);
    throw e;
  }
};

// Dodaj nosilec
export const dodajNosilec = async (data: Omit<Nosilec, "id">, meta?: { device?: string }) => {
  try {
    const nosilciCollection = collection(db, "Nosilci");
    const docRef = await addDoc(nosilciCollection, data);
    try { await addDoc(collection(db, 'audit'), { message: `Dodajanje nosilec ${docRef.id}`, collection: 'nosilci', action: 'create', itemId: docRef.id, device: meta?.device, timestamp: serverTimestamp() }); } catch { /* ignore */ }
    return docRef.id;
  } catch (e) {
    console.error("Napaka pri dodajanju nosilca:", e);
    throw e;
  }
};

export const updateNosilec = async (id: string, data: Partial<Omit<Nosilec, "id">>, meta?: { device?: string }) => {
  try {
    const ref = doc(db, "nosilci", id);
    const snap = await getDoc(ref);
    const old = snap.exists() ? (snap.data() as Record<string, unknown>) : {};
    await updateDoc(ref, data as UpdateData<DocumentData>);
    // write per-field audit entries (best-effort)
    try {
      for (const key of Object.keys(data)) {
        const oldVal = old && typeof old === 'object' ? (old as Record<string, unknown>)[key] : undefined;
        const newVal = (data as Record<string, unknown>)[key];
        if (JSON.stringify(oldVal) !== JSON.stringify(newVal)) {
          await addDoc(collection(db, 'audit'), { collection: 'nosilci', action: 'update', itemId: id, field: key, oldValue: oldVal ?? null, newValue: newVal ?? null, device: meta?.device, timestamp: serverTimestamp() });
        }
      }
    } catch { /* ignore audit errors */ }
  } catch (e) {
    console.error("Napaka pri posodabljanju nosilca:", e);
    throw e;
  }
};

export const deleteNosilec = async (id: string) => {
  try {
    await deleteDoc(doc(db, "nosilci", id));
    try { await addDoc(collection(db, 'audit'), { message: `Brisanje nosilec ${id}`, collection: 'nosilci', action: 'delete', itemId: id, timestamp: serverTimestamp() }); } catch { /* ignore */ }
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
    snap.forEach((d: QueryDocumentSnapshot<DocumentData>) => items.push({ id: d.id, ...(d.data() as Omit<ThuleItem, "id">) }));
    return items;
  } catch (e) {
    console.error("Napaka pri pridobivanju Thule artiklov:", e);
    throw e;
  }
};

export const dodajThule = async (data: Omit<ThuleItem, "id">, meta?: { device?: string }) => {
  try {
    const col = collection(db, "thule_items");
    
    // Get all items to determine next serial number and check for duplicates
    const snap = await getDocs(col);
    const items: ThuleItem[] = [];
    snap.forEach((d: QueryDocumentSnapshot<DocumentData>) => items.push({ id: d.id, ...(d.data() as Omit<ThuleItem, "id">) }));
    
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
      // If data includes variant/length, ensure it matches
      if (data.variant !== undefined && item.variant !== data.variant) return false;
      if (data.length !== undefined && item.length !== data.length) return false;
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
    // write audit entry (best-effort)
    try {
      await addDoc(collection(db, 'audit'), { message: `Dodajanje Thule: ${nextSerial}`, collection: 'thule_items', action: 'create', itemId: nextSerial, device: meta?.device, timestamp: serverTimestamp() });
    } catch { /* ignore audit errors */ }
    return nextSerial;
  } catch (e) {
    console.error("Napaka pri dodajanju Thule artikla:", e);
    throw e;
  }
};

export const updateThule = async (id: string, data: Partial<Omit<ThuleItem, "id">>, meta?: { device?: string }) => {
  try {
    const ref = doc(db, "thule_items", id);
    const snap = await getDoc(ref);
    const old = snap.exists() ? (snap.data() as Record<string, unknown>) : {};
    await updateDoc(ref, data as UpdateData<DocumentData>);
    try {
      for (const key of Object.keys(data)) {
        const oldVal = old && typeof old === 'object' ? (old as Record<string, unknown>)[key] : undefined;
        const newVal = (data as Record<string, unknown>)[key];
        if (JSON.stringify(oldVal) !== JSON.stringify(newVal)) {
          await addDoc(collection(db, 'audit'), { collection: 'thule_items', action: 'update', itemId: id, field: key, oldValue: oldVal ?? null, newValue: newVal ?? null, device: meta?.device, timestamp: serverTimestamp() });
        }
      }
    } catch { /* ignore */}
  } catch (e) {
    console.error("Napaka pri posodabljanju Thule artikla:", e);
    throw e;
  }
};

export const deleteThule = async (id: string) => {
  try {
    await deleteDoc(doc(db, "thule_items", id));
    try { await addDoc(collection(db, 'audit'), { message: `Brisanje Thule ${id}`, collection: 'thule_items', action: 'delete', itemId: id, timestamp: serverTimestamp() }); } catch { /* ignore */ }
  } catch (e) {
    console.error("Napaka pri brisanju Thule artikla:", e);
    throw e;
  }
};

export const updateKovcek = async (id: string, data: Partial<Omit<Kovcek, "id">>, meta?: { device?: string }) => {
  try {
    const ref = doc(db, "kovcki", id);
    const snap = await getDoc(ref);
    const old = snap.exists() ? (snap.data() as Record<string, unknown>) : {};
    await updateDoc(ref, data as UpdateData<DocumentData>);
    try {
      for (const key of Object.keys(data)) {
        const oldVal = old && typeof old === 'object' ? (old as Record<string, unknown>)[key] : undefined;
        const newVal = (data as Record<string, unknown>)[key];
        if (JSON.stringify(oldVal) !== JSON.stringify(newVal)) {
          await addDoc(collection(db, 'kovcki'), { collection: 'kovcki', action: 'update', itemId: id, field: key, oldValue: oldVal ?? null, newValue: newVal ?? null, device: meta?.device, timestamp: serverTimestamp() });
        }
      }
    } catch { /* ignore */}
  } catch (e) {
    console.error("Napaka pri posodabljanju kovčka:", e);
    throw e;
  }
};

export const dodajKovcek = async (data: Omit<Kovcek, "id">, meta?: { device?: string }) => {
  try {
    const ref = await addDoc(collection(db, 'kovcki'), data);
    try { await addDoc(collection(db, 'audit'), { message: `Dodajanje kovček ${ref.id}`, collection: 'kovcki', action: 'create', itemId: ref.id, device: meta?.device, timestamp: serverTimestamp() }); } catch { /* ignore */ }
    return ref.id;
  } catch (e) {
    console.error('Napaka pri dodajanju kovčka:', e);
    throw e;
  }
};

export const deleteKovcek = async (id: string, meta?: { device?: string }) => {
  try {
    await deleteDoc(doc(db, 'kovcki', id));
    try { await addDoc(collection(db, 'audit'), { message: `Brisanje kovček ${id}`, collection: 'kovcki', action: 'delete', itemId: id, device: meta?.device, timestamp: serverTimestamp() }); } catch { /* ignore */ }
  } catch (e) {
    console.error('Napaka pri brisanju kovčka:', e);
    throw e;
  }
};

// Pridobi zadnje spremembe iz kolekcije 'audit' (če obstaja)
export const pridobiZadnjeSpremembe = async (limitCount = 20): Promise<Record<string, unknown>[]> => {
  try {
    const col = collection(db, 'audit');
    const q = query(col, orderBy('timestamp', 'desc'), limit(limitCount));
    const snap = await getDocs(q);
    const items: Record<string, unknown>[] = [];
    snap.forEach((d: QueryDocumentSnapshot<DocumentData>) => items.push({ id: d.id, ...(d.data() as Record<string, unknown>) }));
    return items;
  } catch (e) {
    console.warn('Kolekcija audit verjetno ne obstaja ali napaka pri pridobivanju:', e);
    return [];
  }
};
