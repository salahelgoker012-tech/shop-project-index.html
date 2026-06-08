const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const XLSX = require("xlsx");
const fs = require("fs");

const app = express();

app.use(cors());
app.use(bodyParser.json());

const FILE = "orders.xlsx";

/* إنشاء ملف لو مش موجود */
function init(){
if(!fs.existsSync(FILE)){
let wb = XLSX.utils.book_new();
let ws = XLSX.utils.json_to_sheet([]);
XLSX.utils.book_append_sheet(wb, ws, "Orders");
XLSX.writeFile(wb, FILE);
}
}

init();

/* استقبال الطلب */
app.post("/order",(req,res)=>{

let order = req.body;

let wb = XLSX.readFile(FILE);
let ws = wb.Sheets["Orders"];

let data = XLSX.utils.sheet_to_json(ws);

data.push({
Name:order.name,
Phone:order.phone,
Address:order.address,
Items:JSON.stringify(order.items),
Total:order.total,
Date:new Date().toLocaleString()
});

let newWs = XLSX.utils.json_to_sheet(data);

wb.Sheets["Orders"] = newWs;

XLSX.writeFile(wb, FILE);

res.send({status:"ok"});
});

app.listen(3000,()=>{
console.log("Server running on http://localhost:3000");
});