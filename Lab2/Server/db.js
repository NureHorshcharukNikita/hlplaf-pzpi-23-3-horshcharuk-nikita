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

      stmt.run("iPhone 14", 1000, "Apple smartphone", "iphone14.jpg", 10);
      stmt.run("iPhone 15", 1200, "New Apple smartphone", "iphone15.jpg", 12);
      stmt.run("Samsung S23", 900, "Samsung flagship smartphone", "s23.jpg", 8);
      stmt.run("Samsung S24", 1100, "New Samsung flagship smartphone", "s24.jpg", 9);
      stmt.run("Xiaomi 13", 700, "Xiaomi smartphone", "xiaomi13.jpg", 15);
      stmt.run("Xiaomi 14", 850, "New Xiaomi smartphone", "xiaomi14.jpg", 10);
      stmt.run("Google Pixel 8", 950, "Google smartphone", "pixel8.jpg", 7);
      stmt.run("OnePlus 11", 800, "OnePlus flagship smartphone", "oneplus11.jpg", 11);
      stmt.run("MacBook Air M2", 1400, "Apple laptop", "macbookairm2.jpg", 6);
      stmt.run("MacBook Pro M3", 2200, "Apple professional laptop", "macbookprom3.jpg", 4);
      stmt.run("Dell XPS 13", 1300, "Dell ultrabook laptop", "dellxps13.jpg", 5);
      stmt.run("Lenovo ThinkPad X1", 1500, "Business laptop", "thinkpadx1.jpg", 6);
      stmt.run("iPad Air", 800, "Apple tablet", "ipadair.jpg", 10);
      stmt.run("iPad Pro", 1200, "Apple premium tablet", "ipadpro.jpg", 5);
      stmt.run("Samsung Galaxy Tab S9", 900, "Samsung tablet", "tabs9.jpg", 7);
      stmt.run("Apple Watch Series 9", 500, "Apple smartwatch", "watch9.jpg", 14);
      stmt.run("Samsung Galaxy Watch 6", 450, "Samsung smartwatch", "watch6.jpg", 13);
      stmt.run("AirPods Pro 2", 300, "Apple wireless earbuds", "airpodspro2.jpg", 20);
      stmt.run("Sony WH-1000XM5", 400, "Sony noise-cancelling headphones", "sonyxm5.jpg", 9);
      stmt.run("JBL Charge 5", 250, "Portable Bluetooth speaker", "jblcharge5.jpg", 16);

      stmt.finalize();
    }
  });
});

module.exports = db;