const express = require("express");
const db = require("../db");

const router = express.Router();

router.get("/products", (req, res) => {
  db.all("SELECT * FROM products", (err, rows) => {
    res.json(rows);
  });
});

module.exports = router;