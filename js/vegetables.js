let vegetables = [];
let historyData = {};

Promise.all([
fetch("https://raw.githubusercontent.com/vikscan732-del/Goan-farmer-help/main/prices.json").then(r=>r.json()),
fetch("https://raw.githubusercontent.com/vikscan732-del/Goan-farmer-help/main/history.json").then(r=>r.json())
])

.then(([priceData,history])=>{

historyData=history;

document.getElementById("updateTime").textContent=
priceData.updatedAt||"-";

document.getElementById("vegDate").textContent=
priceData.priceDate||"-";

vegetables=(priceData.vegetables||[]).sort((a,b)=>
a.name.localeCompare(b.name)
);

renderVegetables();

})

.catch(error=>{

console.error(error);

document.getElementById("vegetableList").innerHTML=`

<div class="empty-box">

<h3>❌ Unable to load prices</h3>

<p>Please try again later.</p>

</div>

`;

});

function renderVegetables(){

const list=document.getElementById("vegetableList");

list.innerHTML="";

vegetables.forEach(v=>{

const history=historyData[v.name]||[];

let statusText="🔵 ● No Change";
let statusColor="#2563EB";

if(history.length>=2){

const today=history[history.length-1].price;

const yesterday=history[history.length-2].price;

const diff=today-yesterday;

if(diff>0){

statusText=`🟢 ▲ +₹${diff}<br>Price Increased`;
statusColor="#16A34A";

}

else if(diff<0){

statusText=`🔴 ▼ -₹${Math.abs(diff)}<br>Price Decreased`;
statusColor="#DC2626";

}

}

list.innerHTML+=`

<div class="veg-card"
onclick="openVegetable('${encodeURIComponent(v.name)}')">

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
₹${v.price}<span>/${v.unit || "kg"}</span>
</div>

</div>

<div class="veg-bottom">

<div class="veg-status"
style="color:${statusColor};">

${statusText}

</div>

<div class="veg-arrow">
➜
</div>

</div>

</div>
`;

});

}function openVegetable(name){

window.location.href=
"vegetable.html?name="+encodeURIComponent(name);

}


