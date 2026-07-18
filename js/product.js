import { initializeApp } from "https://www.gstatic.com/firebasejs/12.2.1/firebase-app.js";

import {
getFirestore,
doc,
getDoc
} from "https://www.gstatic.com/firebasejs/12.2.1/firebase-firestore.js";

// ===========================
// FIREBASE CONFIG
// ===========================

const firebaseConfig = {

apiKey: "YOUR_API_KEY",

authDomain: "YOUR_PROJECT.firebaseapp.com",

projectId: "YOUR_PROJECT",

storageBucket: "YOUR_PROJECT.firebasestorage.app",

messagingSenderId: "YOUR_SENDER_ID",

appId: "YOUR_APP_ID"

};

// ===========================

const app = initializeApp(firebaseConfig);

const db = getFirestore(app);

// ===========================

const params = new URLSearchParams(window.location.search);

const productId = params.get("id");

// ===========================

const productImage = document.getElementById("productImage");

const productName = document.getElementById("productName");

const productCategory = document.getElementById("productCategory");

const todayPrice = document.getElementById("todayPrice");

const highestPrice = document.getElementById("highestPrice");

const lowestPrice = document.getElementById("lowestPrice");

const farmerPrice = document.getElementById("farmerPrice");

const priceChange = document.getElementById("priceChange");

const lastUpdated = document.getElementById("lastUpdated");

// ===========================

let chart;

// ===========================

async function loadProduct(){

if(!productId){

alert("Invalid Product");

history.back();

return;

}

try{

const ref = doc(db,"products",productId);

const snap = await getDoc(ref);

if(!snap.exists()){

alert("Product Not Found");

history.back();

return;

}

const data = snap.data();

productImage.src =
data.image || "assets/no-image.png";

productName.textContent =
data.name || "-";

productCategory.textContent =
data.category || "-";

todayPrice.textContent =
"₹" + (data.price || 0);

highestPrice.textContent =
"₹" + (data.highest || 0);

lowestPrice.textContent =
"₹" + (data.lowest || 0);

farmerPrice.textContent =
"₹" + (data.farmerPrice || 0);

priceChange.textContent =
(data.change || 0) >= 0
? "+" + data.change
: data.change;

lastUpdated.textContent =
data.updated || "Not Available";

drawChart(data.history || []);

}catch(err){

console.error(err);

alert("Unable to load product.");

}

}
// ===========================
// Draw Price History Chart
// ===========================

function drawChart(history){

const canvas=document.getElementById("priceChart");

if(!canvas) return;

const ctx=canvas.getContext("2d");

if(chart){

chart.destroy();

}

if(!Array.isArray(history) || history.length===0){

history=[

{day:"Mon",price:0},
{day:"Tue",price:0},
{day:"Wed",price:0},
{day:"Thu",price:0},
{day:"Fri",price:0},
{day:"Sat",price:0},
{day:"Sun",price:0}

];

}

chart=new Chart(ctx,{

type:"line",

data:{

labels:history.map(item=>item.day),

datasets:[{

label:"Market Price",

data:history.map(item=>item.price),

borderColor:"#138808",

backgroundColor:"rgba(19,136,8,0.15)",

fill:true,

tension:0.4,

borderWidth:3,

pointRadius:4,

pointHoverRadius:6

}]

},

options:{

responsive:true,

maintainAspectRatio:false,

plugins:{

legend:{

display:false

}

},

scales:{

y:{

beginAtZero:false,

grid:{

display:true

}

},

x:{

grid:{

display:false

}

}

}

}

});

}

// ===========================
// Start Page
// ===========================

loadProduct();
