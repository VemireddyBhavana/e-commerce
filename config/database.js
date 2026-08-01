const sqlite3 = require('sqlite3').verbose();
const { open } = require('sqlite');
const path = require('path');
const fs = require('fs');

const DB_PATH = path.join(__dirname, '../data/ecommerce.db');

// Ensure data directory exists
const dataDir = path.dirname(DB_PATH);
if (!fs.existsSync(dataDir)) {
    fs.mkdirSync(dataDir, { recursive: true });
}

let dbInstance = null;

async function getDb() {
    if (!dbInstance) {
        dbInstance = await open({
            filename: DB_PATH,
            driver: sqlite3.Database
        });
        await dbInstance.run('PRAGMA foreign_keys = ON');
    }
    return dbInstance;
}

async function initDatabase() {
    const db = await getDb();
    try {
        // Check if products table exists
        const tableCheck = await db.get("SELECT name FROM sqlite_master WHERE type='table' AND name='products'");
        if (!tableCheck) {
            console.log('⚠️ Database tables not found. Automatically initializing and seeding database...');
            const seed = require('../db/seed');
            await seed();
            console.log('✅ Database automatically initialized and seeded!');
        } else {
            // Check if products table has data
            const productCount = await db.get("SELECT COUNT(*) as count FROM products");
            if (productCount.count === 0) {
                console.log('⚠️ Database is empty. Automatically seeding database...');
                const seed = require('../db/seed');
                await seed();
                console.log('✅ Database automatically seeded!');
            }
        }
    } catch (error) {
        console.error('❌ Error during automatic database initialization:', error);
    }
}

module.exports = { getDb, DB_PATH, initDatabase };
