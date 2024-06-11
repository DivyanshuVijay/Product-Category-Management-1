import { initializeApp } from "firebase/app";
import { getFirestore } from "@firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyCUiqKHbDnhqgHJ5AraeUhQr8Aiz0AjF1o",
  authDomain: "product-management-860d0.firebaseapp.com",
  projectId: "product-management-860d0",
  storageBucket: "product-management-860d0.appspot.com",
  messagingSenderId: "581376269809",
  appId: "1:581376269809:web:9629319e50dae46b21f850",
};

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
