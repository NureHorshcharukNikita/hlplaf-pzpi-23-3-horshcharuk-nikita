const express = require("express");
const db = require("../db");
const auth = require("../auth");

const router = express.Router();

router.get("/recommendations", auth, (req, res) => {
  const userId = req.user.id;

  const query = `
    SELECT p.*, SUM(oi.quantity) as score
    FROM order_items oi
    JOIN orders o ON o.id = oi.orderId
    JOIN products p ON p.id = oi.productId
    WHERE o.userId != ?
    GROUP BY oi.productId
    ORDER BY score DESC
    LIMIT 3
  `;

  db.all(query, [userId], (err, rows) => {
    if (err) {
      return res.status(500).json({ error: "DB error" });
    }

    res.json(rows || []);
  });
});

module.exports = router;