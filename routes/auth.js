const express = require('express');
const { getDb } = require('../config/database');
const { authenticateToken } = require('../middleware/auth');

const router = express.Router();

/**
 * GET /api/auth/me
 * Returns the current logged-in user's profile from SQLite.
 * Firebase Auth handles login/register — this just retrieves stored user info.
 */
router.get('/me', authenticateToken, async (req, res) => {
    try {
        const db = await getDb();
        const user = await db.get(
            'SELECT id, firebase_uid, name, email, role, created_at FROM users WHERE id = ?',
            [req.user.id]
        );

        if (!user) {
            return res.status(404).json({ error: 'User not found.' });
        }

        res.json({ user });
    } catch (error) {
        console.error('Fetch user error:', error);
        res.status(500).json({ error: 'Server error fetching user profile.' });
    }
});

module.exports = router;
