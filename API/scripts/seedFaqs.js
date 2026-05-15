/**
 * FAQ Seed Script — Sanfe FAQ data
 * Run: node scripts/seedFaqs.js
 */

require('dotenv').config({ path: require('path').join(__dirname, '../.env') });
const db = require('../config/db');

const topics = [
    { name: 'Delivery Related',       sortOrder: 1 },
    { name: 'Shopping Related',        sortOrder: 2 },
    { name: 'Product Related',         sortOrder: 3 },
    { name: 'Marketplace Related',     sortOrder: 4 },
    { name: 'Payment Related',         sortOrder: 5 },
    { name: 'Offer Related',           sortOrder: 6 },
    { name: 'Order Related',           sortOrder: 7 },
    { name: 'Collaboration Related',   sortOrder: 8 },
];

const faqsByTopic = {
    'Delivery Related': [
        { q: 'How long does delivery take?',              a: 'Orders are usually delivered within 3–7 working days, depending on your location.' },
        { q: 'Do you deliver across India?',              a: 'Yes, Sanfe offers pan-India delivery.' },
        { q: 'How can I track my delivery?',              a: 'Once your order is shipped, tracking details are shared via SMS or email.' },
        { q: 'What should I do if my order is delayed?',  a: 'If your order is delayed beyond the expected timeline, please contact our customer support team.' },
    ],
    'Shopping Related': [
        { q: 'Do I need an account to place an order?',       a: 'No, you can shop as a guest. However, creating an account helps you track orders easily.' },
        { q: 'Can I place multiple orders at the same time?', a: 'Yes, you can place multiple orders, but each order will be processed separately.' },
        { q: 'How do I know if a product is in stock?',       a: 'Product availability is mentioned on the product page.' },
        { q: 'Can I cancel my order after placing it?',       a: 'Orders can be cancelled only before they are shipped.' },
    ],
    'Product Related': [
        { q: 'Are Sanfe products safe to use?',               a: 'Yes, all Sanfe products are dermatologically tested and safe for regular use.' },
        { q: 'Are the products suitable for sensitive skin?',  a: 'Most products are suitable for sensitive skin. We recommend a patch test before first use.' },
        { q: 'How do I use a product correctly?',             a: 'Usage instructions are clearly mentioned on the product packaging and product page.' },
        { q: 'Are Sanfe products cruelty-free?',              a: 'Yes, Sanfe follows cruelty-free practices and does not test on animals.' },
    ],
    'Marketplace Related': [
        { q: 'Are Sanfe products available on marketplaces?',              a: 'Yes, Sanfe products are available on leading online marketplaces.' },
        { q: 'Will prices differ between the website and marketplaces?',   a: 'Prices and offers may vary depending on platform-specific promotions.' },
        { q: 'Can I return marketplace orders on the Sanfe website?',      a: 'No, marketplace orders must be returned or resolved through the same platform.' },
    ],
    'Payment Related': [
        { q: 'What payment methods are accepted?',              a: 'We accept UPI, debit cards, credit cards, net banking, wallets, and cash on delivery (COD).' },
        { q: 'Is cash on delivery available?',                  a: 'Yes, COD is available on selected locations.' },
        { q: 'Is online payment safe on Sanfe?',                a: 'Yes, all payments are processed through secure and trusted payment gateways.' },
        { q: 'What if my payment fails but money is deducted?', a: 'The amount is usually auto-refunded within 5–7 working days.' },
    ],
    'Offer Related': [
        { q: 'How can I find ongoing offers?',              a: 'All active offers are displayed on the website banners and product pages.' },
        { q: 'Can I use multiple offers on one order?',     a: 'Only one offer or coupon can be applied per order unless stated otherwise.' },
        { q: 'Why is my coupon not working?',               a: 'Coupons may have minimum order value, expiry dates, or product restrictions.' },
        { q: 'Do offers apply on discounted products?',     a: 'Some offers may not be applicable on already discounted products.' },
    ],
    'Order Related': [
        { q: 'How can I check my order status?',                a: 'Log in to your account or use the tracking link sent via SMS/email.' },
        { q: 'Can I modify my order after placing it?',         a: 'Order modification is not possible once the order is confirmed.' },
        { q: 'What if I receive a damaged or wrong product?',   a: 'Please contact customer support with images within 48 hours of delivery.' },
        { q: 'When will I receive my refund?',                  a: 'Refunds are processed within 5–7 working days after approval.' },
    ],
    'Collaboration Related': [
        { q: 'Does Sanfe collaborate with influencers or creators?', a: 'Yes, Sanfe collaborates with influencers, creators, and brands.' },
        { q: 'How can I apply for a collaboration?',                 a: 'You can reach out through the collaboration or contact page on the website.' },
        { q: 'What type of collaborations does Sanfe offer?',        a: 'We work on influencer campaigns, brand partnerships, and content collaborations.' },
        { q: 'How long does it take to get a response?',             a: 'Our team usually responds within 5–7 working days.' },
    ],
};

async function seed() {
    console.log('\n🌱 Seeding FAQs...\n');

    // Insert topics
    const topicIdMap = {};
    for (const t of topics) {
        // Check if exists
        const [existing] = await db.execute(
            `SELECT id FROM faq_topics WHERE name = ? LIMIT 1`, [t.name]
        );
        if (existing.length > 0) {
            topicIdMap[t.name] = existing[0].id;
            console.log(`   ⏭️  Topic exists: ${t.name} (id: ${existing[0].id})`);
        } else {
            const [r] = await db.execute(
                `INSERT INTO faq_topics (name, sortOrder, isActive, created_at, updated_at)
                 VALUES (?, ?, 1, NOW(), NOW())`,
                [t.name, t.sortOrder]
            );
            topicIdMap[t.name] = r.insertId;
            console.log(`   ✅ Topic created: ${t.name} (id: ${r.insertId})`);
        }
    }

    // Insert FAQs
    let total = 0;
    for (const [topicName, faqs] of Object.entries(faqsByTopic)) {
        const topicId = topicIdMap[topicName];
        for (let i = 0; i < faqs.length; i++) {
            const faq = faqs[i];
            const [existing] = await db.execute(
                `SELECT id FROM faqs WHERE question = ? AND topicId = ? LIMIT 1`,
                [faq.q, topicId]
            );
            if (existing.length > 0) {
                console.log(`   ⏭️  FAQ exists: ${faq.q.substring(0, 50)}...`);
                continue;
            }
            await db.execute(
                `INSERT INTO faqs (topicId, question, answer, sortOrder, isActive, created_at, updated_at)
                 VALUES (?, ?, ?, ?, 1, NOW(), NOW())`,
                [topicId, faq.q, faq.a, i + 1]
            );
            total++;
            console.log(`   ✅ FAQ: ${faq.q.substring(0, 60)}`);
        }
    }

    // Insert default FAQ config
    const [cfgExisting] = await db.execute(`SELECT id FROM faq_config LIMIT 1`);
    if (cfgExisting.length === 0) {
        await db.execute(
            `INSERT INTO faq_config (pageTitle, bannerImage, updated_at) VALUES (?, NULL, NOW())`,
            ['FAQs']
        );
        console.log('\n   ✅ FAQ config created');
    }

    console.log(`\n🎉 Done! ${total} FAQs inserted across ${topics.length} topics.\n`);
    process.exit(0);
}

seed().catch(err => {
    console.error('\n❌ Seed failed:', err.message);
    process.exit(1);
});
