import { db } from "./firebase.js";

import {
  collection,
  getDocs
} from "https://www.gstatic.com/firebasejs/12.0.0/firebase-firestore.js";

const list = document.getElementById("products");

async function loadProducts() {
  try {
    list.innerHTML = "<h3>Loading products...</h3>";

    const snapshot = await getDocs(collection(db, "products"));

    list.innerHTML = "";

    if (snapshot.empty) {
      list.innerHTML = "<h3>No products found.</h3>";
      return;
    }

    snapshot.forEach((item) => {
      const p = item.data();

      list.innerHTML += `
        <div class="card">
          <h3>${p.name || "No Name"}</h3>
          <p><b>₹ ${p.price || "-"}</b></p>
          <p>${p.category || "-"}</p>

          <button onclick="editProduct('${item.id}')">
            Edit
          </button>
        </div>
      `;
    });

  } catch (error) {
    console.error(error);
    list.innerHTML = `
      <h3 style="color:red">
        ${error.message}
      </h3>
    `;
  }
}

window.editProduct = function(id) {
  window.location.href = "edit-product.html?id=" + id;
};

loadProducts();
