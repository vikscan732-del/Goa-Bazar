const params = new URLSearchParams(window.location.search);
const vegName = decodeURIComponent(params.get("name") || "");

let todayData = null;
let historyData = null;

// Load today's prices
fetch("https://raw.githubusercontent.com/vikscan732-del/Goan-farmer-help/main/prices.json")
.then(r => r.json())
.then(data => {
    todayData = data;
    return fetch("https://raw.githubusercontent.com/vikscan732-del/Goan-farmer-help/main/history.json");
})
.then(r => r.json())
.then(history => {
    historyData = history;
    showVegetable();
})
.catch(err => {
    console.error(err);
    document.body.innerHTML = "<h2>Error loading vegetable data.</h2>";
});

function showVegetable() {

    const veg = todayData.vegetables.find(v => v.name === vegName);

    if (!veg) {
        document.body.innerHTML = "<h2>Vegetable not found.</h2>";
        return;
    }

    document.getElementById("vegEmoji").textContent = veg.emoji;
    document.getElementById("vegName").textContent = veg.name;
    document.getElementById("todayPrice").textContent =
        `₹${veg.price}/${veg.unit}`;

    document.getElementById("updated").textContent =
        todayData.priceDate + " " + todayData.updatedAt;

    const history = historyData[veg.name] || [];

    let yesterday = "-";
    let diff = "-";
    let status = "No previous data";

    if (history.length >= 2) {

        const today = history[history.length - 1];
        const prev = history[history.length - 2];

        yesterday = "₹" + prev.price + "/" + veg.unit;

        const change = today.price - prev.price;

        if (change > 0) {
            diff = "🟢 +₹" + change;
            status = "Price Increased";
        }
        else if (change < 0) {
            diff = "🔴 ₹" + change;
            status = "Price Decreased";
        }
        else {
            diff = "₹0";
            status = "No Change";
        }
    }

    document.getElementById("yesterday").textContent = yesterday;
    document.getElementById("difference").textContent = diff;
    document.getElementById("status").textContent = status;
}
