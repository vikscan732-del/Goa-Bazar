import { initializeApp } from "https://www.gstatic.com/firebasejs/12.0.0/firebase-app.js";
import { getFirestore } from "https://www.gstatic.com/firebasejs/12.0.0/firebase-firestore.js";

const firebaseConfig = {
  apiKey: "AIzaSyCFSlBW8aPT5HMwrU3YkurK9qSO4irwwew",
  authDomain: "goa-bazar.firebaseapp.com",
  projectId: "goa-bazar",
  storageBucket: "goa-bazar.firebasestorage.app",
  messagingSenderId: "340956541301",
  appId: "1:340956541301:web:be546dad2992f285b9233c"
};

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
