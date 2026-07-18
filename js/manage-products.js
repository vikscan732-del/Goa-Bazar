<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>Manage Products</title>

<style>
*{
margin:0;
padding:0;
box-sizing:border-box;
font-family:Arial,sans-serif;
}

body{
background:#f4f6f9;
padding:20px;
}

h2{
color:#2e7d32;
margin-bottom:20px;
}

#search{
width:100%;
padding:12px;
font-size:16px;
border:1px solid #ccc;
border-radius:10px;
margin-bottom:20px;
outline:none;
}

#products{
display:grid;
grid-template-columns:repeat(auto-fill,minmax(300px,1fr));
gap:15px;
}

.card{
background:#fff;
border-radius:12px;
padding:15px;
box-shadow:0 2px 8px rgba(0,0,0,.1);
}

.card img{
width:100%;
height:180px;
object-fit:cover;
border-radius:10px;
margin-bottom:10px;
background:#eee;
}

.card h3{
color:#2e7d32;
margin-bottom:10px;
}

.price{
font-size:18px;
font-weight:bold;
color:#d32f2f;
margin-bottom:8px;
}

.category{
color:#555;
margin-bottom:5px;
}

.status{
margin-bottom:10px;
font-weight:bold;
}

.buttons{
display:flex;
flex-wrap:wrap;
gap:10px;
margin-top:15px;
}

button{
border:none;
padding:10px 14px;
border-radius:8px;
color:white;
cursor:pointer;
font-size:14px;
}

.edit{
background:#1976d2;
}

.delete{
background:#d32f2f;
}

.hide{
background:#f57c00;
}

.show{
background:#388e3c;
}
</style>

</head>
<body>

<h2>Manage Products</h2>

<input
id="search"
type="text"
placeholder="Search products...">

<div id="products">
<h3>Loading products...</h3>
</div>

<script type="module" src="../js/manage-products.js"></script>

</body>
</html>
