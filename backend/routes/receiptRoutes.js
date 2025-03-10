const express = require("express");
const multer = require("multer");
const { Client } = require("pg");
const dotenv = require("dotenv");
const path = require("path");

dotenv.config();
const router = express.Router();
const client = new Client({ connectionString: process.env.DATABASE_URL });
client.connect();

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, "uploads/");
    },
    filename: (req, file, cb) => {
        cb(null, Date.now() + path.extname(file.originalname)); 
    }
});
const upload = multer({ storage });

client.query(`
    CREATE TABLE IF NOT EXISTS receipts (
        id SERIAL PRIMARY KEY,
        filename TEXT NOT NULL,
        uploaded_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );
    CREATE TABLE IF NOT EXISTS extracted_items (
        id SERIAL PRIMARY KEY,
        receipt_id INTEGER REFERENCES receipts(id) ON DELETE CASCADE,
        name TEXT NOT NULL,
        quantity TEXT NOT NULL,
        unit TEXT NOT NULL
    );
`);

router.post("/", upload.single("receipt"), async (req, res) => {
    try {
        const filename = req.file.filename;
        const { items } = req.body;

        const receiptResult = await client.query(
            "INSERT INTO receipts (filename) VALUES ($1) RETURNING id",
            [filename]
        );
        const receiptId = receiptResult.rows[0].id;

        const itemQueries = items.map(item =>
            client.query(
                "INSERT INTO extracted_items (receipt_id, name, quantity, unit) VALUES ($1, $2, $3, $4)",
                [receiptId, item.name, item.quantity, item.unit]
            )
        );
        await Promise.all(itemQueries);

        res.json({ message: "Receipt uploaded & data saved!", receiptId });
    } catch (error) {
        console.error("Error storing receipt:", error);
        res.status(500).json({ message: "Error saving receipt data" });
    }
});

router.get("/", async (req, res) => {
    try {
        const result = await client.query("SELECT * FROM receipts ORDER BY uploaded_at DESC");
        res.json(result.rows);
    } catch (error) {
        console.error("Error fetching receipts:", error);
        res.status(500).json({ message: "Error fetching receipts" });
    }
});

router.get("/:id/items", async (req, res) => {
    try {
        const result = await client.query("SELECT * FROM extracted_items WHERE receipt_id = $1", [
            req.params.id
        ]);
        res.json(result.rows);
    } catch (error) {
        console.error("Error fetching items:", error);
        res.status(500).json({ message: "Error fetching extracted items" });
    }
});

module.exports = router;

