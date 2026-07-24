let vegetables = [];
let historyData = {};

Promise.all([
fetch("https://raw.githubusercontent.com/vikscan732-del/Goan-farmer-help/main/prices.json").then(r => r.json()),
fetch("https://raw.githubusercontent.com/vikscan732-del/Goan-farmer-help/main/history.json").then(r => r.json())
])

.then(([priceData, history]) => {

historyData = history;

document.getElementById("updateTime").textContent =
priceData.updatedAt || "-";

document.getElementById("vegDate").textContent =
priceData.priceDate || "-";

vegetables = (priceData.vegetables || []).sort((a, b) =>
a.name.localeCompare(b.name)
);

renderVegetables();

})

.catch(error => {

console.error(error);

document.getElementById("vegetableList").innerHTML = `
<div class="loading">
<div class="loader"></div>
<p>Unable to load prices.<br>Please try again later.</p>
</div>
`;

});

function renderVegetables() {

const list = document.getElementById("vegetableList");

list.innerHTML = "";

vegetables.forEach(v => {

const history = historyData[v.name] || [];

let statusClass = "status-same";
let statusTop = "🔵 ● ₹0";
let statusBottom = "No Change";

if (history.length >= 2) {

const today = history[history.length - 1].price;
const yesterday = history[history.length - 2].price;

const diff = today - yesterday;

if (diff > 0) {

statusClass = "status-up";
statusTop = `🟢 ▲ +₹${diff}`;
statusBottom = "Price Increased";

}

else if (diff < 0) {

statusClass = "status-down";
statusTop = `🔴 ▼ -₹${Math.abs(diff)}`;
statusBottom = "Price Decreased";

}

}

list.innerHTML += `

<div class="veg-card" onclick="openVegetable('${v.name}')">

<div class="veg-top">

<div class="veg-left">

<div class="veg-emoji">
${v.emoji || "🥬"}
</div>

<div class="veg-name">
${v.name}
</div>

</div>

<div class="veg-price">
₹${v.price}
<span>/${v.unit || "kg"}</span>
</div>

</div>

<div class="veg-bottom">

<div class="veg-status ${statusClass}">
${statusTop}
<small>${statusBottom}</small>
</div>

<div class="veg-arrow">
➜
</div>

</div>

</div>

`;

});

}

function openVegetable(name) {

window.location.href =
"vegetable.html?name=" + encodeURIComponent(name);

}
