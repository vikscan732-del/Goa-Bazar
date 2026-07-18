import { db } from "./firebase.js";

import {
  doc,
  getDoc,
  updateDoc
} from "https://www.gstatic.com/firebasejs/12.0.0/firebase-firestore.js";

const params = new URLSearchParams(window.location.search);
const id = params.get("id");

const name = document.getElementById("name");
const price = document.getElementById("price");
const category = document.getElementById("category");
const image = document.getElementById("image");

async function loadProduct() {

  if (!id) {
    alert("Product ID not found");
    return;
  }

  const ref = doc(db, "products", id);
  const snap = await getDoc(ref);

  if (!snap.exists()) {
    alert("Product not found");
    return;
  }

  const p = snap.data();

  name.value = p.name || "";
  price.value = p.price || "";
  category.value = p.category || "";
  image.value = p.image || "";
}

window.saveProduct = async function () {

  await updateDoc(doc(db, "products", id), {
    name: name.value,
    price: Number(price.value),
    category: category.value,
    image: image.value
  });

  alert("Product updated successfully!");

  window.location.href = "manage-products.html";
};

loadProduct();
