const express = require("express");
const db = require("../db");

const router = express.Router();

router.get("/products", (req, res) => {
  const limit = Number(req.query.limit) || 6;
  const offset = Number(req.query.offset) || 0;

  db.all(
    "SELECT * FROM products LIMIT ? OFFSET ?",
    [limit, offset],
    (err, rows) => {
      if (err) {
        return res.status(500).json({ error: "Database error" });
      }

      db.get(
        "SELECT COUNT(*) as total FROM products",
        (countErr, countRow) => {
          if (countErr) {
            return res.status(500).json({ error: "Database error" });
          }

          res.json({
            items: rows,
            total: countRow.total
          });
        }
      );
    }
  );
});

module.exports = router;