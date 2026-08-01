const express = require('express');
const { getDb } = require('../config/database');

const router = express.Router();

// Get list of products with search, filter, and pagination
router.get('/', async (req, res) => {
    try {
        const { category, q, minPrice, maxPrice, minRating, sortBy, page = 1, limit = 12 } = req.query;

        const db = await getDb();
        let query = `
            SELECT p.*, c.name as category_name, c.slug as category_slug 
            FROM products p 
            LEFT JOIN categories c ON p.category_id = c.id
            WHERE 1=1
        `;
        const params = [];

        if (category) {
            query += ` AND c.slug = ?`;
            params.push(category);
        }

        if (q) {
            query += ` AND (p.title LIKE ? OR p.description LIKE ?)`;
            params.push(`%${q}%`, `%${q}%`);
        }

        if (minPrice) {
            query += ` AND p.price >= ?`;
            params.push(Number(minPrice));
        }

        if (maxPrice) {
            query += ` AND p.price <= ?`;
            params.push(Number(maxPrice));
        }

        if (minRating) {
            query += ` AND p.rating >= ?`;
            params.push(Number(minRating));
        }

        // Sorting logic
        if (sortBy === 'price_asc') {
            query += ` ORDER BY p.price ASC`;
        } else if (sortBy === 'price_desc') {
            query += ` ORDER BY p.price DESC`;
        } else if (sortBy === 'rating') {
            query += ` ORDER BY p.rating DESC`;
        } else {
            query += ` ORDER BY p.created_at DESC`;
        }

        // Pagination
        const offset = (Number(page) - 1) * Number(limit);
        query += ` LIMIT ? OFFSET ?`;
        params.push(Number(limit), Number(offset));

        const products = await db.all(query, params);

        // Get total count for pagination metadata
        let countQuery = `
            SELECT COUNT(*) as total 
            FROM products p 
            LEFT JOIN categories c ON p.category_id = c.id
            WHERE 1=1
        `;
        const countParams = [];
        if (category) { countQuery += ` AND c.slug = ?`; countParams.push(category); }
        if (q) { countQuery += ` AND (p.title LIKE ? OR p.description LIKE ?)`; countParams.push(`%${q}%`, `%${q}%`); }
        if (minPrice) { countQuery += ` AND p.price >= ?`; countParams.push(Number(minPrice)); }
        if (maxPrice) { countQuery += ` AND p.price <= ?`; countParams.push(Number(maxPrice)); }
        if (minRating) { countQuery += ` AND p.rating >= ?`; countParams.push(Number(minRating)); }

        const totalResult = await db.get(countQuery, countParams);
        const total = totalResult ? totalResult.total : 0;

        res.json({
            products,
            pagination: {
                total,
                page: Number(page),
                limit: Number(limit),
                pages: Math.ceil(total / Number(limit))
            }
        });
    } catch (error) {
        console.error('Fetch products error:', error);
        res.status(500).json({ error: 'Failed to fetch products.' });
    }
});

// Get single product details by ID
router.get('/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const db = await getDb();

        const product = await db.get(`
            SELECT p.*, c.name as category_name, c.slug as category_slug
            FROM products p
            LEFT JOIN categories c ON p.category_id = c.id
            WHERE p.id = ?
        `, [id]);

        if (!product) {
            return res.status(404).json({ error: 'Product not found.' });
        }

        res.json({ product });
    } catch (error) {
        console.error('Fetch product detail error:', error);
        res.status(500).json({ error: 'Failed to fetch product details.' });
    }
});

module.exports = router;
