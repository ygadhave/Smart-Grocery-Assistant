const express = require("express");
const router = express.Router();
const { Client } = require("pg");
const requireAuth = require("../middleware/auth");

const client = new Client({
    connectionString: process.env.DATABASE_URL,
});
client.connect();

router.get("/", requireAuth, async (req, res) => {
    try {
        const result = await client.query(
            "SELECT * FROM pantry WHERE user_id = $1",
            [req.user.id]
        );
        res.json(result.rows);
    } catch (error) {
        console.error("Error fetching pantry items:", error);
        res.status(500).json({ message: "Error fetching pantry items" });
    }
});

router.post("/", requireAuth, async (req, res) => {
    const { name, quantity, unit } = req.body;
    if (!name || !quantity || !unit) {
        return res.status(400).json({ message: "All fields are required" });
    }
    try {
        const result = await client.query(
            "INSERT INTO pantry (name, quantity, unit, user_id) VALUES ($1, $2, $3, $4) RETURNING *",
            [name, quantity, unit, req.user.id]
        );
        res.status(201).json(result.rows[0]);
    } catch (error) {
        console.error("Error adding item to pantry:", error);
        res.status(500).json({ message: "Error adding item to pantry" });
    }
});

router.put("/:id", requireAuth, async (req, res) => {
    const { id } = req.params;
    const { name, quantity, unit } = req.body;
    try {
        const result = await client.query(
            `UPDATE pantry
             SET name = $1, quantity = $2, unit = $3
             WHERE id = $4 AND user_id = $5
             RETURNING *`,
            [name, quantity, unit, id, req.user.id]
        );
        if (result.rows.length === 0) {
            return res.status(404).json({ message: "Item not found or not yours" });
        }
        res.json(result.rows[0]);
    } catch (error) {
        console.error("Error updating pantry item:", error);
        res.status(500).json({ message: "Error updating pantry item" });
    }
});

router.delete("/:id", requireAuth, async (req, res) => {
    const { id } = req.params;
    try {
        const result = await client.query(
            "DELETE FROM pantry WHERE id = $1 AND user_id = $2 RETURNING *",
            [id, req.user.id]
        );
        if (result.rows.length === 0) {
            return res.status(404).json({ message: "Item not found or not yours" });
        }
        res.json({ message: "Item deleted successfully" });
    } catch (error) {
        console.error("Error deleting pantry item:", error);
        res.status(500).json({ message: "Error deleting pantry item" });
    }
});

module.exports = router;
