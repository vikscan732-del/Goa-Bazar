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
const lastUpdated = document.getElementById("lastUpdated");

const changeIcon = document.getElementById("changeIcon");
const changeValue = document.getElementById("changeValue");
const changeText = document.getElementById("changeText");

let chart;
let fullHistory = [];

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

    const change = Number(data.change || 0);
    const percent = Number(data.changePercent || 0);

    if (change > 0) {

      changeIcon.textContent = "↑";
      changeIcon.style.background = "#16a34a";

      changeValue.style.color = "#16a34a";
      changeValue.textContent = `+₹${change} (${percent}%)`;

      changeText.textContent = "कालपेक्षा वाढ";

    }

    else if (change < 0) {

      changeIcon.textContent = "↓";
      changeIcon.style.background = "#dc2626";

      changeValue.style.color = "#dc2626";
      changeValue.textContent = `-₹${Math.abs(change)} (${Math.abs(percent)}%)`;

      changeText.textContent = "कालपेक्षा घट";

    }

    else {

      changeIcon.textContent = "→";
      changeIcon.style.background = "#9ca3af";

      changeValue.style.color = "#555";
      changeValue.textContent = "₹0 (0%)";

      changeText.textContent = "बदल नाही";

    }

    if (data.updated?.toDate) {
      lastUpdated.textContent =
        data.updated.toDate().toLocaleString("en-IN");
    } else {
      lastUpdated.textContent = "Recently";
    }

    fullHistory = data.history || [];

    drawChart(fullHistory);

    setupGraphFilters();

  } catch (e) {

    console.error(e);
    alert("Unable to load product.");

  }

}

function setupGraphFilters() {

  const buttons = document.querySelectorAll(".graph-filter");

  buttons.forEach(btn => {

    btn.addEventListener("click", () => {

      buttons.forEach(b => b.classList.remove("active"));
      btn.classList.add("active");

      const days = Number(btn.dataset.days);

      if (days === 0) {
        drawChart(fullHistory);
      } else {
        drawChart(fullHistory.slice(-days));
      }

    });

  });

}

function drawChart(history) {

  const canvas = document.getElementById("priceChart");

  if (!canvas) return;

  const ctx = canvas.getContext("2d");

  if (chart) chart.destroy();

  if (!history.length) {

    history = [
      { date: "Mon", price: 0 },
      { date: "Tue", price: 0 },
      { date: "Wed", price: 0 },
      { date: "Thu", price: 0 },
      { date: "Fri", price: 0 },
      { date: "Sat", price: 0 },
      { date: "Sun", price: 0 }
    ];

  }

  chart = new Chart(ctx, {

    type: "line",

    data: {

      labels: history.map(x => x.date),

      datasets: [{

        data: history.map(x => x.price),

        borderColor: "#138808",
        backgroundColor: "rgba(19,136,8,0.15)",
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
