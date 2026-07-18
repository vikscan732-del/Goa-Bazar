// Firebase Imports
import { db } from "./firebase.js";
import {
collection,
getDocs
} from "https://www.gstatic.com/firebasejs/12.2.1/firebase-firestore.js";


// ===============================

const todayDate = document.getElementById("todayDate");

const updateTime = document.getElementById("updateTime");

const loadingBox = document.getElementById("loadingBox");

const emptyBox = document.getElementById("emptyBox");

const productContainer = document.getElementById("productContainer");

const searchInput = document.getElementById("searchInput");

// ===============================

let allProducts = [];

// ===============================

const today = new Date();

todayDate.textContent = today.toLocaleDateString("en-IN", {

weekday: "long",

day: "numeric",

month: "long",

year: "numeric"

});

// ===============================

async function loadProducts(){

loadingBox.style.display = "block";

emptyBox.style.display = "none";

productContainer.innerHTML = "";

try{

const snapshot = await getDocs(collection(db,"products"));

allProducts = [];

snapshot.forEach((doc)=>{

const data = doc.data();

allProducts.push({

id: doc.id,

name: data.name || "",

price: data.price || 0,

category: data.category || "",

image: data.image || "assets/no-image.png",

change: data.change || 0,

updated: data.updated || ""

});

});

renderProducts(allProducts);

updateTime.textContent =
"Updated: " +
new Date().toLocaleTimeString();

}catch(error){

console.log(error);

loadingBox.innerHTML =

"<p>Failed to load products.</p>";

}

loadingBox.style.display="none";

}
// ===============================
// Render Products
// ===============================

function renderProducts(products){

productContainer.innerHTML="";

if(products.length===0){

emptyBox.style.display="block";

return;

}

emptyBox.style.display="none";

products.forEach(product=>{

const priceClass =
Number(product.change)>=0
? "price-up"
: "price-down";

const changeIcon =
Number(product.change)>=0
? "🟢"
: "🔴";

const card=document.createElement("div");

card.className="product-card";

card.innerHTML=`

<div class="product-image">

<img
src="${product.image}"
alt="${product.name}"
loading="lazy"
onerror="this.src='assets/no-image.png'">

</div>

<div class="product-info">

<h3>${product.name}</h3>

<p class="product-category">

${product.category}

</p>

<div class="price">

₹${Number(product.price).toFixed(2)}

<span>/kg</span>

</div>

<div class="${priceClass}">

${changeIcon}
₹${product.change}

</div>

</div>

<div class="arrow-box">

<div class="arrow-circle">

➜

</div>

</div>

`;

card.addEventListener("click",()=>{

window.location.href=
`product.html?id=${product.id}`;

});

productContainer.appendChild(card);

});

}
// ===============================
// Search Products
// ===============================

searchInput.addEventListener("input",(e)=>{

const keyword=e.target.value
.trim()
.toLowerCase();

if(keyword===""){

renderProducts(allProducts);

return;

}

const filtered=allProducts.filter(product=>{

return(

product.name
.toLowerCase()
.includes(keyword)

||

product.category
.toLowerCase()
.includes(keyword)

);

});

renderProducts(filtered);

});

// ===============================
// Refresh Products
// ===============================

function refreshProducts(){

loadProducts();

}

// Refresh when app becomes active
window.addEventListener("focus",()=>{

refreshProducts();

});

// Refresh when internet returns
window.addEventListener("online",()=>{

refreshProducts();

});

// Offline Message
window.addEventListener("offline",()=>{

updateTime.textContent="Offline Mode";

});

// ===============================
// Pull To Refresh
// ===============================

let startY=0;

window.addEventListener("touchstart",(e)=>{

startY=e.touches[0].clientY;

});

window.addEventListener("touchend",(e)=>{

const endY=e.changedTouches[0].clientY;

if(endY-startY>120){

refreshProducts();

}

});

// ===============================
// Start Application
// ===============================

loadProducts();



