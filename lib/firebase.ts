import { initializeApp, getApps } from "firebase/app";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyAfINjEAXqUzopBMyflwhcnTA_ieCfQLNw",
  authDomain: "atb-storitve.firebaseapp.com",
  projectId: "atb-storitve",
  storageBucket: "atb-storitve.firebasestorage.app",
  messagingSenderId: "521646612400",
  appId: "1:521646612400:web:e65df0f5d68d80a2b50075",
  measurementId: "G-BPKDW6FJYG"
};

// Preprečimo ponovno inicializacijo, če je app že naložen
const app = !getApps().length ? initializeApp(firebaseConfig) : getApps()[0];

// Eksportiramo bazo, da jo lahko uporabljamo drugje
export const db = getFirestore(app);
