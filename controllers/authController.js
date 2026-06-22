const bcrypt = require("bcrypt");
const { getDB } = require("../db/db");
const { generateToken } = require("../utils/jwt");

const registerUser = async (req, res) => {
  const db = getDB();
  const { name, email, password } = req.body;

  if (!name || !email || !password) {
    return res.status(400).json({
      message: "All fields are required",
    });
  }

  try {
    const [existingUser] = await db.query(
      `SELECT * FROM users WHERE email = ?`,
      [email],
    );

    if (existingUser.length > 0) {
      return res.status(400).json({
        message: "Email already exists",
      });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const [result] = await db.query(
      `INSERT INTO users (name, email, password) VALUES (?, ?, ?)`,
      [name, email, hashedPassword],
    );

    const token = generateToken({ userId: result.insertId });

    return res.status(201).json({
      message: "User registered successfully",
      token,
    });
  } catch (error) {
    console.log("ERROR from backend:", error);
    return res.status(500).json({
      message: "Server Error",
    });
  }
};

const loginUser = async (req, res) => {
  const db = getDB();
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({
      message: "All fields are required",
    });
  }

  try {
    const [rows] = await db.query(`SELECT * FROM users WHERE email = ?`, [
      email,
    ]);

    if (rows.length === 0) {
      return res.status(401).json({
        message: "Invalid credentials",
      });
    }

    const user = rows[0];

    const isMatched = await bcrypt.compare(password, user.password);

    if (!isMatched) {
      return res.status(401).json({
        message: "Invalid credentials",
      });
    }

    const token = generateToken({ userId: user.id });

    return res.status(200).json({
      message: "Login successful",
      token,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      message: "Server Error",
    });
  }
};

module.exports = { registerUser, loginUser };
