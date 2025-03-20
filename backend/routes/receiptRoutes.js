const express = require("express");
const multer = require("multer");
const { Client } = require("pg");
const dotenv = require("dotenv");
const path = require("path");
const fs = require("fs");

dotenv.config();
const router = express.Router();
const client = new Client({ connectionString: process.env.DATABASE_URL });
client.connect();

const UPLOADS_DIR = "uploads";
if (!fs.existsSync(UPLOADS_DIR)) {
    fs.mkdirSync(UPLOADS_DIR);
}

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, UPLOADS_DIR);
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
        if (!req.file) {
            return res.status(400).json({ message: "No receipt file uploaded" });
        }

        const filename = req.file.filename;
        const items = req.body.items ? JSON.parse(req.body.items) : [];

        const receiptResult = await client.query(
            "INSERT INTO receipts (filename) VALUES ($1) RETURNING id",
            [filename]
        );
        const receiptId = receiptResult.rows[0].id;

        if (items.length > 0) {
            const itemQueries = items.map(item =>
                client.query(
                    "INSERT INTO extracted_items (receipt_id, name, quantity, unit) VALUES ($1, $2, $3, $4)",
                    [receiptId, item.name, item.quantity, item.unit]
                )
            );
            await Promise.all(itemQueries);
        }

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
        console.error("Error fetching extracted items:", error);
        res.status(500).json({ message: "Error fetching extracted items" });
    }
});

router.delete("/:id", async (req, res) => {
    try {
        const result = await client.query("SELECT filename FROM receipts WHERE id = $1", [req.params.id]);
        if (result.rows.length === 0) {
            return res.status(404).json({ message: "Receipt not found" });
        }

        const filename = result.rows[0].filename;
        const filePath = path.join(__dirname, "../uploads", filename);

        if (fs.existsSync(filePath)) {
            fs.unlinkSync(filePath);
        }

        await client.query("DELETE FROM receipts WHERE id = $1", [req.params.id]);

        res.json({ message: "Receipt deleted successfully" });
    } catch (error) {
        console.error("Error deleting receipt:", error);
        res.status(500).json({ message: "Error deleting receipt" });
    }
});

module.exports = router;