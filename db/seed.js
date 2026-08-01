const fs = require('fs');
const path = require('path');
const { getDb } = require('../config/database');

async function seed() {
    console.log('Initializing database schema...');
    const db = await getDb();

    // Read and run schema.sql
    const schemaPath = path.join(__dirname, 'schema.sql');
    const schemaSql = fs.readFileSync(schemaPath, 'utf8');
    await db.exec(schemaSql);

    console.log('Clearing existing product/category data...');
    await db.run('PRAGMA foreign_keys = OFF');
    await db.run('DELETE FROM order_items');
    await db.run('DELETE FROM orders');
    await db.run('DELETE FROM products');
    await db.run('DELETE FROM categories');
    // NOTE: Do NOT clear users — real Firebase users are created via Auth, not seeded
    await db.run('DELETE FROM sqlite_sequence WHERE name IN ("order_items","orders","products","categories")');
    await db.run('PRAGMA foreign_keys = ON');

    console.log('Seeding Luxe categories...');
    const categories = [
        { name: 'Men', slug: 'men', description: 'Premium menswear, tailored shirts, denims, and knitwear.', image_url: 'https://images.unsplash.com/photo-1492562080023-ab3db95bfbce?auto=format&fit=crop&w=600&q=80' },
        { name: 'Women', slug: 'women', description: 'Elegant dresses, silk blouses, cashmere, and designer styles.', image_url: 'https://images.unsplash.com/photo-1595777457583-95e059d581b8?auto=format&fit=crop&w=600&q=80' },
        { name: 'Kids', slug: 'kids', description: 'Comfortable, durable, and playful everyday outfits.', image_url: 'https://images.unsplash.com/photo-1519238263530-99bdd1102efd?auto=format&fit=crop&w=600&q=80' },
        { name: 'Accessories', slug: 'accessories', description: 'Fine leather goods, designer watches, and essential accents.', image_url: 'https://images.unsplash.com/photo-1522312346375-d1a52e2b99b3?auto=format&fit=crop&w=600&q=80' }
    ];

    const categoryMap = {};
    for (const cat of categories) {
        const result = await db.run(
            `INSERT INTO categories (name, slug, description, image_url) VALUES (?, ?, ?, ?)`,
            [cat.name, cat.slug, cat.description, cat.image_url]
        );
        categoryMap[cat.name] = result.lastID;
    }

    console.log('Seeding Luxe products...');
    const products = [
        // Men's Section
        {
            title: 'Classic Oxford Cotton Shirt',
            description: 'A timeless staple crafted from long-staple organic cotton. Features a relaxed button-down collar, tailored fit, and breathable oxford weave. Perfect for business casual or weekend styling.',
            price: 2499,
            original_price: 3499,
            stock: 25,
            category_id: categoryMap['Men'],
            image_url: 'https://images.unsplash.com/photo-1596755094514-f87e34085b2c?auto=format&fit=crop&w=600&q=80',
            rating: 4.7
        },
        {
            title: 'Slim Fit Stretch Chinos',
            description: 'Crafted with mid-weight stretch cotton twill for everyday flexibility. Tailored through the thigh with a clean taper. Finished with premium button closure and reinforced deep pockets.',
            price: 2999,
            original_price: 3999,
            stock: 20,
            category_id: categoryMap['Men'],
            image_url: 'https://images.unsplash.com/photo-1624378439575-d8705ad7ae80?auto=format&fit=crop&w=600&q=80',
            rating: 4.6
        },
        {
            title: 'Premium Knit Crewneck Sweater',
            description: 'Spun from soft extra-fine merino wool. Designed with classic ribbed trims, double-layer collar, and a modern drape. Warm yet exceptionally lightweight for multi-season layering.',
            price: 3499,
            original_price: 4999,
            stock: 15,
            category_id: categoryMap['Men'],
            image_url: 'https://images.unsplash.com/photo-1614975058789-41316d0e2e9c?auto=format&fit=crop&w=600&q=80',
            rating: 4.8
        },
        {
            title: 'Vintage Washed Denim Jacket',
            description: 'Premium 13oz rigid denim with a rugged, pre-washed indigo texture. Features buttoned chest pockets, side welt handwarmers, and adjustable waist tabs. Builds character and patina over time.',
            price: 4599,
            original_price: 5999,
            stock: 12,
            category_id: categoryMap['Men'],
            image_url: 'https://images.unsplash.com/photo-1576995853123-5a10305d93c0?auto=format&fit=crop&w=600&q=80',
            rating: 4.9
        },
        {
            title: 'Urban Hooded Windbreaker',
            description: 'Weatherproof high-density nylon shell. Equipped with adjustable toggle hood, zippered side security pockets, and breathable mesh lining. Folds compactly for dynamic commutes.',
            price: 3999,
            original_price: 5499,
            stock: 18,
            category_id: categoryMap['Men'],
            image_url: 'https://images.unsplash.com/photo-1548883354-7622d03aca27?auto=format&fit=crop&w=600&q=80',
            rating: 4.5
        },

        // Women's Section
        {
            title: 'Silk A-Line Midi Dress',
            description: 'A luxurious fluid silhouette crafted from authentic mulberry silk. Elegant split crewneck, matching self-tie belt, and gentle A-line sweep. A statement piece for formal and evening wear.',
            price: 5499,
            original_price: 7999,
            stock: 15,
            category_id: categoryMap['Women'],
            image_url: 'https://images.unsplash.com/photo-1595777457583-95e059d581b8?auto=format&fit=crop&w=600&q=80',
            rating: 4.8
        },
        {
            title: 'High-Waist Tailored Trousers',
            description: 'Sharp pressed pleats and wide leg profile. Breathable linen-blend fabric with a structured contour waistband. Adapts perfectly from morning presentations to casual dining.',
            price: 3299,
            original_price: 4499,
            stock: 22,
            category_id: categoryMap['Women'],
            image_url: 'https://images.unsplash.com/photo-1594633312681-425c7b97ccd1?auto=format&fit=crop&w=600&q=80',
            rating: 4.5
        },
        {
            title: 'Oversized Cashmere Cardigan',
            description: 'Plush Grade-A cashmere knit with a cozy relaxed fit. Features dropped shoulder seams, tortoiseshell horn button details, and rib cuffs. Softest feel for chilly winter days.',
            price: 6999,
            original_price: 9999,
            stock: 10,
            category_id: categoryMap['Women'],
            image_url: 'https://images.unsplash.com/photo-1583743814966-8936f5b7be1a?auto=format&fit=crop&w=600&q=80',
            rating: 4.9
        },
        {
            title: 'Classic Belted Trench Coat',
            description: 'Double-breasted timeless silhouette crafted from water-resistant gabardine cotton. Classic epaulets, gun flap, and adjustable wrist buckles. Fully lined with signature checked print.',
            price: 8999,
            original_price: 12999,
            stock: 8,
            category_id: categoryMap['Women'],
            image_url: 'https://images.unsplash.com/photo-1591047139829-d91aecb6caea?auto=format&fit=crop&w=600&q=80',
            rating: 4.9
        },
        {
            title: 'Linen Wrap Crop Top',
            description: '100% natural pre-shrunk linen wrap top. Features a flattering V-neck, adjustable long ties, and a chic cropped profile. Breathable, breezy, and perfect for hot summer days.',
            price: 1899,
            original_price: 2499,
            stock: 30,
            category_id: categoryMap['Women'],
            image_url: 'https://images.unsplash.com/photo-1539008885128-4034762c2f60?auto=format&fit=crop&w=600&q=80',
            rating: 4.4
        },

        // Kids' Section
        {
            title: 'Denim Dungarees & Tee Set',
            description: 'Cute, classic denim dungarees paired with a soft striped cotton tee. Features adjustable suspenders, functional cargo pockets, and snap button closures for easy changing.',
            price: 1999,
            original_price: 2999,
            stock: 35,
            category_id: categoryMap['Kids'],
            image_url: 'https://images.unsplash.com/photo-1519238263530-99bdd1102efd?auto=format&fit=crop&w=600&q=80',
            rating: 4.6
        },
        {
            title: 'Cozy Fleece Pajama Set',
            description: 'Ultra-soft fleece warm pajamas with funny character prints. Snug-fitting cuffs, elastic comfort waistband, and breathable thermal weave to keep kids cozy all night long.',
            price: 1499,
            original_price: 1999,
            stock: 40,
            category_id: categoryMap['Kids'],
            image_url: 'https://images.unsplash.com/photo-1503919545889-aef636e10ad4?auto=format&fit=crop&w=600&q=80',
            rating: 4.7
        },
        {
            title: 'Waterproof Hooded Puffer Jacket',
            description: 'Windproof, thickly padded down alternative insulation puffer jacket. Complete with cozy fleece-lined hood, safety zipper guard, and bright high-visibility piping.',
            price: 2999,
            original_price: 4499,
            stock: 20,
            category_id: categoryMap['Kids'],
            image_url: 'https://images.unsplash.com/photo-1617137968427-85924c800a22?auto=format&fit=crop&w=600&q=80',
            rating: 4.8
        },
        {
            title: 'Graphic Printed Cotton Tee',
            description: 'Breathable 100% combed cotton jersey knit tee. Features vibrant, non-toxic water-based graphic print. Reinforced crew neckband prevents stretching out after multiple washes.',
            price: 799,
            original_price: 1199,
            stock: 50,
            category_id: categoryMap['Kids'],
            image_url: 'https://images.unsplash.com/photo-1519457431-44ccd64a579b?auto=format&fit=crop&w=600&q=80',
            rating: 4.5
        },

        // Accessories Section
        {
            title: 'Full-Grain Leather Explorer Backpack',
            description: 'Handcrafted by expert leather artisans. Heavy-duty water-repellent canvas base with full-grain oil-waxed leather shell. Includes 16-inch padded laptop pocket and solid brass buckles.',
            price: 8499,
            original_price: 11999,
            stock: 15,
            category_id: categoryMap['Accessories'],
            image_url: 'https://images.unsplash.com/photo-1548036328-c9fa89d128fa?auto=format&fit=crop&w=600&q=80',
            rating: 4.9
        },
        {
            title: 'Classic Chronograph Stainless Watch',
            description: 'Japanese multi-dial quartz chronograph movement. Durable brushed 316L stainless steel case, anti-reflective sapphire crystal face, and 50-meter water resistance. Sleek executive profile.',
            price: 9999,
            original_price: 14999,
            stock: 12,
            category_id: categoryMap['Accessories'],
            image_url: 'https://images.unsplash.com/photo-1522312346375-d1a52e2b99b3?auto=format&fit=crop&w=600&q=80',
            rating: 4.8
        },
        {
            title: 'Polarized Aviator Sunglasses',
            description: 'Classic double-bridge sunglasses with ultralight, durable gunmetal alloy frames. TAC polarized scratch-resistant lenses block 100% of harmful UVA/UVB rays.',
            price: 2999,
            original_price: 3999,
            stock: 25,
            category_id: categoryMap['Accessories'],
            image_url: 'https://images.unsplash.com/photo-1511499767150-a48a237f0083?auto=format&fit=crop&w=600&q=80',
            rating: 4.6
        },
        {
            title: 'RFID Blocking Bifold Wallet',
            description: 'Handcrafted top-grain leather bifold. Features a protective RFID-shield fabric liner, 8 card slots, quick-access thumb slot, and dual cash slip compartments. Slim pocket silhouette.',
            price: 1899,
            original_price: 2499,
            stock: 30,
            category_id: categoryMap['Accessories'],
            image_url: 'https://images.unsplash.com/photo-1627123424574-724758594e93?auto=format&fit=crop&w=600&q=80',
            rating: 4.7
        },
        {
            title: 'Handcrafted Italian Leather Belt',
            description: 'Solid single-piece vegetable tanned steerhide leather strap. Features burnished hand-painted edges and a solid nickel-brushed harness buckle. Width 35mm. Pairs perfectly with denim or suits.',
            price: 2499,
            original_price: 3499,
            stock: 20,
            category_id: categoryMap['Accessories'],
            image_url: 'https://images.unsplash.com/photo-1624222247344-550fb8ec5519?auto=format&fit=crop&w=600&q=80',
            rating: 4.8
        }
    ];

    for (const p of products) {
        await db.run(
            `INSERT INTO products (title, description, price, original_price, stock, category_id, image_url, rating) VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
            [p.title, p.description, p.price, p.original_price, p.stock, p.category_id, p.image_url, p.rating]
        );
    }

    // No demo users seeded — real accounts are created via Firebase Auth
    console.log('Database successfully seeded with products and categories!');
    console.log('User accounts are managed via Firebase Authentication.');
}

if (require.main === module) {
    seed().catch(err => {
        console.error('Seeding failed:', err);
        process.exit(1);
    });
}

module.exports = seed;
