const jwt = require("jsonwebtoken");
const { JWT_SECRET } = require("./authService");

function requireAuth(req, res, next) {
  const header = req.header("authorization") || "";
  const token = header.startsWith("Bearer ") ? header.slice(7) : "";

  if (!token) {
    res.status(401).json({ message: "Authentication required" });
    return;
  }

  try {
    req.user = jwt.verify(token, JWT_SECRET);
    next();
  } catch (error) {
    res.status(401).json({ message: "Invalid or expired token" });
  }
}

function requireAdmin(req, res, next) {
  requireAuth(req, res, () => {
    if (req.user?.role === "admin") {
      next();
      return;
    }

    res.status(403).json({ message: "Admin access required" });
  });
}

module.exports = {
  requireAuth,
  requireAdmin
};
