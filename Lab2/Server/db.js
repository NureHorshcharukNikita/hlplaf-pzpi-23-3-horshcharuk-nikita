const sqlite3 = require("sqlite3").verbose();
const bcrypt = require("bcryptjs");

const db = new sqlite3.Database("./data/shop.db");

db.serialize(() => {
  // ================= USERS =================
  db.run(`
    CREATE TABLE IF NOT EXISTS users (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      email TEXT UNIQUE NOT NULL,
      password TEXT NOT NULL,
      name TEXT,
      role TEXT DEFAULT 'user',
      createdAt TEXT DEFAULT CURRENT_TIMESTAMP
    )
  `);

  // ================= PRODUCTS =================
  db.run(`
    CREATE TABLE IF NOT EXISTS products (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      price INTEGER NOT NULL,
      description TEXT,
      image TEXT,
      stock INTEGER DEFAULT 0,
      createdAt TEXT DEFAULT CURRENT_TIMESTAMP
    )
  `);

  // ================= ORDERS =================
  db.run(`
    CREATE TABLE IF NOT EXISTS orders (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      userId INTEGER NOT NULL,
      total INTEGER NOT NULL,
      status TEXT DEFAULT 'pending',
      createdAt TEXT DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (userId) REFERENCES users(id)
    )
  `);

  // ================= ORDER ITEMS =================
  db.run(`
    CREATE TABLE IF NOT EXISTS order_items (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      orderId INTEGER NOT NULL,
      productId INTEGER NOT NULL,
      name TEXT NOT NULL,
      price INTEGER NOT NULL,
      quantity INTEGER NOT NULL,
      FOREIGN KEY (orderId) REFERENCES orders(id),
      FOREIGN KEY (productId) REFERENCES products(id)
    )
  `);

  // ================= DEFAULT ADMIN =================
  db.get(
    "SELECT * FROM users WHERE role = 'admin'",
    async (err, row) => {
      if (!row) {
        const hash = await bcrypt.hash("admin123", 10);

        db.run(
          `INSERT INTO users (email, password, role)
          VALUES (?, ?, ?)`,
          ["admin@gmail.com", hash, "admin"]
        );

        console.log("Default admin created");
      }
    }
  );

  // ================= TEST PRODUCTS =================
  db.get(`SELECT COUNT(*) as count FROM products`, (err, row) => {
    if (err) {
      console.error("Error checking products:", err.message);
      return;
    }

    if (row.count === 0) {
      const stmt = db.prepare(`
        INSERT INTO products (name, price, description, image, stock)
        VALUES (?, ?, ?, ?, ?)
      `);

      stmt.run(
        "iPhone 14",
        1000,
        "Apple smartphone",
        "iphone14.jpg",
        10
      );

      stmt.run(
        "Samsung S23",
        900,
        "Samsung flagship smartphone",
        "s23.jpg",
        8
      );

      stmt.run(
        "Xiaomi 13",
        700,
        "Xiaomi smartphone",
        "xiaomi13.jpg",
        15
      );

      stmt.finalize();
    }
  });
});

module.exports = db;