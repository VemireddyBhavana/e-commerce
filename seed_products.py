"""
Seed script — run with:  Get-Content seed_products.py | python manage.py shell
Adds 54 products across 6 categories with INR (₹) prices and unique HD image URLs.
"""
import os
import django
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'ecommerce.settings')
django.setup()

from store.models import Category, Product

# Clear existing data
Product.objects.all().delete()
Category.objects.all().delete()
print("Cleared existing products & categories.\n")

# Create categories with unique high quality images
categories = {}
category_data = [
    ('Accessories', 'accessories', 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=800&q=80'),
    ('Footwear', 'footwear', 'https://images.unsplash.com/photo-1595950653106-6c9ebd614d3a?w=800&q=80'),
    ('Men', 'men', 'https://images.unsplash.com/photo-1507679799987-c73779587ccf?w=800&q=80'),
    ('Women', 'women', 'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?w=800&q=80'),
    ('Clothing', 'clothing', 'https://images.unsplash.com/photo-1445205170230-053b83016050?w=800&q=80'),
    ('Beauty', 'beauty', 'https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?w=800&q=80'),
    ('Electronics', 'electronics', 'https://images.unsplash.com/photo-1498049794561-7780e7231661?w=800&q=80'),
    ('Books', 'books', 'https://images.unsplash.com/photo-1497633762265-9d179a990aa6?w=800&q=80'),
    ('Home & Garden', 'home', 'https://images.unsplash.com/photo-1616486338812-3dadae4b4ace?w=800&q=80'),
    ('Sports', 'sports', 'https://images.unsplash.com/photo-1517838277536-f5f99be501cd?w=800&q=80'),
]

for name, slug, img in category_data:
    cat = Category.objects.create(name=name, slug=slug, image_url=img)
    categories[slug] = cat
    print(f'  Category: {name}')

print()

# ─── Products Data — Unique Products with Unique Images ───────────────────
products_data = [

    # ── Accessories (8 items) ──────────────────────────────────────────────
    dict(name='Luxury Automatic Chronograph Watch', slug='luxury-chronograph-watch',
         category='accessories',
         description='Premium Swiss-movement automatic chronograph watch with sapphire crystal, stainless steel bracelet, and 100m water resistance.',
         price='34999', original_price='49999', stock=25, is_featured=True, rating=4.9, review_count=412,
         image_url='https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=600&q=80'),

    dict(name='Italian Grain Leather Crossbody Bag', slug='italian-leather-crossbody-bag',
         category='accessories',
         description='Handcrafted Italian full-grain leather crossbody handbag with gold hardware, adjustable strap, and interior card slots.',
         price='12999', original_price='18999', stock=40, is_featured=True, rating=4.8, review_count=328,
         image_url='https://images.unsplash.com/photo-1584917865442-de89df76afd3?w=600&q=80'),

    dict(name='Designer Polarised Aviator Sunglasses', slug='polarised-aviator-sunglasses',
         category='accessories',
         description='Classic aviator sunglasses with UV400 polarised lenses, lightweight titanium frame, and anti-glare coating.',
         price='5999', original_price='8999', stock=85, is_featured=True, rating=4.7, review_count=670,
         image_url='https://images.unsplash.com/photo-1511499767150-a48a237f0083?w=600&q=80'),

    dict(name='Minimalist Bifold Leather Wallet', slug='minimalist-leather-wallet',
         category='accessories',
         description='Slim RFID-blocking bifold wallet crafted from vegetable-tanned leather. Holds up to 10 cards + cash note compartment.',
         price='2999', original_price='4499', stock=150, is_featured=False, rating=4.6, review_count=980,
         image_url='https://images.unsplash.com/photo-1627123424574-724758594e93?w=600&q=80'),

    dict(name='18k Gold Plated Coin Pendant Necklace', slug='gold-coin-pendant-necklace',
         category='accessories',
         description='Elegant 18k gold-plated layered chain necklace with a vintage coin pendant. Tarnish-resistant and hypoallergenic.',
         price='3499', original_price='5299', stock=90, is_featured=True, rating=4.8, review_count=215,
         image_url='https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?w=600&q=80'),

    dict(name='Pure Mulberry Silk Patterned Scarf', slug='mulberry-silk-scarf',
         category='accessories',
         description='100% pure silk square scarf featuring an exclusive geometric luxury print. Soft, breathable, and versatile style statement.',
         price='4499', original_price='6999', stock=60, is_featured=False, rating=4.7, review_count=189,
         image_url='https://images.unsplash.com/photo-1601924994987-69e26d50dc26?w=600&q=80'),

    dict(name='Genuine Full-Grain Leather Dress Belt', slug='genuine-leather-dress-belt',
         category='accessories',
         description='Hand-crafted full-grain leather dress belt with polished solid brass buckle. Timeless addition to formal & casual outfits.',
         price='3299', original_price='4999', stock=110, is_featured=False, rating=4.6, review_count=420,
         image_url='https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=600&q=80'),

    dict(name='Vintage Wayfarer Retro Sunglasses', slug='vintage-wayfarer-sunglasses',
         category='accessories',
         description='Handmade acetate wayfarer sunglasses with polarized dark tint lenses and sturdy 5-barrel hinges.',
         price='4999', original_price='7499', stock=95, is_featured=True, rating=4.8, review_count=530,
         image_url='https://images.unsplash.com/photo-1572635196237-14b3f281503f?w=600&q=80'),

    dict(name='Classic Minimalist Leather Backpack', slug='minimalist-leather-backpack',
         category='accessories',
         description='Premium laptop backpack made from supple cowhide leather. Padded 15" laptop sleeve, waterproof zip, and ergonomic shoulder straps.',
         price='14999', original_price='21999', stock=35, is_featured=True, rating=4.9, review_count=310,
         image_url='https://images.unsplash.com/photo-1548036328-c9fa89d128fa?w=600&q=80'),

    dict(name='Sterling Silver Minimalist Cuff Bracelet', slug='silver-cuff-bracelet',
         category='accessories',
         description='Solid 925 sterling silver open cuff bracelet with brushed matte finish. Adjustable fit for effortless everyday elegance.',
         price='3999', original_price='5999', stock=80, is_featured=False, rating=4.7, review_count=275,
         image_url='https://images.unsplash.com/photo-1611591475168-7528e578c757?w=600&q=80'),

    dict(name='Designer Wool Felt Fedora Hat', slug='designer-fedora-hat',
         category='accessories',
         description='100% Australian wool felt fedora with genuine leather band trim. Water-repellent and shape-retaining classic headwear.',
         price='4299', original_price='6499', stock=50, is_featured=False, rating=4.5, review_count=190,
         image_url='https://images.unsplash.com/photo-1514327605112-b887c0e61c0a?w=600&q=80'),

    dict(name="Luxury Rose Gold Women's Watch", slug='rose-gold-womens-watch',
         category='accessories',
         description='Ultra-slim rose gold mesh strap watch with mother-of-pearl dial and crystal hour markers. 3ATM water resistant.',
         price='28999', original_price='39999', stock=30, is_featured=True, rating=4.9, review_count=615,
         image_url='https://images.unsplash.com/photo-1524805444758-089113d48a6d?w=600&q=80'),

    dict(name='Designer Leather Tote Handbag', slug='designer-leather-tote-handbag',
         category='accessories',
         description='Spacious structured leather tote bag with zip closure, laptop compartment, and dual top handles. Made from top-grain leather.',
         price='18999', original_price='26999', stock=45, is_featured=True, rating=4.9, review_count=480,
         image_url='https://images.unsplash.com/photo-1590874103328-eac38a683ce7?w=600&q=80'),

    dict(name='Classic Tortoiseshell Round Sunglasses', slug='tortoiseshell-round-sunglasses',
         category='accessories',
         description='Retro round frame sunglasses in rich tortoiseshell pattern with gradient brown polarized lenses.',
         price='5499', original_price='7999', stock=70, is_featured=False, rating=4.7, review_count=310,
         image_url='https://images.unsplash.com/photo-1577803645773-f96470509666?w=600&q=80'),

    dict(name='Diamond Accent Silver Chain Bracelet', slug='diamond-accent-silver-bracelet',
         category='accessories',
         description='925 sterling silver link chain bracelet adorned with subtle cubic zirconia diamond accents. Fold-over clasp closure.',
         price='7999', original_price='11999', stock=55, is_featured=True, rating=4.8, review_count=225,
         image_url='https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?w=600&q=80'),

    # ── Footwear (10 items) ────────────────────────────────────────────────
    dict(name='Nike Air Force 1', slug='nike-air-force-1',
         category='footwear',
         description='Premium Nike Air Force 1 icon with crisp leather upper, encapsulated Air cushioning, and durable rubber outsole.',
         price='3999', original_price='5999', stock=100, is_featured=True, rating=4.9, review_count=2410,
         image_url='https://images.unsplash.com/photo-1595950653106-6c9ebd614d3a?w=600&q=80'),

    dict(name='Nike Dunk Low Retro', slug='nike-dunk-low-retro',
         category='footwear',
         description='Classic 80s basketball sneaker returned with crisp overlays, heritage color blocking, and foam midsole comfort.',
         price='4049', original_price='6299', stock=80, is_featured=True, rating=4.8, review_count=1890,
         image_url='https://images.unsplash.com/photo-1549298916-b41d501d3772?w=600&q=80'),

    dict(name='Jordan 1 Retro High', slug='jordan-1-retro-high',
         category='footwear',
         description='The sneaker that started it all. Premium leather, Wings logo branding, and Air-Sole unit in the heel.',
         price='4099', original_price='6499', stock=50, is_featured=True, rating=4.9, review_count=3120,
         image_url='https://images.unsplash.com/photo-1584735935682-2f2b69dff9d2?w=600&q=80'),

    dict(name='Jordan 4 Retro', slug='jordan-4-retro',
         category='footwear',
         description='Iconic silhouette with mesh side panels, sculpted lace-lock wings, and visible Air unit heel cushion.',
         price='4149', original_price='6699', stock=45, is_featured=True, rating=4.9, review_count=2780,
         image_url='https://images.unsplash.com/photo-1552346154-21d32810aba3?w=600&q=80'),

    dict(name='Adidas Samba OG', slug='adidas-samba-og',
         category='footwear',
         description='Timeless indoor soccer classic featuring soft leather upper, suede T-toe overlay, and iconic gum rubber sole.',
         price='4199', original_price='6199', stock=110, is_featured=True, rating=4.7, review_count=1650,
         image_url='https://images.unsplash.com/photo-1608231387042-66d1773070a5?w=600&q=80'),

    dict(name='Adidas Gazelle Vintage', slug='adidas-gazelle-vintage',
         category='footwear',
         description='Rich suede upper with contrast 3-Stripes and trefoil logo heel patch. Lightweight low-top street style.',
         price='4249', original_price='6399', stock=75, is_featured=False, rating=4.6, review_count=940,
         image_url='https://images.unsplash.com/photo-1511556532299-8f662fc26c06?w=600&q=80'),

    dict(name='Puma Future Rider', slug='puma-future-rider',
         category='footwear',
         description='Vibrant retro-running sneaker with shock-absorbing Federbein outsole and lightweight IMEVA midsole.',
         price='3899', original_price='5799', stock=90, is_featured=False, rating=4.6, review_count=820,
         image_url='https://images.unsplash.com/photo-1600185365483-26d7a4cc7519?w=600&q=80'),

    dict(name='Converse Chuck Taylor 70', slug='converse-chuck-70',
         category='footwear',
         description='Upgraded canvas high-top with vintage stitching, higher rubber foxing, and cushioned OrthoLite insole.',
         price='3799', original_price='5499', stock=130, is_featured=False, rating=4.8, review_count=1450,
         image_url='https://images.unsplash.com/photo-1607522370275-f14206abe5d3?w=600&q=80'),

    # ── Electronics (10 items) ──────────────────────────────────────────────
    dict(name='Wireless Noise-Cancelling Headphones', slug='wireless-nc-headphones',
         category='electronics',
         description='Premium over-ear headphones with 30hr battery life and industry-leading noise cancellation. Deep bass, clear highs, and ultra-comfortable memory foam ear cups.',
         price='12499', original_price='20999', stock=50, is_featured=True, rating=4.8, review_count=1240,
         image_url='https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=600&q=80'),

    dict(name='4K Ultra HD Smart TV 55"', slug='4k-smart-tv-55',
         category='electronics',
         description='Stunning 4K OLED display with built-in streaming apps and voice control. Immersive viewing with HDR10+ and Dolby Vision support.',
         price='54999', original_price='84999', stock=20, is_featured=True, rating=4.7, review_count=856,
         image_url='https://images.unsplash.com/photo-1593359677879-a4bb92f4834e?w=600&q=80'),

    dict(name='Mechanical Gaming Keyboard', slug='mechanical-gaming-keyboard',
         category='electronics',
         description='RGB backlit mechanical keyboard with Cherry MX switches and full anti-ghosting. Tactile, satisfying keystrokes for gamers and writers alike.',
         price='7499', original_price='10999', stock=75, is_featured=False, rating=4.6, review_count=623,
         image_url='https://images.unsplash.com/photo-1587829741301-dc798b83add3?w=600&q=80'),

    dict(name='Smart Watch Pro', slug='smart-watch-pro',
         category='electronics',
         description='Fitness tracking, ECG, GPS and 7-day battery in a sleek titanium design. Swim-proof with AMOLED always-on display.',
         price='24999', original_price='33999', stock=35, is_featured=True, rating=4.9, review_count=2100,
         image_url='https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=600&q=80'),

    dict(name='Portable Bluetooth Speaker', slug='portable-bluetooth-speaker',
         category='electronics',
         description='360° surround sound with 20-hour battery. Waterproof IPX7 rated — perfect for outdoor adventures, pools, and beach trips.',
         price='6499', original_price='9999', stock=60, is_featured=False, rating=4.5, review_count=934,
         image_url='https://images.unsplash.com/photo-1608043152269-423dbba4e7e1?w=600&q=80'),

    dict(name='True Wireless Earbuds', slug='true-wireless-earbuds',
         category='electronics',
         description='Premium true wireless earbuds with active noise cancellation. 8hr playtime + 24hr charging case. IPX4 sweat resistant.',
         price='10999', original_price='16999', stock=90, is_featured=True, rating=4.7, review_count=1580,
         image_url='https://images.unsplash.com/photo-1590658268037-6bf12165a8df?w=600&q=80'),

    dict(name='Gaming Mouse Pro', slug='gaming-mouse-pro',
         category='electronics',
         description='Ultra-precise optical gaming mouse with 25,600 DPI sensor. Customisable RGB, 11 programmable buttons, and lightweight honeycomb shell.',
         price='4999', original_price='7499', stock=110, is_featured=False, rating=4.6, review_count=712,
         image_url='https://images.unsplash.com/photo-1527864550417-7fd91fc51a46?w=600&q=80'),

    dict(name='Laptop Stand Adjustable', slug='laptop-stand-adjustable',
         category='electronics',
         description='Ergonomic aluminium laptop stand. Foldable, portable, and compatible with 10-17" laptops. Keeps you cool and posture-correct.',
         price='3999', original_price='5999', stock=200, is_featured=False, rating=4.8, review_count=2240,
         image_url='https://images.unsplash.com/photo-1527515637462-cff94eecc1ac?w=600&q=80'),

    dict(name='Wireless Charging Pad', slug='wireless-charging-pad',
         category='electronics',
         description='Fast 15W Qi wireless charger compatible with all Qi-enabled devices. Slim, non-slip design with LED indicator.',
         price='2999', original_price='4499', stock=150, is_featured=False, rating=4.4, review_count=441,
         image_url='https://images.unsplash.com/photo-1586953208448-b95a79798f07?w=600&q=80'),

    dict(name='Digital Camera Mirrorless', slug='digital-camera-mirrorless',
         category='electronics',
         description='24.2MP mirrorless camera with 4K video, in-body stabilisation, and hybrid autofocus. Perfect for creators and travel photographers.',
         price='69999', original_price='99999', stock=15, is_featured=True, rating=4.9, review_count=389,
         image_url='https://images.unsplash.com/photo-1516035069371-29a1b244cc32?w=600&q=80'),

    # ── Clothing (12 items) ─────────────────────────────────────────────────
    dict(name="Men's Slim Fit Chinos", slug='mens-slim-chinos',
         category='clothing',
         description='Versatile stretch chinos perfect for casual or smart-casual occasions. Available in 8 colours, machine washable.',
         price='3299', original_price='4999', stock=120, is_featured=False, rating=4.4, review_count=378,
         image_url='https://images.unsplash.com/photo-1542272604-787c3835535d?w=600&q=80'),

    dict(name="Women's Floral Summer Dress", slug='womens-floral-dress',
         category='clothing',
         description='Lightweight, breathable floral dress perfect for summer outings. 100% cotton with adjustable waist tie.',
         price='4199', original_price='6799', stock=85, is_featured=True, rating=4.5, review_count=512,
         image_url='https://images.unsplash.com/photo-1572804013427-4d7ca7268217?w=600&q=80'),

    dict(name='Premium Leather Jacket', slug='premium-leather-jacket',
         category='clothing',
         description='Genuine leather biker jacket with quilted lining and YKK zippers. Timeless silhouette that only gets better with age.',
         price='15999', original_price='24999', stock=30, is_featured=True, rating=4.8, review_count=215,
         image_url='https://images.unsplash.com/photo-1521223890158-f9f7c3d5d504?w=600&q=80'),

    dict(name='Classic White Sneakers', slug='classic-white-sneakers',
         category='clothing',
         description='Clean, minimalist leather sneakers with cushioned insole. The ultimate everyday essential that pairs with everything.',
         price='7499', original_price='10999', stock=95, is_featured=True, rating=4.6, review_count=1102,
         image_url='https://images.unsplash.com/photo-1549298916-b41d501d3772?w=600&q=80'),

    dict(name="Men's Graphic Tee Pack (3x)", slug='mens-graphic-tee-pack',
         category='clothing',
         description='Three premium 100% cotton graphic tees in a value pack. Preshrunk, durable, and available in multiple theme sets.',
         price='2999', original_price='4599', stock=200, is_featured=False, rating=4.3, review_count=692,
         image_url='https://images.unsplash.com/photo-1583743814966-8936f5b7be1a?w=600&q=80'),

    dict(name='Cozy Oversized Hoodie', slug='cozy-oversized-hoodie',
         category='clothing',
         description='Ultra-soft 400gsm fleece hoodie in an oversized fit. Kangaroo pocket, adjustable drawstring, unisex sizing.',
         price='4999', original_price='7199', stock=110, is_featured=True, rating=4.7, review_count=887,
         image_url='https://images.unsplash.com/photo-1556821840-3a63f15732ce?w=600&q=80'),

    dict(name="Women's High-Waist Leggings", slug='womens-hw-leggings',
         category='clothing',
         description='4-way stretch, squat-proof yoga leggings with hidden waistband pocket. Perfect for gym, yoga, or everyday wear.',
         price='3799', original_price='5499', stock=150, is_featured=False, rating=4.8, review_count=1654,
         image_url='https://images.unsplash.com/photo-1506629082955-511b1aa562c8?w=600&q=80'),

    dict(name='Linen Blazer', slug='linen-blazer',
         category='clothing',
         description='Breathable linen-blend blazer with a relaxed, unstructured fit. Great for summer weddings, beach parties, or smart-casual days.',
         price='9999', original_price='14999', stock=45, is_featured=False, rating=4.5, review_count=243,
         image_url='https://images.unsplash.com/photo-1507679799987-c73779587ccf?w=600&q=80'),

    dict(name='Retro Denim Jacket', slug='retro-denim-jacket',
         category='clothing',
         description='Classic medium-wash denim jacket with button closure and chest pockets. A wardrobe staple for every season.',
         price='6799', original_price='9299', stock=70, is_featured=False, rating=4.6, review_count=538,
         image_url='https://images.unsplash.com/photo-1523205771623-e0faa4d2813d?w=600&q=80'),

    dict(name='Silk Evening Blouse', slug='silk-evening-blouse',
         category='clothing',
         description='100% mulberry silk blouse with a flowy drape and V-neckline. Elevate any outfit effortlessly.',
         price='8499', original_price='12599', stock=40, is_featured=True, rating=4.7, review_count=312,
         image_url='https://images.unsplash.com/photo-1485462537746-965f33f7f6a7?w=600&q=80'),

    dict(name='Cargo Shorts', slug='cargo-shorts',
         category='clothing',
         description='Multi-pocket cargo shorts in durable ripstop fabric. Available in khaki, olive, and navy. Machine washable.',
         price='2499', original_price='3799', stock=180, is_featured=False, rating=4.2, review_count=467,
         image_url='https://images.unsplash.com/photo-1591195853828-11db59a44f43?w=600&q=80'),

    dict(name='Running Shoes Lightweight', slug='running-shoes-lightweight',
         category='clothing',
         description='Featherlight mesh running shoes with responsive foam midsole and anti-slip rubber outsole. Support for neutral and overpronation.',
         price='9199', original_price='12599', stock=85, is_featured=True, rating=4.8, review_count=921,
         image_url='https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=600&q=80'),

    # ── Books (8 items) ─────────────────────────────────────────────────────
    dict(name='Clean Code by Robert C. Martin', slug='clean-code-book',
         category='books',
         description='A timeless guide to writing readable, maintainable, and elegant code. Essential reading for every software engineer.',
         price='2499', original_price='3799', stock=200, is_featured=False, rating=4.9, review_count=3400,
         image_url='https://images.unsplash.com/photo-1532012197267-da84d127e765?w=600&q=80'),

    dict(name='Atomic Habits by James Clear', slug='atomic-habits-book',
         category='books',
         description='A revolutionary system for building good habits and breaking bad ones. #1 New York Times bestseller with over 15 million copies sold.',
         price='1999', original_price='2999', stock=150, is_featured=True, rating=4.9, review_count=5600,
         image_url='https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=600&q=80'),

    dict(name='The Psychology of Money', slug='psychology-of-money-book',
         category='books',
         description='19 short stories exploring the strange ways people think about money. Timeless lessons on wealth, greed, and happiness by Morgan Housel.',
         price='1699', original_price='2499', stock=180, is_featured=True, rating=4.8, review_count=4200,
         image_url='https://images.unsplash.com/photo-1497633762265-9d179a990aa6?w=600&q=80'),

    dict(name='Deep Work by Cal Newport', slug='deep-work-book',
         category='books',
         description='Rules for focused success in a distracted world. Learn to perform at your peak in an increasingly noisy world.',
         price='1849', original_price='2599', stock=130, is_featured=False, rating=4.7, review_count=2800,
         image_url='https://images.unsplash.com/photo-1512820790803-83ca734da794?w=600&q=80'),

    dict(name='The Lean Startup', slug='lean-startup-book',
         category='books',
         description='Eric Ries teaches entrepreneurs to build, measure, and learn quickly. The definitive guide for building companies in the modern era.',
         price='1949', original_price='2799', stock=160, is_featured=False, rating=4.6, review_count=1920,
         image_url='https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=600&q=80'),

    dict(name='Sapiens: A Brief History of Humankind', slug='sapiens-book',
         category='books',
         description="Yuval Noah Harari's groundbreaking narrative of humanity's creation and evolution. A must-read for curious minds.",
         price='1599', original_price='2299', stock=220, is_featured=True, rating=4.8, review_count=7300,
         image_url='https://images.unsplash.com/photo-1481627834876-b7833e8f5570?w=600&q=80'),

    dict(name='Thinking, Fast and Slow', slug='thinking-fast-slow-book',
         category='books',
         description="Daniel Kahneman's landmark work on the two systems that drive the way we think — and how to make better decisions.",
         price='1749', original_price='2499', stock=140, is_featured=False, rating=4.7, review_count=3100,
         image_url='https://images.unsplash.com/photo-1543002588-bfa74002ed7e?w=600&q=80'),

    dict(name='Zero to One by Peter Thiel', slug='zero-to-one-book',
         category='books',
         description="Peter Thiel's contrarian guide to building great companies — notes on startups, or how to build the future.",
         price='1499', original_price='2099', stock=170, is_featured=False, rating=4.5, review_count=2450,
         image_url='https://images.unsplash.com/photo-1507842217343-583bb7270b66?w=600&q=80'),

    # ── Home & Garden (8 items) ──────────────────────────────────────────────
    dict(name='Scented Soy Candle Set', slug='soy-candle-set',
         category='home',
         description='Set of 3 hand-poured soy candles in calming lavender, vanilla, and sandalwood scents. 50-hour burn time each.',
         price='2999', original_price='4199', stock=100, is_featured=False, rating=4.7, review_count=289,
         image_url='https://images.unsplash.com/photo-1602523961358-f9f03dd557db?w=600&q=80'),

    dict(name='Ergonomic Office Chair', slug='ergonomic-office-chair',
         category='home',
         description='Lumbar support mesh chair with adjustable height, armrests, and headrest. BIFMA certified for all-day comfort.',
         price='19999', original_price='33599', stock=18, is_featured=True, rating=4.6, review_count=742,
         image_url='https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=600&q=80'),

    dict(name='Indoor Plant Pot Set (5 pcs)', slug='indoor-plant-pot-set',
         category='home',
         description='Set of 5 modern minimalist ceramic plant pots with drainage holes and bamboo trays. Sizes from 3" to 7".',
         price='3799', original_price='5499', stock=75, is_featured=False, rating=4.6, review_count=312,
         image_url='https://images.unsplash.com/photo-1485955900006-10f4d324d411?w=600&q=80'),

    dict(name='Linen Throw Pillow Covers (4x)', slug='linen-throw-pillow-covers',
         category='home',
         description='Set of 4 premium washed-linen throw pillow covers in neutral tones. Envelope closure, machine washable. 45cm x 45cm.',
         price='2499', original_price='3799', stock=130, is_featured=False, rating=4.5, review_count=218,
         image_url='https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=600&q=80'),

    dict(name='Bamboo Kitchen Utensil Set', slug='bamboo-kitchen-utensil-set',
         category='home',
         description='10-piece eco-friendly bamboo kitchen utensil set with countertop holder. Heat resistant, naturally antibacterial.',
         price='2099', original_price='3199', stock=160, is_featured=False, rating=4.7, review_count=546,
         image_url='https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=600&q=80'),

    dict(name='LED Desk Lamp with USB Charging', slug='led-desk-lamp-usb',
         category='home',
         description='Sleek LED desk lamp with 5 brightness levels and 3 colour temperatures. Built-in USB-A and USB-C charging ports.',
         price='4599', original_price='6799', stock=88, is_featured=True, rating=4.8, review_count=891,
         image_url='https://images.unsplash.com/photo-1507473885765-e6ed057f782c?w=600&q=80'),

    dict(name='French Press Coffee Maker', slug='french-press-coffee-maker',
         category='home',
         description='1L stainless steel French Press with double-wall insulation. Keeps coffee hot for 2 hours. Dishwasher safe.',
         price='3299', original_price='4599', stock=95, is_featured=False, rating=4.9, review_count=1230,
         image_url='https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?w=600&q=80'),

    dict(name='Weighted Blanket 7kg', slug='weighted-blanket-7kg',
         category='home',
         description='Therapeutic 7kg weighted blanket filled with glass beads. Promotes deeper sleep and reduces anxiety. Machine washable.',
         price='6799', original_price='9999', stock=55, is_featured=True, rating=4.8, review_count=673,
         image_url='https://images.unsplash.com/photo-1584100936595-c0654b55a2e2?w=600&q=80'),

    # ── Sports (8 items) ─────────────────────────────────────────────────────
    dict(name='Yoga Mat Premium', slug='yoga-mat-premium',
         category='sports',
         description='6mm non-slip TPE yoga mat with alignment lines. Lightweight and eco-friendly. Includes carrying strap.',
         price='3299', original_price='4999', stock=90, is_featured=False, rating=4.6, review_count=445,
         image_url='https://images.unsplash.com/photo-1599901860904-17e6ed7083a0?w=600&q=80'),

    dict(name='Adjustable Dumbbell Set 2-24kg', slug='adjustable-dumbbell-set',
         category='sports',
         description='Dial-a-weight adjustable dumbbells replacing 15 sets of weights. Space-saving design for home gyms.',
         price='24999', original_price='37999', stock=22, is_featured=True, rating=4.9, review_count=1890,
         image_url='https://images.unsplash.com/photo-1584735935682-2f2b69dff9d2?w=600&q=80'),

    dict(name='Resistance Bands Set (5 levels)', slug='resistance-bands-set',
         category='sports',
         description='Set of 5 heavy-duty resistance bands from extra-light to extra-heavy. Perfect for strength training, rehab, and stretching.',
         price='1999', original_price='3399', stock=200, is_featured=False, rating=4.7, review_count=2340,
         image_url='https://images.unsplash.com/photo-1598300042247-d088f8ab3a91?w=600&q=80'),

    dict(name='Jump Rope Speed Cable', slug='jump-rope-speed-cable',
         category='sports',
         description='Professional speed jump rope with steel cable and ball-bearing handles. Adjustable length. Great for HIIT and boxing.',
         price='1599', original_price='2499', stock=250, is_featured=False, rating=4.5, review_count=1120,
         image_url='https://images.unsplash.com/photo-1434682881908-b43d0467b798?w=600&q=80'),

    dict(name='Foam Roller Deep Tissue', slug='foam-roller-deep-tissue',
         category='sports',
         description='High-density EVA foam roller for myofascial release and muscle recovery. Grid texture targets deep tissues effectively.',
         price='2499', original_price='3799', stock=130, is_featured=False, rating=4.6, review_count=876,
         image_url='https://images.unsplash.com/photo-1562771379-eafdca7a02f8?w=600&q=80'),

    dict(name='Gym Water Bottle 1L', slug='gym-water-bottle-1l',
         category='sports',
         description='BPA-free 1-litre tritan water bottle with time markers, leakproof lid and carry handle. Stay hydrated all day.',
         price='1599', original_price='2349', stock=300, is_featured=False, rating=4.8, review_count=3200,
         image_url='https://images.unsplash.com/photo-1589365278144-c9e705f843ba?w=600&q=80'),

    dict(name='Running Belt Waist Pack', slug='running-belt-waist-pack',
         category='sports',
         description='Lightweight running belt with adjustable strap and water-resistant pockets for phone, keys, and gels. Fits all phone sizes.',
         price='1899', original_price='2799', stock=110, is_featured=False, rating=4.5, review_count=654,
         image_url='https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=600&q=80'),

    dict(name='Boxing Gloves Training 10oz', slug='boxing-gloves-10oz',
         category='sports',
         description='Premium 10oz boxing and kickboxing gloves with triple-layer foam. Wrist support strap and breathable mesh palm.',
         price='4199', original_price='6299', stock=65, is_featured=True, rating=4.7, review_count=489,
         image_url='https://images.unsplash.com/photo-1517438476312-10d79c077509?w=600&q=80'),

    # ── Beauty (8 items) ─────────────────────────────────────────────────────
    dict(name='Vitamin C Serum 20%', slug='vitamin-c-serum',
         category='beauty',
         description='20% Vitamin C brightening serum with hyaluronic acid and niacinamide. Reduces dark spots, firms skin, and boosts radiance.',
         price='1999', original_price='3399', stock=130, is_featured=True, rating=4.8, review_count=1890,
         image_url='https://images.unsplash.com/photo-1620916566398-39f1143ab7be?w=600&q=80'),

    dict(name='Hyaluronic Acid Moisturiser', slug='hyaluronic-moisturiser',
         category='beauty',
         description='Deeply hydrating gel-cream with 5-molecular-weight hyaluronic acid. Plumps and softens all skin types. Fragrance-free.',
         price='2499', original_price='3799', stock=145, is_featured=True, rating=4.9, review_count=2340,
         image_url='https://images.unsplash.com/photo-1556228578-8c89e6adf883?w=600&q=80'),

    dict(name='Retinol Night Cream', slug='retinol-night-cream',
         category='beauty',
         description='0.5% retinol night cream with peptides and ceramides. Visibly reduces fine lines and uneven texture while you sleep.',
         price='3299', original_price='4999', stock=80, is_featured=False, rating=4.7, review_count=1120,
         image_url='https://images.unsplash.com/photo-1596462502278-27bfdc403348?w=600&q=80'),

    dict(name='SPF 50+ Sunscreen Fluid', slug='spf50-sunscreen',
         category='beauty',
         description='Lightweight SPF 50+ mineral sunscreen with zinc oxide. Non-greasy, reef-safe formula. Suitable for sensitive skin.',
         price='1699', original_price='2449', stock=200, is_featured=False, rating=4.6, review_count=879,
         image_url='https://images.unsplash.com/photo-1619451334792-150fd785ee74?w=600&q=80'),

    dict(name='Rose Gold Makeup Brush Set (16pc)', slug='makeup-brush-set-rose-gold',
         category='beauty',
         description='Professional 16-piece vegan brush set with rose gold handles and dense synthetic bristles. Includes travel roll-up pouch.',
         price='2999', original_price='4599', stock=95, is_featured=True, rating=4.7, review_count=1350,
         image_url='https://images.unsplash.com/photo-1522338242992-e1a54906a8da?w=600&q=80'),

    dict(name='Argan Oil Hair Serum', slug='argan-oil-hair-serum',
         category='beauty',
         description='100% pure cold-pressed Moroccan argan oil. Tames frizz, adds shine, and repairs split ends. A few drops is all you need.',
         price='1899', original_price='2949', stock=170, is_featured=False, rating=4.8, review_count=1670,
         image_url='https://images.unsplash.com/photo-1559599101-f09722fb4948?w=600&q=80'),

    dict(name='Jade Facial Roller & Gua Sha Set', slug='jade-roller-gua-sha',
         category='beauty',
         description='Authentic jade stone roller and gua sha scraping tool. Reduces puffiness, improves circulation, and promotes lymphatic drainage.',
         price='2299', original_price='3599', stock=120, is_featured=False, rating=4.6, review_count=820,
         image_url='https://images.unsplash.com/photo-1631729371254-42c2892f0e6e?w=600&q=80'),

    dict(name='Electric Face Cleanser Brush', slug='electric-face-cleanser-brush',
         category='beauty',
         description='Silicone sonic facial cleansing brush with 3 speed modes. Removes 99.5% more makeup and impurities than hands alone.',
         price='3799', original_price='5899', stock=75, is_featured=True, rating=4.7, review_count=935,
         image_url='https://images.unsplash.com/photo-1570172619644-dfd03ed5d881?w=600&q=80'),
]

# ─── Create all products ─────────────────────────────────────────────────────
created = 0
for pd in products_data:
    cat_slug = pd.pop('category')
    Product.objects.create(category=categories[cat_slug], **pd)
    print(f"  Added: {pd['name']}")
    created += 1

print(f'\nDone! Seeded {created} products across {len(categories)} categories (prices in INR).')
