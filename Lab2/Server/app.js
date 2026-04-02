const express = require("express");
const cors = require("cors");

const app = express();

app.use(cors());
app.use(express.json());

const products = [
  { id: 1, name: "iPhone 14", price: 1000 },
  { id: 2, name: "Samsung S23", price: 900 },
  { id: 3, name: "Xiaomi 13", price: 700 }
];

app.get("/products", (req, res) => {
  res.json(products);
});

app.listen(3000, "0.0.0.0", () => {
  console.log("Server running on port 3000");
});