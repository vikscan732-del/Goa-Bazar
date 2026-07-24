let vegetables = [];

fetch("https://raw.githubusercontent.com/vikscan732-del/Goan-farmer-help/main/prices.json")
.then(response => response.json())
.then(data => {

document.getElementById("updateTime").textContent =
data.updatedAt || "-";

document.getElementById("vegDate").textContent =
data.priceDate || "-";

vegetables = (data.vegetables || []).sort((a, b) =>
a.name.localeCompare(b.name)
);

document.getElementById("vegCount").textContent =
vegetables.length + " Items";

renderVegetables(vegetables);
updateStats(vegetables);

})
.catch(error => {

console.error(error);

document.getElementById("vegetableList").innerHTML = `
<div class="empty-box">
<h3>❌ Unable to load prices</h3>
<p>Please check prices.json</p>
</div>
`;

});

function renderVegetables(arr){

const list=document.getElementById("vegetableList");

if(arr.length===0){

list.innerHTML=`
<div class="empty-box">
<h3>No Vegetables Found</h3>
</div>
`;

return;

}

list.innerHTML="";

arr.forEach(v=>{

list.innerHTML+=`

<div class="veg-card" onclick="openVegetable('${encodeURIComponent(v.name)}')">

<div class="veg-left">

<div class="veg-emoji">
${v.emoji || "🥬"}
</div>

<div>

<div class="veg-name">
${v.name}
</div>

<div class="veg-unit">
${v.unit || "kg"}
</div>

</div>

</div>

<div class="veg-price">
₹${v.price}<span>/${v.unit || "kg"}</span>
</div>

</div>

`;

});

}

function updateStats(arr){

document.getElementById("totalVeg").textContent = arr.length;

if(arr.length===0){

document.getElementById("avgPrice").textContent="₹0";
document.getElementById("highPrice").textContent="₹0";
document.getElementById("lowPrice").textContent="₹0";

return;

}

const prices = arr
.map(v=>Number(v.price))
.filter(v=>!isNaN(v));

const total = prices.reduce((a,b)=>a+b,0);

const avg = Math.round(total/prices.length);

const high = Math.max(...prices);

const low = Math.min(...prices);

document.getElementById("avgPrice").textContent =
"₹"+avg;

document.getElementById("highPrice").textContent =
"₹"+high;

document.getElementById("lowPrice").textContent =
"₹"+low;

}

function searchVegetables(){

const query=document
.getElementById("searchInput")
.value
.trim()
.toLowerCase();

const filtered=vegetables.filter(v=>

v.name.toLowerCase().includes(query)

);

renderVegetables(filtered);

}

function openVegetable(name) {
    window.location.href =
        "vegetable.html?name=" + encodeURIComponent(name);
}
