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

  snapshot.forEach((item) => {

    const p = item.data();

    list.innerHTML += `
      <div class="card">

        <h3>${p.name || "No Name"}</h3>

        <p><b>₹ ${p.price || "-"}</b></p>

        <p>${p.category || "-"}</p>

        <button
          style="background:#1976d2;color:#fff;padding:10px 16px;border:none;border-radius:8px;cursor:pointer;"
          onclick="editProduct('${item.id}')">
          ✏️ Edit
        </button>

      </div>
    `;
  });
}

window.editProduct = function(id) {
  window.location.href = "edit-product.html?id=" + id;
};

loadProducts();
