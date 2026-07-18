import { db } from "./firebase.js";

import {
  doc,
  getDoc
} from "https://www.gstatic.com/firebasejs/12.2.1/firebase-firestore.js";

const params = new URLSearchParams(window.location.search);
const productId = params.get("id");

const productImage = document.getElementById("productImage");
const productName = document.getElementById("productName");
const productCategory = document.getElementById("productCategory");
const todayPrice = document.getElementById("todayPrice");
const highestPrice = document.getElementById("highestPrice");
const lowestPrice = document.getElementById("lowestPrice");
const farmerPrice = document.getElementById("farmerPrice");
const priceChange = document.getElementById("priceChange");
const lastUpdated = document.getElementById("lastUpdated");

let chart;

async function loadProduct() {

  if (!productId) {
    alert("Invalid Product");
    return;
  }

  try {

    const snap = await getDoc(doc(db, "products", productId));

    if (!snap.exists()) {
      alert("Product not found");
      return;
    }

    const data = snap.data();

    productImage.src = data.image || "assets/no-image.png";
    productName.textContent = data.name || "-";
    productCategory.textContent = data.category || "Goa Market";

    todayPrice.textContent = "₹" + (data.price || "0");

    highestPrice.textContent = "₹" + (data.highest || data.price || "0");

    lowestPrice.textContent = "₹" + (data.lowest || data.price || "0");

    farmerPrice.textContent = "₹" + (data.farmerPrice || data.price || "0");

    priceChange.textContent = data.change || "0";

    if (data.updated?.toDate) {
      lastUpdated.textContent =
        data.updated.toDate().toLocaleString("en-IN");
    } else {
      lastUpdated.textContent = "Recently";
    }

    drawChart(data.history || []);

  } catch (e) {

    console.error(e);
    alert("Unable to load product.");

  }

}

function drawChart(history) {

  const canvas = document.getElementById("priceChart");

  if (!canvas) return;

  const ctx = canvas.getContext("2d");

  if (chart) chart.destroy();

  if (!history.length) {

    history = [
      { day: "Mon", price: 0 },
      { day: "Tue", price: 0 },
      { day: "Wed", price: 0 },
      { day: "Thu", price: 0 },
      { day: "Fri", price: 0 },
      { day: "Sat", price: 0 },
      { day: "Sun", price: 0 }
    ];

  }

  chart = new Chart(ctx, {
    type: "line",
    data: {
      labels: history.map(x => x.day),
      datasets: [{
        data: history.map(x => x.price),
        borderColor: "#138808",
        fill: true,
        tension: 0.4
      }]
    },
    options: {
      responsive: true,
      plugins: {
        legend: {
          display: false
        }
      }
    }
  });

}

loadProduct();
