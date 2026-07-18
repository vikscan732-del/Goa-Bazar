import { db } from "./firebase.js";

import {
  collection,
  getDocs
} from "https://www.gstatic.com/firebasejs/12.0.0/firebase-firestore.js";

const totalProducts = document.getElementById("totalProducts");
const hiddenProducts = document.getElementById("hiddenProducts");
const todayUpdates = document.getElementById("todayUpdates");

async function loadDashboard() {
  try {

    const snapshot = await getDocs(collection(db, "products"));

    let total = 0;
    let hidden = 0;
    let today = 0;

    const todayDate = new Date().toISOString().split("T")[0];

    snapshot.forEach((doc) => {
      total++;

      const p = doc.data();

      if (p.visible === false) {
        hidden++;
      }

      if (p.updatedDate === todayDate) {
        today++;
      }
    });

    totalProducts.textContent = total;
    hiddenProducts.textContent = hidden;
    todayUpdates.textContent = today;

  } catch (error) {

    console.error(error);

    totalProducts.textContent = "-";
    hiddenProducts.textContent = "-";
    todayUpdates.textContent = "-";

  }
}

loadDashboard();
