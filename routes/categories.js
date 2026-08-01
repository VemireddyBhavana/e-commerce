const express = require('express');
const { getDb } = require('../config/database');

const router = express.Router();

// Get all categories with product counts
router.get('/', async (req, res) => {
    try {
        const db = await getDb();
        const categories = await db.all(`
            SELECT c.*, COUNT(p.id) as product_count
            FROM categories c
            LEFT JOIN products p ON c.id = p.category_id
            GROUP BY c.id
            ORDER BY c.name ASC
        `);

        res.json({ categories });
    } catch (error) {
        console.error('Fetch categories error:', error);
        res.status(500).json({ error: 'Failed to load categories.' });
    }
});

module.exports = router;
