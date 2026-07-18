import { db } from "./firebase.js";

import {
  collection,
  getDocs,
  deleteDoc,
  updateDoc,
  doc
} from "https://www.gstatic.com/firebasejs/12.0.0/firebase-firestore.js";

const list = document.getElementById("products");
const search = document.getElementById("search");

let products = [];

async function loadProducts(){

try{

list.innerHTML="<h3>Loading products...</h3>";

const snapshot=await getDocs(collection(db,"products"));

products=[];

snapshot.forEach((item)=>{

products.push({
id:item.id,
...item.data()
});

});

renderProducts(products);

}catch(e){

list.innerHTML="<h3 style='color:red'>"+e.message+"</h3>";

}

}

function renderProducts(data){

list.innerHTML="";

if(data.length===0){

list.innerHTML="<h3>No products found.</h3>";
return;

}

data.forEach((p)=>{

const status=p.visible===false
?"Hidden"
:"Visible";

const btnClass=p.visible===false
?"show"
:"hide";

const btnText=p.visible===false
?"👁 Show"
:"🙈 Hide";

list.innerHTML+=`

<div class="card">

<img src="${p.image || 'https://via.placeholder.com/300x180?text=No+Image'}">

<h3>${p.name || "No Name"}</h3>

<p class="price">₹ ${p.price || "-"}</p>

<p class="category">${p.category || "-"}</p>

<p class="status">
Status :
<b>${status}</b>
</p>

<div class="buttons">

<button
class="edit"
onclick="editProduct('${p.id}')">
✏ Edit
</button>

<button
class="delete"
onclick="deleteProduct('${p.id}')">
🗑 Delete
</button>

<button
class="${btnClass}"
onclick="toggleProduct('${p.id}',${p.visible===false})">
${btnText}
</button>

</div>

</div>

`;

});

}

window.editProduct = function(id){
  window.location.href = "edit-product.html?id=" + id;
};

window.deleteProduct = async function(id){

  const ok = confirm("Delete this product?");

  if(!ok) return;

  try{

    await deleteDoc(doc(db,"products",id));

    alert("Product deleted successfully.");

    loadProducts();

  }catch(e){

    alert(e.message);

  }

};

window.toggleProduct = async function(id,currentHidden){

  try{

    await updateDoc(doc(db,"products",id),{

      visible: currentHidden,
      updatedDate: new Date().toISOString().split("T")[0]

    });

    loadProducts();

  }catch(e){

    alert(e.message);

  }

};

search.addEventListener("input",()=>{

  const keyword = search.value.toLowerCase();

  const filtered = products.filter((p)=>{

    return (
      (p.name || "").toLowerCase().includes(keyword) ||
      (p.category || "").toLowerCase().includes(keyword)
    );

  });

  renderProducts(filtered);

});

loadProducts();
