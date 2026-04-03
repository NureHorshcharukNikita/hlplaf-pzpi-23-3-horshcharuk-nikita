const express = require("express");
const db = require("../db");
const auth = require("../auth");

const router = express.Router();

router.post("/order", auth, (req, res) => {
  const { items } = req.body;

  const total = items.reduce(
    (sum, item) =>
      sum + Number(item.price) * Number(item.quantity),
    0
  );

  db.run(
    `INSERT INTO orders (userId, total, status)
     VALUES (?, ?, ?)`,
    [req.user.id, total, "pending"],
    function (err) {
      if (err) {
        return res.status(500).json({
          error: "Failed to create order"
        });
      }

      const orderId = this.lastID;

      const stmt = db.prepare(`
        INSERT INTO order_items
        (orderId, productId, name, price, quantity)
        VALUES (?, ?, ?, ?, ?)
      `);

      items.forEach(item => {
        stmt.run(
          orderId,
          Number(item.id),
          item.name,
          Number(item.price),
          Number(item.quantity)
        );
      });

      stmt.finalize((err) => {
        if (err) {
          return res.status(500).json({
            error: "Failed to save items"
          });
        }

        res.json({
          id: orderId,
          total,
          status: "pending",
          items
        });
      });
    }
  );
});

router.get("/orders", auth, (req, res) => {
  const isAdmin = req.user.role === "admin";

  const query = `
    SELECT
      o.id AS orderId,
      o.total AS orderTotal,
      o.status AS orderStatus,
      o.userId AS userId,
      u.email AS userEmail,
      oi.productId AS productId,
      oi.name AS itemName,
      oi.price AS itemPrice,
      oi.quantity AS itemQuantity
    FROM orders o
    LEFT JOIN order_items oi ON o.id = oi.orderId
    LEFT JOIN users u ON u.id = o.userId
    ${isAdmin ? "" : "WHERE o.userId = ?"}
    ORDER BY o.id DESC
    `;

  const params = isAdmin ? [] : [req.user.id];

  db.all(query, params, (err, rows) => {
    if (err) {
      return res.status(500).json({ error: "Database error" });
    }

    const orders = {};

    rows.forEach((row) => {
      if (!orders[row.orderId]) {
        orders[row.orderId] = {
          id: row.orderId,
          total: row.orderTotal,
          status: row.orderStatus,
          userId: row.userId,
          userEmail: row.userEmail,
          items: []
        };
      }

      if (row.productId) {
        orders[row.orderId].items.push({
          productId: row.productId,
          name: row.itemName,
          price: row.itemPrice,
          quantity: row.itemQuantity
        });
      }
    });

    const result = Object.values(orders).sort(
      (a, b) => b.id - a.id
    );

    res.json(result);
  });
});


router.patch("/orders/:id/status", auth, (req, res) => {
  const { status } = req.body;
  const orderId = req.params.id;

  db.run(
    "UPDATE orders SET status = ? WHERE id = ?",
    [status, orderId],
    (err) => {
      if (err) {
        return res.status(500).json({
          error: "Update failed"
        });
      }

      res.json({ success: true });
    }
  );
});

module.exports = router;