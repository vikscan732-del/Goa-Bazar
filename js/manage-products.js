import { db } from "./firebase.js";

import {
  collection,
  getDocs
} from "https://www.gstatic.com/firebasejs/12.0.0/firebase-firestore.js";

const list = document.getElementById("products");

async function loadProducts() {
  list.innerHTML = "<h3 style='text-align:center'>Loading products...</h3>";

  const snapshot = await getDocs(collection(db, "products"));

  list.innerHTML = "";

  if (snapshot.empty) {
    list.innerHTML = "<h3>No products found</h3>";
    return;
  }

  snapshot.forEach((doc) => {
    const p = doc.data();

    list.innerHTML += `
      <div class="card">
        <h3>${p.name}</h3>
        <p>₹ ${p.price}</p>
        <p>${p.category}</p>
      </div>
    `;
  });
}

loadProducts();
