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

let orders = [];

app.get("/products", (req, res) => {
  res.json(products);
});

app.post("/order", (req, res) => {
  const { items } = req.body;

  if (!items || items.length === 0) {
    return res.status(400).json({
      error: "Cart is empty"
    });
  }

  const total = items.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );

  const order = {
    id: Date.now(),
    items,
    total,
    createdAt: new Date()
  };

  orders.push(order);

  res.json(order);
});

app.get("/orders", (req, res) => {
  res.json(orders);
});

app.listen(3000, "0.0.0.0", () => {
  console.log("Server running on port 3000");
});