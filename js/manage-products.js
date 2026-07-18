import { db } from "./firebase.js";

import {
  collection,
  getDocs,
  deleteDoc,
  doc
} from "https://www.gstatic.com/firebasejs/12.0.0/firebase-firestore.js";

const list = document.getElementById("products");

async function loadProducts() {
  try {

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

          <div style="display:flex;gap:10px;margin-top:15px;">

            <button
              style="background:#1976d2;color:#fff;border:none;padding:10px 16px;border-radius:8px;cursor:pointer;"
              onclick="editProduct('${item.id}')">
              ✏️ Edit
            </button>

            <button
              style="background:#d32f2f;color:#fff;border:none;padding:10px 16px;border-radius:8px;cursor:pointer;"
              onclick="deleteProduct('${item.id}')">
              🗑 Delete
            </button>

          </div>

        </div>
      `;

    });

  } catch (error) {

    console.error(error);

    list.innerHTML = `
      <h3 style="color:red;text-align:center;">
        ${error.message}
      </h3>
    `;
  }
}

window.editProduct = function(id) {
  window.location.href = "edit-product.html?id=" + id;
};

window.deleteProduct = async function(id) {

  const ok = confirm("Are you sure you want to delete this product?");

  if (!ok) return;

  try {

    await deleteDoc(doc(db, "products", id));

    alert("Product deleted successfully.");

    loadProducts();

  } catch (error) {

    alert("Delete failed: " + error.message);

  }

};

loadProducts();
