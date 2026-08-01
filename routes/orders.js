const express = require('express');
const { getDb } = require('../config/database');
const { authenticateToken } = require('../middleware/auth');

const router = express.Router();

// Create new order (Checkout)
router.post('/', authenticateToken, async (req, res) => {
    const { items, shippingName, shippingAddress, shippingCity, shippingZip, paymentMethod } = req.body;

    if (!items || !Array.isArray(items) || items.length === 0) {
        return res.status(400).json({ error: 'Order cart is empty.' });
    }

    if (!shippingName || !shippingAddress || !shippingCity || !shippingZip) {
        return res.status(400).json({ error: 'Complete shipping information is required.' });
    }

    const db = await getDb();

    try {
        await db.run('BEGIN TRANSACTION');

        let totalAmount = 0;
        const processedItems = [];

        for (const item of items) {
            const product = await db.get('SELECT id, title, price, stock FROM products WHERE id = ?', [item.productId]);

            if (!product) {
                await db.run('ROLLBACK');
                return res.status(400).json({ error: `Product ID ${item.productId} not found.` });
            }

            if (product.stock < item.quantity) {
                await db.run('ROLLBACK');
                return res.status(400).json({ error: `Insufficient stock for "${product.title}". Only ${product.stock} available.` });
            }

            const itemSubtotal = product.price * item.quantity;
            totalAmount += itemSubtotal;

            processedItems.push({
                product_id: product.id,
                title: product.title,
                price: product.price,
                quantity: item.quantity
            });
        }

        // Insert Order record
        const orderResult = await db.run(
            `INSERT INTO orders (user_id, total_amount, status, shipping_name, shipping_address, shipping_city, shipping_zip, payment_method)
             VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
            [
                req.user.id,
                totalAmount,
                'Paid',
                shippingName.trim(),
                shippingAddress.trim(),
                shippingCity.trim(),
                shippingZip.trim(),
                paymentMethod || 'credit_card'
            ]
        );

        const orderId = orderResult.lastID;

        // Insert Order Items and update Product stock
        for (const item of processedItems) {
            await db.run(
                `INSERT INTO order_items (order_id, product_id, quantity, price) VALUES (?, ?, ?, ?)`,
                [orderId, item.product_id, item.quantity, item.price]
            );

            await db.run(
                `UPDATE products SET stock = stock - ? WHERE id = ?`,
                [item.quantity, item.product_id]
            );
        }

        await db.run('COMMIT');

        res.status(201).json({
            message: 'Order processed successfully',
            order: {
                id: orderId,
                total_amount: totalAmount,
                status: 'Paid',
                shippingName,
                shippingAddress,
                shippingCity,
                shippingZip,
                items: processedItems,
                createdAt: new Date().toISOString()
            }
        });
    } catch (error) {
        await db.run('ROLLBACK');
        console.error('Order placement error:', error);
        res.status(500).json({ error: 'Failed to process order checkout.' });
    }
});

// Get user order history
router.get('/', authenticateToken, async (req, res) => {
    try {
        const db = await getDb();
        const orders = await db.all(
            `SELECT * FROM orders WHERE user_id = ? ORDER BY created_at DESC`,
            [req.user.id]
        );

        // Fetch order items for each order
        for (const order of orders) {
            const items = await db.all(
                `SELECT oi.*, p.title as product_title, p.image_url
                 FROM order_items oi
                 JOIN products p ON oi.product_id = p.id
                 WHERE oi.order_id = ?`,
                [order.id]
            );
            order.items = items;
        }

        res.json({ orders });
    } catch (error) {
        console.error('Fetch user orders error:', error);
        res.status(500).json({ error: 'Failed to load order history.' });
    }
});

// Get specific order detail
router.get('/:id', authenticateToken, async (req, res) => {
    try {
        const db = await getDb();
        const order = await db.get(
            `SELECT * FROM orders WHERE id = ? AND user_id = ?`,
            [req.params.id, req.user.id]
        );

        if (!order) {
            return res.status(404).json({ error: 'Order not found.' });
        }

        const items = await db.all(
            `SELECT oi.*, p.title as product_title, p.image_url
             FROM order_items oi
             JOIN products p ON oi.product_id = p.id
             WHERE oi.order_id = ?`,
            [order.id]
        );
        order.items = items;

        res.json({ order });
    } catch (error) {
        console.error('Fetch order detail error:', error);
        res.status(500).json({ error: 'Failed to load order detail.' });
    }
});

module.exports = router;
