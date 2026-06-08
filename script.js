let cart = [];

/* إضافة للسلة */
function add(name,price){

let item = cart.find(i => i.name === name);

if(item) item.qty++;
else cart.push({name,price,qty:1});

render();
}

/* عرض السلة */
function render(){

let box = document.getElementById("cart");
let total = 0;

box.innerHTML = "";

cart.forEach(i=>{
total += i.price * i.qty;

box.innerHTML += `
<div>
<b>${i.name}</b><br>
${i.price} × ${i.qty}<br>
</div>
`;
});

document.getElementById("total").innerText = total;
}

/* فتح الحجز */
function openOrder(){
document.getElementById("checkout").style.display="flex";
document.getElementById("checkoutTotal").innerText =
document.getElementById("total").innerText;
}

/* إغلاق */
function closeCheckout(){
document.getElementById("checkout").style.display="none";
}

/* واتساب */
function confirmWhatsApp(){

let name=document.getElementById("name").value;
let phone=document.getElementById("phone").value;
let address=document.getElementById("address").value;

if(cart.length===0){
alert("السلة فاضية");
return;
}

let itemsText="";
cart.forEach(i=>{
itemsText+=`- ${i.name} (${i.price} × ${i.qty})\n`;
});

let msg =
`🛒 طلب جديد من ELGOKER\n\n`+
`👤 الاسم: ${name}\n`+
`📞 الهاتف: ${phone}\n`+
`📍 العنوان: ${address}\n\n`+
`📦 المنتجات:\n${itemsText}\n`+
`💰 الإجمالي: ${document.getElementById("total").innerText} ج.م\n`;

let number="201019505549";

window.open(`https://wa.me/${number}?text=${encodeURIComponent(msg)}`);
}

/* إرسال للسيرفر Excel */
function sendToExcel(){

let name=document.getElementById("name").value;
let phone=document.getElementById("phone").value;
let address=document.getElementById("address").value;

fetch("http://localhost:3000/order",{
method:"POST",
headers:{
"Content-Type":"application/json"
},
body:JSON.stringify({
name,
phone,
address,
items:cart,
total:document.getElementById("total").innerText
})
})
.then(res=>res.json())
.then(data=>{
alert("تم حفظ الأوردر في Excel 🧾");

cart=[];
render();
closeCheckout();
});
}