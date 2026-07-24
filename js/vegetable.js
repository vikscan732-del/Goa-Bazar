const params = new URLSearchParams(window.location.search);
const vegName = decodeURIComponent(params.get("name") || "");

let todayData = null;
let historyData = null;

Promise.all([
fetch("https://raw.githubusercontent.com/vikscan732-del/Goan-farmer-help/main/prices.json").then(r=>r.json()),
fetch("https://raw.githubusercontent.com/vikscan732-del/Goan-farmer-help/main/history.json").then(r=>r.json())
])
.then(([prices,history])=>{

todayData=prices;
historyData=history;

loadVegetable();

})
.catch(err=>{

console.error(err);

document.body.innerHTML="<h2 style='padding:30px'>Unable to load data.</h2>";

});

function loadVegetable(){

const veg=todayData.vegetables.find(v=>v.name===vegName);

if(!veg){

document.body.innerHTML="<h2 style='padding:30px'>Vegetable not found.</h2>";

return;

}

const history=historyData[veg.name]||[];

document.getElementById("vegEmoji").textContent=veg.emoji;
document.getElementById("vegName").textContent=veg.name;
document.getElementById("todayPrice").textContent="₹"+veg.price;
document.getElementById("updated").textContent=
"Updated : "+todayData.priceDate+" "+todayData.updatedAt;

let highest=veg.price;
let lowest=veg.price;
let total=0;

history.forEach(item=>{

if(item.price>highest) highest=item.price;
if(item.price<lowest) lowest=item.price;

total+=item.price;

});

const avg=Math.round(total/history.length);

document.getElementById("highestPrice").textContent="₹"+highest;
document.getElementById("lowestPrice").textContent="₹"+lowest;
document.getElementById("averagePrice").textContent="₹"+avg;

if(history.length>=2){

const today=history[history.length-1];
const yesterday=history[history.length-2];

document.getElementById("yesterday").textContent=
"₹"+yesterday.price;

const diff=today.price-yesterday.price;

const percent=((diff/yesterday.price)*100).toFixed(2);

if(diff>0){

document.getElementById("difference").innerHTML=
"🟢 +₹"+diff+" (+"+percent+"%)";

document.getElementById("status").innerHTML=
"Price Increased";

}

else if(diff<0){

document.getElementById("difference").innerHTML=
"🔴 ₹"+diff+" ("+percent+"%)";

document.getElementById("status").innerHTML=
"Price Decreased";

}

else{

document.getElementById("difference").innerHTML=
"➖ ₹0";

document.getElementById("status").innerHTML=
"No Change";

}

}

else{

document.getElementById("yesterday").textContent="No Data";
document.getElementById("difference").textContent="--";
document.getElementById("status").textContent="Not enough history";

}

const week=history.slice(-7);

const month=history.slice(-30);

if(week.length){

const prices=week.map(x=>x.price);

document.getElementById("weekPrice").textContent=
"₹"+Math.min(...prices)+" - ₹"+Math.max(...prices);

}

if(month.length){

const prices=month.map(x=>x.price);

document.getElementById("monthPrice").textContent=
"₹"+Math.min(...prices)+" - ₹"+Math.max(...prices);

}

const historyBox=document.getElementById("history");

historyBox.innerHTML="";

for(let i=history.length-1;i>=0;i--){

const item=history[i];

let icon="➖";
let change="";

if(i>0){

const d=item.price-history[i-1].price;

if(d>0){

icon="🟢";
change="+₹"+d;

}

else if(d<0){

icon="🔴";
change="₹"+d;

}

else{

change="₹0";

}

}

historyBox.innerHTML+=`

<div class="row">

<span>${item.date}</span>

<span>₹${item.price}</span>

<span>${icon} ${change}</span>

</div>

`;

}

}
