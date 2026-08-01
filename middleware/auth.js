const { getAuth } = require('../config/firebase-admin');
const { getDb } = require('../config/database');

/**
 * Firebase Auth middleware — verifies Firebase ID Token sent from frontend.
 * On success, auto-creates or retrieves the user record in SQLite.
 * Sets req.user = { id, firebaseUid, name, email, role }
 */
async function authenticateToken(req, res, next) {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    if (!token) {
        return res.status(401).json({ error: 'Access token required. Please sign in.' });
    }

    try {
        // Verify Firebase ID token (signed by Google)
        const decoded = await getAuth().verifyIdToken(token);
        const db = await getDb();

        // Look up user in SQLite by Firebase UID
        let user = await db.get('SELECT * FROM users WHERE firebase_uid = ?', [decoded.uid]);

        if (!user) {
            // Auto-create user record in SQLite on first login
            const name = decoded.name || (decoded.email ? decoded.email.split('@')[0] : 'User');
            const result = await db.run(
                'INSERT INTO users (firebase_uid, name, email, role) VALUES (?, ?, ?, ?)',
                [decoded.uid, name, decoded.email, 'customer']
            );
            user = {
                id: result.lastID,
                firebase_uid: decoded.uid,
                name,
                email: decoded.email,
                role: 'customer'
            };
        }

        req.user = {
            id: user.id,
            firebaseUid: user.firebase_uid,
            name: user.name,
            email: user.email,
            role: user.role
        };

        next();
    } catch (error) {
        console.error('Firebase token verification failed:', error.message);
        return res.status(403).json({ error: 'Session expired or invalid token. Please sign in again.' });
    }
}

/**
 * Optional auth — attaches req.user if valid token present, but doesn't block.
 */
async function optionalToken(req, res, next) {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    if (!token) return next();

    try {
        const decoded = await getAuth().verifyIdToken(token);
        const db = await getDb();
        const user = await db.get('SELECT * FROM users WHERE firebase_uid = ?', [decoded.uid]);
        if (user) {
            req.user = { id: user.id, firebaseUid: user.firebase_uid, name: user.name, email: user.email, role: user.role };
        }
    } catch (_) {
        // Token invalid — proceed without user
    }
    next();
}

module.exports = { authenticateToken, optionalToken };
