const express = require('express');
const router = express.Router();
const { Client } = require('pg');

const client = new Client({
    connectionString: process.env.DATABASE_URL,
});
client.connect();

router.get('/', async (req, res) => {
    try {
        const result = await client.query('SELECT * FROM pantry');
        res.json(result.rows);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Error fetching pantry items" });
    }
});

router.post('/', async (req, res) => {
    const { name, quantity, unit } = req.body;
    if (!name || !quantity || !unit) {
        return res.status(400).json({ message: "All fields are required" });
    }
    try {
        const result = await client.query(
            'INSERT INTO pantry (name, quantity, unit) VALUES ($1, $2, $3) RETURNING *',
            [name, quantity, unit]
        );
        res.status(201).json(result.rows[0]);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Error adding item to pantry" });
    }
});

router.put('/:id', async (req, res) => {
    const { id } = req.params;
    const { name, quantity, unit } = req.body;

    try {
        const result = await client.query(
            'UPDATE pantry SET name = $1, quantity = $2, unit = $3 WHERE id = $4 RETURNING *',
            [name, quantity, unit, id]
        );
        if (result.rows.length === 0) {
            return res.status(404).json({ message: "Item not found" });
        }
        res.json(result.rows[0]);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Error updating pantry item" });
    }
});

router.delete('/:id', async (req, res) => {
    const { id } = req.params;
    try {
        const result = await client.query('DELETE FROM pantry WHERE id = $1 RETURNING *', [id]);
        if (result.rows.length === 0) {
            return res.status(404).json({ message: "Item not found" });
        }
        res.json({ message: "Item deleted successfully" });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Error deleting pantry item" });
    }
});

module.exports = router;
