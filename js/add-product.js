import { db } from "./firebase.js";
import {
  collection,
  addDoc
} from "https://www.gstatic.com/firebasejs/12.0.0/firebase-firestore.js";

window.saveProduct = async function () {

  const name = document.getElementById("name").value.trim();
  const category = document.getElementById("category").value;
  const price = document.getElementById("price").value;
  const image = document.getElementById("image").value.trim();

  if (!name || !price) {
    document.getElementById("msg").innerText = "Please fill all required fields.";
    return;
  }

  try {
    await addDoc(collection(db, "products"), {
      name,
      category,
      price: Number(price),
      image,
      createdAt: new Date()
    });

    document.getElementById("msg").innerText = "✅ Product Saved Successfully";

    document.getElementById("name").value = "";
    document.getElementById("price").value = "";
    document.getElementById("image").value = "";

  } catch (e) {
    document.getElementById("msg").innerText = "❌ Error: " + e.message;
  }
}
