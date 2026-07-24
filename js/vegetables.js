let vegetables = [];

fetch("prices.json")
.then(res => res.json())
.then(data => {

document.getElementById("updateTime").textContent =
data.updatedAt || "-";

document.getElementById("vegDate").textContent =
data.priceDate || "-";

vegetables = data.vegetables || [];

document.getElementById("vegCount").textContent =
vegetables.length + " Items";

renderVegetables(vegetables);

updateStats(vegetables);

})
.catch(() => {

document.getElementById("vegetableList").innerHTML = `
<div class="empty-box">
<h3>No Data Found</h3>
<p>prices.json could not be loaded.</p>
</div>
`;

});

function renderVegetables(arr){

const list = document.getElementById("vegetableList");

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

<div class="veg-card">

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
₹${v.price}
</div>

</div>

`;

});

}

function updateStats(arr){

document.getElementById("totalVeg").textContent = arr.length;

if(arr.length===0) return;

const prices = arr.map(v=>Number(v.price));

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

const q = document
.getElementById("searchInput")
.value
.toLowerCase();

const filtered = vegetables.filter(v=>

v.name.toLowerCase().includes(q)

);

renderVegetables(filtered);

}
