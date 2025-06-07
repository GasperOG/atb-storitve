import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";

const firebaseConfig = {
  apiKey: "AIzaSyAfINjEAXqUzopBMyflwhcnTA_ieCfQLNw",
  authDomain: "atb-storitve.firebaseapp.com",
  projectId: "atb-storitve",
  storageBucket: "atb-storitve.firebasestorage.app",
  messagingSenderId: "521646612400",
  appId: "1:521646612400:web:e65df0f5d68d80a2b50075",
  measurementId: "G-BPKDW6FJYG"
};

const app = initializeApp(firebaseConfig);
// const analytics = getAnalytics(app);