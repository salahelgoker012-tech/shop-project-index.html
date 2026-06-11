const products=[
{
id:1,
name:"Short",
price:200,
images:["short1.jpg","short2.jpg","short3.jpg"]
},
{
id:2,
name:"Tshirt",
price:250,
images:["tshirt1.jpg","tshirt2.jpg","tshirt3.jpg"]
}
];

/* Splash */
setTimeout(()=>{
document.getElementById("splash").classList.add("hide");
setTimeout(()=>document.getElementById("splash").style.display="none",1000);
},4000);

/* CART */
let cart=JSON.parse(localStorage.getItem("cart")||"{}");
let selected={};

/* render */
function render(){
let box=document.getElementById("products");
box.innerHTML="";

products.forEach(p=>{

box.innerHTML+=`
<div class="card">

<img src="${p.images[0]}">
<img src="${p.images[1]}">
<img src="${p.images[2]}">

<h3>${p.name}</h3>
<p>${p.price} جنيه</p>

<div class="sizes" id="size-${p.id}">
<span onclick="selectSize(${p.id},'S',this)">S</span>
<span onclick="selectSize(${p.id},'M',this)">M</span>
<span onclick="selectSize(${p.id},'L',this)">L</span>
<span onclick="selectSize(${p.id},'XL',this)">XL</span>
</div>

<div class="colors" id="color-${p.id}">
<div class="color black" onclick="selectColor(${p.id},'أسود',this)"></div>
<div class="color white" onclick="selectColor(${p.id},'أبيض',this)"></div>
<div class="color red" onclick="selectColor(${p.id},'أحمر',this)"></div>
</div>

<button class="add-btn hidden" id="btn-${p.id}" onclick="addToCart(${p.id})">
إضافة للسلة
</button>

</div>
`;
});
}

/* size */
function selectSize(id,size,el){
if(!selected[id]) selected[id]={};
selected[id].size=size;

document.querySelectorAll(`#size-${id} span`)
.forEach(e=>e.classList.remove("active"));

el.classList.add("active");

checkReady(id);
}

/* color */
function selectColor(id,color,el){
if(!selected[id]) selected[id]={};
selected[id].color=color;

document.querySelectorAll(`#color-${id} .color`)
.forEach(e=>e.classList.remove("active"));

el.classList.add("active");

checkReady(id);
}

/* show add button */
function checkReady(id){
if(selected[id]?.size && selected[id]?.color){
document.getElementById(`btn-${id}`).classList.remove("hidden");
}
}

/* add to cart */
function addToCart(id){

let p=products.find(x=>x.id==id);

let size=selected[id]?.size;
let color=selected[id]?.color;

if(!size || !color){
alert("اختار المقاس واللون");
return;
}

let key=id+"-"+size+"-"+color;

if(!cart[key]){
cart[key]={id,size,color,count:1};
}else{
cart[key].count++;
}

localStorage.setItem("cart",JSON.stringify(cart));

updateCart();
updateCartCount();
}

/* cart */
function updateCart(){

let box=document.getElementById("cartItems");
let totalEl=document.getElementById("total");

if(!box) return;

box.innerHTML="";
let total=0;

Object.keys(cart).forEach(k=>{
let item=cart[k];
let p=products.find(x=>x.id==item.id);

let price=p.price*item.count;
total+=price;

box.innerHTML+=`
<div>
${p.name} (${item.size}/${item.color})<br>
<button onclick="changeQty('${k}',-1)">-</button>
${item.count}
<button onclick="changeQty('${k}',1)">+</button>
<button onclick="deleteItem('${k}')">حذف</button>
</div>
`;
});

totalEl.innerText=total;
}

/* qty */
function changeQty(k,v){
cart[k].count+=v;
if(cart[k].count<=0) delete cart[k];

localStorage.setItem("cart",JSON.stringify(cart));
updateCart();
updateCartCount();
}

/* delete */
function deleteItem(k){
delete cart[k];
localStorage.setItem("cart",JSON.stringify(cart));
updateCart();
updateCartCount();
}

/* counter */
function updateCartCount(){
let count=0;
Object.keys(cart).forEach(k=>{
count+=cart[k].count;
});
document.getElementById("cartCount").innerText=count;
}

/* form */
function openForm(){
document.getElementById("formBox").classList.remove("hidden");
}

function closeForm(){
document.getElementById("formBox").classList.add("hidden");
}

/* whatsapp */
function sendWhatsApp(){

let name=document.getElementById("name").value;
let phone=document.getElementById("phone").value;
let address=document.getElementById("address").value;

let msg=`طلب جديد من ELGOKER Store 🎁%0A%0A`;

msg+=`الاسم: ${name}%0A`;
msg+=`الهاتف: ${phone}%0A`;
msg+=`العنوان: ${address}%0A%0A`;

let total=0;

Object.keys(cart).forEach(k=>{
let item=cart[k];
let p=products.find(x=>x.id==item.id);

let price=p.price*item.count;
total+=price;

msg+=`- ${p.name} (${item.size}/${item.color}) ×${item.count} = ${price}%0A`;
});

msg+=`%0Aالإجمالي: ${total}`;
msg+=`%0Aالشحن: 70`;
msg+=`%0Aالإجمالي النهائي: ${total+70}`;

window.open(`https://wa.me/201019505549?text=${msg}`);
}

/* init */
render();
updateCart();
updateCartCount();