const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const db = require("../db");

const router = express.Router();
const SECRET = "secret_key";

router.post("/register", async (req, res) => {
  const { email, password } = req.body;

  const hash = await bcrypt.hash(password, 10);

  db.run(
    "INSERT INTO users (email, password) VALUES (?, ?)",
    [email, hash],
    function (err) {
      if (err) {
        return res.status(400).json({ error: "User exists" });
      }

      res.json({ id: this.lastID });
    }
  );
});

router.post("/login", (req, res) => {
  const { email, password } = req.body;

  db.get(
    "SELECT * FROM users WHERE email = ?",
    [email],
    async (err, user) => {
      if (!user) {
        return res.status(400).json({
          error: "Invalid credentials"
        });
      }

      const valid = await bcrypt.compare(
        password,
        user.password
      );

      if (!valid) {
        return res.status(400).json({
          error: "Invalid credentials"
        });
      }

      const token = jwt.sign(
        { id: user.id, email: user.email, role: user.role },
        SECRET,
        { expiresIn: "7d" }
      );

      res.json({ token });
    }
  );
});

module.exports = router;