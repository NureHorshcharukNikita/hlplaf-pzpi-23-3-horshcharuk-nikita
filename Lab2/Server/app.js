const express = require("express");
const cors = require("cors");

const authRoutes = require("./routes/auth");
const productRoutes = require("./routes/products");
const orderRoutes = require("./routes/orders");
const recommendationRoutes = require("./routes/recommendations");

const app = express();

app.use(cors());
app.use(express.json());

app.use(authRoutes);
app.use(productRoutes);
app.use(orderRoutes);
app.use(recommendationRoutes);

app.listen(3000, "0.0.0.0", () => {
  console.log("Server running on port 3000");
});