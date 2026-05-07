/**
 * Sanfe Exfoliating Gel — Full Product Seed
 * Run: node scripts/seedSanfeProduct.js
 *
 * Inserts the complete Sanfe Instant Tan & Dead Skin Removal Exfoliating Gel
 * product with all rich content fields extracted from the Sanfe website HTML.
 *
 * categoryId : 23
 * brandId    : 996
 */

require('dotenv').config({ path: require('path').join(__dirname, '../.env') });
const db = require('../config/db');

// ── Product Data ──────────────────────────────────────────────────────────────

const product = {
    name: 'Sanfe Instant Tan & Dead Skin Removal Exfoliating Gel (Pack of 3)',
    slug: 'sanfe-instant-tan-dead-skin-removal-exfoliating-gel',

    description: `The Instant Tan & Dead Skin Removal Exfoliating Gel is designed to give quick, visible results by lifting away dullness, tan, and buildup within seconds. As you massage it onto your skin, the gel binds to dead cells and surface impurities, causing them to roll off instantly. This helps unclog pores, smooth uneven texture, and brighten the skin without any harsh scrubbing. Its gentle formulation ensures effective exfoliation while keeping the skin comfortable and balanced. Ideal for days when your skin looks tanned, tired, or rough, and perfect for weekly use to maintain clean, fresh, even-looking skin.`,

    shortDescription: 'Tan-Off · Detan & Cool Instantly',

    resultTag: 'INSTANT RESULT',

    badge: 'Best Seller',

    price: 1197.00,
    salePrice: 699.00,

    categoryId: 23,
    brandId: 996,

    images: JSON.stringify([
        'https://sanfe.in/cdn/shop/files/exfoliating-gel-pack-1.jpg?v=1776949351&width=1000',
        'https://sanfe.in/cdn/shop/files/Exfoliatinggel-ezgif.com-video-to-gif-converter.gif?v=1771047075&width=1080',
        'https://sanfe.in/cdn/shop/files/exfoliating-gel-2.jpg?v=1774686629&width=1080',
        'https://sanfe.in/cdn/shop/files/exfoliating-gel-3.jpg?v=1766487717&width=1080',
        'https://sanfe.in/cdn/shop/files/exfoliating-gel-4.jpg?v=1766487717&width=1080',
        'https://sanfe.in/cdn/shop/files/exfoliating-gel-5.jpg?v=1766487717&width=1080',
    ]),

    // Variants — 3 pack options with images, prices, per-pack price
    variants: JSON.stringify([
        {
            name: 'Combo',
            options: [
                {
                    label: '100gm',
                    value: '100gm',
                    stock: 100,
                    price: 399,
                    originalPrice: null,
                    perPack: '₹399',
                    image: 'https://sanfe.in/cdn/shop/files/exfoliating-gel-pack-1_300x.jpg?v=1776949351'
                },
                {
                    label: '100gm (Pack of 2)',
                    value: '100gm-pack-of-2',
                    stock: 100,
                    price: 549,
                    originalPrice: 798,
                    perPack: '₹274',
                    image: 'https://sanfe.in/cdn/shop/files/exfoliating-gel-pack-2_300x.jpg?v=1776949389'
                },
                {
                    label: '100gm (Pack of 3)',
                    value: '100gm-pack-of-3',
                    stock: 100,
                    price: 699,
                    originalPrice: 1197,
                    perPack: '₹233',
                    image: 'https://sanfe.in/cdn/shop/files/exfoliating-gel-pack-3_300x.jpg?v=1776949409'
                }
            ]
        }
    ]),

    tags: JSON.stringify([
        'exfoliating gel', 'tan removal', 'dead skin removal', 'detan',
        'skin brightening', 'face care', 'body care', 'sanfe',
        'instant result', 'exfoliator', 'tan off', 'dark spots'
    ]),

    // Benefit chips shown below product title
    benefits: JSON.stringify([
        'Detan Instantly',
        'Remove Buildup',
        'Fade Dark Spots',
        'Gentle On Skin'
    ]),

    // Why You'll Love It — accordion items
    whyLoveIt: JSON.stringify([
        {
            title: 'Instant Visible Results',
            description: 'Every day you wait, buildup deepens—lift it off in one use.'
        },
        {
            title: 'Gentle Yet Effective',
            description: 'Harsh scrubs damage more than they fix—this clears without wrecking your skin.'
        },
        {
            title: 'Glow-Boosting Formula',
            description: 'Ignore dullness now, deal with deeper uneven tone later—fix it early.'
        }
    ]),

    // Key Ingredients with images
    keyIngredients: JSON.stringify([
        {
            name: 'Lactic Acid',
            description: 'Lactic acid is an AHA (alpha hydroxy acid) that gently exfoliates the skin, removes dead skin cells, and helps reveal a smoother, brighter complexion.',
            image: 'https://sanfe.in/cdn/shop/files/Lactic_Acid_jpg.jpg'
        },
        {
            name: 'Cellulose Particles',
            description: 'Cellulose particles provide mild physical exfoliation by lifting and rolling away dead skin, leaving your skin feeling soft and refreshed.',
            image: 'https://sanfe.in/cdn/shop/files/Cellulose_Particles_jpg.jpg'
        },
        {
            name: 'Cetrimonium Chloride',
            description: 'Cetrimonium chloride is a conditioning agent that helps soften the skin and improves the overall texture and application of the product.',
            image: 'https://sanfe.in/cdn/shop/files/Cetrimonium_Chloride_jpg.jpg'
        }
    ]),

    howToUse: `1. Take a small amount of the Instant Tan & Dead Skin Removal Exfoliating Gel onto your fingertips.
2. Apply on damp skin and massage in circular motions until you see dead skin and impurities lifting off.
3. Pay extra attention to areas with visible tan, rough texture, or clogged pores.
4. Rinse thoroughly with lukewarm water.
5. Use 1–2 times a week for consistently clearer and brighter-looking skin.`,

    additionalDetails: `Manufactured/Imported By: This product is manufactured by Zymo Cosmetics.
Net Quantity: 100gm per unit
Country of Origin: India
Best Before: 24 months from manufacture date`,

    consumerCareDetails: `Phone: 9310054380
Email: care@sanfe.in`,

    // FAQs
    faqs: JSON.stringify([
        {
            question: 'What does this exfoliating gel actually do?',
            answer: 'It lifts away tan, dead skin cells, and surface buildup in seconds. The gel binds to impurities and rolls them off as you massage, leaving skin visibly brighter and smoother.'
        },
        {
            question: 'Can I use this gel on sensitive or acne-prone skin?',
            answer: 'Yes, the formula is gentle enough for sensitive skin. However, avoid using on active breakouts or open wounds. Do a patch test before first use.'
        },
        {
            question: 'How often should I use it to maintain results?',
            answer: 'Use 1–2 times a week for best results. Overuse can strip natural oils, so stick to the recommended frequency.'
        },
        {
            question: 'Will it dry out my skin after exfoliation?',
            answer: 'No. The formula is designed to exfoliate without stripping moisture. Follow up with a moisturiser for best results.'
        },
        {
            question: 'Can it be used along with my usual skincare routine?',
            answer: 'Absolutely. Use it as a cleansing step before your serum and moisturiser. Avoid using with other exfoliating acids on the same day.'
        }
    ]),

    // Promo banner image
    promoImage: 'https://cdn.shopify.com/s/files/1/0345/4287/8859/files/home.jpg_1.jpg',

    // Gallery media — Sanfe Quinn-style reels (vertical video cards)
    galleryMedia: JSON.stringify([
        {
            type: 'video',
            url: 'https://sanfe.in/cdn/shop/files/quinn_w93mvhyw88l7pkk9e7140m3x.mp4',
            thumbnail: 'https://cdn.shopify.com/s/files/1/0345/4287/8859/files/exfoliating-gel-pack-2_200x200.jpg?v=1776949389',
            productName: 'Sanfe Instant Tan & Dead Skin Removal Exfoliating Gel (Pack of 2)',
            productPrice: '₹549 - ₹1,059'
        },
        {
            type: 'video',
            url: 'https://sanfe.in/cdn/shop/files/quinn_ywzll54kti5ipv47ujt6uldv.mp4',
            thumbnail: 'https://cdn.shopify.com/s/files/1/0345/4287/8859/files/exfoliating-gel-pack-2_200x200.jpg?v=1776949389',
            productName: 'Sanfe Instant Tan & Dead Skin Removal Exfoliating Gel (Pack of 2)',
            productPrice: '₹549 - ₹1,059'
        },
        {
            type: 'video',
            url: 'https://sanfe.in/cdn/shop/files/quinn_jacacqxzgsdkojhh375yqyog.mp4',
            thumbnail: 'https://cdn.shopify.com/s/files/1/0345/4287/8859/files/exfoliating-gel-pack-2_200x200.jpg?v=1776949389',
            productName: 'Sanfe Instant Tan & Dead Skin Removal Exfoliating Gel (Pack of 2)',
            productPrice: '₹549 - ₹1,059'
        },
        {
            type: 'video',
            url: 'https://sanfe.in/cdn/shop/files/quinn_pjgc2gghll2nflafqype5ww5.mp4',
            thumbnail: 'https://cdn.shopify.com/s/files/1/0345/4287/8859/files/exfoliating-gel-pack-2_200x200.jpg?v=1776949389',
            productName: 'Sanfe Instant Tan & Dead Skin Removal Exfoliating Gel (Pack of 2)',
            productPrice: '₹549 - ₹1,059'
        },
        {
            type: 'video',
            url: 'https://sanfe.in/cdn/shop/files/quinn_xv3ha9h3k2pxwwnwbzzxr15s.mp4',
            thumbnail: 'https://cdn.shopify.com/s/files/1/0345/4287/8859/files/exfoliating-gel-pack-2_200x200.jpg?v=1776949389',
            productName: 'Sanfe Instant Tan & Dead Skin Removal Exfoliating Gel (Pack of 2)',
            productPrice: '₹549 - ₹1,059'
        },
    ]),

    avgRating: 4.84,
    reviewCount: 583,
    isActive: 1,
    sortOrder: 1
};

// ── Seed Reviews ──────────────────────────────────────────────────────────────

const reviews = [
    {
        reviewerName: 'Ila Singh',
        rating: 5,
        title: "It's amazing 🤩",
        body: "I really love the product as it removes tan from my hand, feet and neck too. I'll recommend to my friends and everyone to purchase that.",
        created_at: '2026-03-22'
    },
    {
        reviewerName: 'Neha Kakkar',
        rating: 5,
        title: 'Sanfe instant tan & dead skin removal gel',
        body: 'Woww amazing product. It is very impressive and works like magic on skin.',
        created_at: '2026-02-18'
    },
    {
        reviewerName: 'Sunila Kantharia',
        rating: 5,
        title: 'Sanfe tan removal gel',
        body: 'Very nice and gentle. Skin becomes softer n brighten.',
        created_at: '2026-02-12'
    },
    {
        reviewerName: 'Dimpi Sewaliya',
        rating: 5,
        title: 'Great product',
        body: 'Works really well for tan removal. Skin feels smooth after use.',
        created_at: '2026-02-11'
    },
    {
        reviewerName: 'Priya Sharma',
        rating: 4,
        title: 'Good exfoliator',
        body: 'Nice product, removes dead skin effectively. A bit pricey but worth it.',
        created_at: '2025-09-26'
    },
    {
        reviewerName: 'Anjali Mehta',
        rating: 5,
        title: 'Love this gel!',
        body: 'Been using for 2 months now. My skin looks so much brighter and the tan has reduced significantly.',
        created_at: '2026-01-15'
    },
    {
        reviewerName: 'Ritu Verma',
        rating: 5,
        title: 'Must buy!',
        body: 'Instant results! You can literally see the dead skin rolling off. Amazing product.',
        created_at: '2026-01-08'
    },
    {
        reviewerName: 'Kavya Nair',
        rating: 4,
        title: 'Works well',
        body: 'Good product for tan removal. Skin feels soft after use. Will repurchase.',
        created_at: '2025-12-20'
    }
];

// ── Insert ────────────────────────────────────────────────────────────────────

async function seed() {
    console.log('\n🌱 Seeding Sanfe Exfoliating Gel product...\n');

    // Check if already exists
    const [existing] = await db.execute(
        'SELECT id FROM products WHERE slug = ? LIMIT 1',
        [product.slug]
    );

    let productId;

    if (existing.length > 0) {
        productId = existing[0].id;
        console.log(`⚠️  Product already exists (id: ${productId}) — updating with latest data...`);

        await db.execute(
            `UPDATE products SET
                name=?, description=?, shortDescription=?, resultTag=?, badge=?,
                price=?, salePrice=?, categoryId=?, brandId=?,
                images=?, variants=?, tags=?,
                benefits=?, whyLoveIt=?, keyIngredients=?,
                howToUse=?, additionalDetails=?, consumerCareDetails=?,
                faqs=?, promoImage=?, galleryMedia=?,
                avgRating=?, reviewCount=?, isActive=?, sortOrder=?,
                updated_at=NOW()
             WHERE id=?`,
            [
                product.name, product.description, product.shortDescription,
                product.resultTag, product.badge,
                product.price, product.salePrice, product.categoryId, product.brandId,
                product.images, product.variants, product.tags,
                product.benefits, product.whyLoveIt, product.keyIngredients,
                product.howToUse, product.additionalDetails, product.consumerCareDetails,
                product.faqs, product.promoImage, product.galleryMedia,
                product.avgRating, product.reviewCount, product.isActive, product.sortOrder,
                productId
            ]
        );
        console.log(`✅ Product updated (id: ${productId})`);

    } else {
        const [result] = await db.execute(
            `INSERT INTO products (
                name, slug, description, shortDescription, resultTag, badge,
                price, salePrice, categoryId, brandId,
                images, variants, tags,
                benefits, whyLoveIt, keyIngredients,
                howToUse, additionalDetails, consumerCareDetails,
                faqs, promoImage, galleryMedia,
                avgRating, reviewCount, isActive, sortOrder,
                created_at, updated_at
            ) VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,NOW(),NOW())`,
            [
                product.name, product.slug, product.description,
                product.shortDescription, product.resultTag, product.badge,
                product.price, product.salePrice, product.categoryId, product.brandId,
                product.images, product.variants, product.tags,
                product.benefits, product.whyLoveIt, product.keyIngredients,
                product.howToUse, product.additionalDetails, product.consumerCareDetails,
                product.faqs, product.promoImage, product.galleryMedia,
                product.avgRating, product.reviewCount, product.isActive, product.sortOrder
            ]
        );
        productId = result.insertId;
        console.log(`✅ Product inserted (id: ${productId})`);
    }

    // Insert reviews
    console.log('\n📝 Inserting reviews...');
    let revInserted = 0;

    for (const r of reviews) {
        try {
            await db.execute(
                `INSERT INTO product_reviews (productId, reviewerName, rating, title, body, isActive, created_at, updated_at)
                 VALUES (?, ?, ?, ?, ?, 1, ?, NOW())`,
                [productId, r.reviewerName, r.rating, r.title, r.body, r.created_at]
            );
            revInserted++;
            console.log(`   ✅ Review by ${r.reviewerName}`);
        } catch (err) {
            console.log(`   ⏭️  Skipped review by ${r.reviewerName}: ${err.message}`);
        }
    }

    // Update rating stats
    await db.execute(
        `UPDATE products SET
            avgRating = (SELECT IFNULL(AVG(rating), 0) FROM product_reviews WHERE productId = ? AND isActive = 1),
            reviewCount = (SELECT COUNT(*) FROM product_reviews WHERE productId = ? AND isActive = 1),
            updated_at = NOW()
         WHERE id = ?`,
        [productId, productId, productId]
    );

    console.log(`\n✅ ${revInserted} reviews inserted`);
    console.log(`\n🎉 Done! Product URL: /product/${product.slug}`);
    console.log(`   Product ID: ${productId}`);
    console.log(`   Category ID: ${product.categoryId}`);
    console.log(`   Brand ID: ${product.brandId}\n`);

    process.exit(0);
}

seed().catch(err => {
    console.error('\n❌ Seed failed:', err.message);
    console.error(err);
    process.exit(1);
});
