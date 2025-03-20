const express = require("express");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { Client } = require("pg");
const dotenv = require("dotenv");

dotenv.config();
const router = express.Router();
const client = new Client({ connectionString: process.env.DATABASE_URL });
client.connect();

const JWT_SECRET = process.env.JWT_SECRET || "Gadhave232003";

router.post("/signup", async (req, res) => {
    const { username, email, password } = req.body;
    if (!username || !email || !password) {
        return res.status(400).json({ message: "Missing required fields" });
    }
    try {
        const hashedPassword = await bcrypt.hash(password, 10);
        const result = await client.query(
            "INSERT INTO users (username, email, password) VALUES ($1, $2, $3) RETURNING id, username, email",
            [username, email, hashedPassword]
        );
        const user = result.rows[0];
        const token = jwt.sign({ id: user.id }, JWT_SECRET, { expiresIn: "1h" });
        res.status(201).json({ user, token });
    } catch (error) {
        console.error("Signup error:", error);
        res.status(500).json({ message: "Error signing up" });
    }
});

router.post("/login", async (req, res) => {
    const { email, password } = req.body;
    if (!email || !password) {
        return res.status(400).json({ message: "Missing email or password" });
    }
    try {
        const result = await client.query("SELECT * FROM users WHERE email = $1", [email]);
        if (result.rows.length === 0) {
            return res.status(401).json({ message: "Invalid credentials" });
        }
        const user = result.rows[0];
        const isValid = await bcrypt.compare(password, user.password);
        if (!isValid) {
            return res.status(401).json({ message: "Invalid credentials" });
        }
        const token = jwt.sign({ id: user.id }, JWT_SECRET, { expiresIn: "1h" });
        res.json({ user: { id: user.id, username: user.username, email: user.email }, token });
    } catch (error) {
        console.error("Login error:", error);
        res.status(500).json({ message: "Error logging in" });
    }
});

module.exports = router;
