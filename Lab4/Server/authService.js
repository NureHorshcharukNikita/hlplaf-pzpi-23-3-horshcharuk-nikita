const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { User } = require("./database");

const JWT_SECRET = process.env.JWT_SECRET || "lab4-secret-key";

function publicUser(user) {
  return {
    id: user.id,
    name: user.name,
    email: user.email,
    role: user.role
  };
}

function signToken(user) {
  return jwt.sign(publicUser(user), JWT_SECRET, { expiresIn: "8h" });
}

async function registerUser(payload) {
  const name = String(payload.name || "").trim();
  const email = String(payload.email || "").trim().toLowerCase();
  const password = String(payload.password || "");

  if (!name || !email || password.length < 4) {
    const error = new Error("Name, valid email and password from 4 chars are required");
    error.status = 400;
    throw error;
  }

  const existing = await User.findOne({ where: { email } });

  if (existing) {
    const error = new Error("User with this email already exists");
    error.status = 409;
    throw error;
  }

  const user = await User.create({
    name,
    email,
    password: await bcrypt.hash(password, 10),
    role: "user"
  });

  return {
    token: signToken(user),
    user: publicUser(user)
  };
}

async function loginUser(payload) {
  const email = String(payload.email || "").trim().toLowerCase();
  const password = String(payload.password || "");
  const user = await User.findOne({ where: { email } });

  if (!user || !(await bcrypt.compare(password, user.password))) {
    const error = new Error("Invalid email or password");
    error.status = 401;
    throw error;
  }

  return {
    token: signToken(user),
    user: publicUser(user)
  };
}

module.exports = {
  JWT_SECRET,
  publicUser,
  registerUser,
  loginUser
};
