const db = require('../config/db');

// ── FAQ Topics ────────────────────────────────────────────────────────────────
const FaqTopic = {
    getAll: async () => {
        const [rows] = await db.execute(
            `SELECT * FROM faq_topics ORDER BY sortOrder ASC, id ASC`
        );
        return { status: 'success', data: rows };
    },
    create: async (data) => {
        const [r] = await db.execute(
            `INSERT INTO faq_topics (name, sortOrder, isActive, created_at, updated_at)
             VALUES (?, ?, ?, NOW(), NOW())`,
            [data.name, data.sortOrder || 0, data.isActive !== false ? 1 : 0]
        );
        return { status: 'success', data: { id: r.insertId } };
    },
    update: async (id, data) => {
        await db.execute(
            `UPDATE faq_topics SET name=?, sortOrder=?, isActive=?, updated_at=NOW() WHERE id=?`,
            [data.name, data.sortOrder || 0, data.isActive !== false ? 1 : 0, id]
        );
        return { status: 'success' };
    },
    delete: async (id) => {
        await db.execute(`DELETE FROM faq_topics WHERE id=?`, [id]);
        return { status: 'success' };
    }
};

// ── FAQs ──────────────────────────────────────────────────────────────────────
const Faq = {
    getAll: async (topicId = null) => {
        let sql = `SELECT f.*, t.name AS topicName
                   FROM faqs f
                   LEFT JOIN faq_topics t ON f.topicId = t.id`;
        const params = [];
        if (topicId) { sql += ` WHERE f.topicId = ?`; params.push(topicId); }
        sql += ` ORDER BY f.topicId ASC, f.sortOrder ASC, f.id ASC`;
        const [rows] = await db.execute(sql, params);
        return { status: 'success', data: rows };
    },

    // Public: active only, grouped by topic
    getPublic: async () => {
        const [topics] = await db.execute(
            `SELECT * FROM faq_topics WHERE isActive=1 ORDER BY sortOrder ASC, id ASC`
        );
        const [faqs] = await db.execute(
            `SELECT * FROM faqs WHERE isActive=1 ORDER BY topicId ASC, sortOrder ASC, id ASC`
        );
        const grouped = topics.map(t => ({
            ...t,
            faqs: faqs.filter(f => f.topicId === t.id)
        }));
        // Also include faqs with no topic
        const noTopic = faqs.filter(f => !f.topicId);
        return { status: 'success', data: grouped, noTopic };
    },

    // Home preview: first 5 active FAQs (no topic filter)
    getPreview: async (limit = 5) => {
        const [rows] = await db.execute(
            `SELECT f.id, f.question, f.answer FROM faqs f
             WHERE f.isActive=1
             ORDER BY f.sortOrder ASC, f.id ASC
             LIMIT ?`,
            [limit]
        );
        return { status: 'success', data: rows };
    },

    create: async (data) => {
        const [r] = await db.execute(
            `INSERT INTO faqs (topicId, question, answer, sortOrder, isActive, created_at, updated_at)
             VALUES (?, ?, ?, ?, ?, NOW(), NOW())`,
            [data.topicId || null, data.question, data.answer, data.sortOrder || 0, data.isActive !== false ? 1 : 0]
        );
        return { status: 'success', data: { id: r.insertId } };
    },
    update: async (id, data) => {
        await db.execute(
            `UPDATE faqs SET topicId=?, question=?, answer=?, sortOrder=?, isActive=?, updated_at=NOW() WHERE id=?`,
            [data.topicId || null, data.question, data.answer, data.sortOrder || 0, data.isActive !== false ? 1 : 0, id]
        );
        return { status: 'success' };
    },
    delete: async (id) => {
        await db.execute(`DELETE FROM faqs WHERE id=?`, [id]);
        return { status: 'success' };
    }
};

// ── FAQ Config ────────────────────────────────────────────────────────────────
const FaqConfig = {
    get: async () => {
        const [rows] = await db.execute(`SELECT * FROM faq_config LIMIT 1`);
        return { status: 'success', data: rows[0] || null };
    },
    upsert: async (data) => {
        const [existing] = await db.execute(`SELECT id FROM faq_config LIMIT 1`);
        if (existing.length > 0) {
            await db.execute(
                `UPDATE faq_config SET pageTitle=?, bannerImage=?, updated_at=NOW() WHERE id=?`,
                [data.pageTitle || 'FAQs', data.bannerImage || null, existing[0].id]
            );
        } else {
            await db.execute(
                `INSERT INTO faq_config (pageTitle, bannerImage, updated_at) VALUES (?, ?, NOW())`,
                [data.pageTitle || 'FAQs', data.bannerImage || null]
            );
        }
        return { status: 'success' };
    }
};

module.exports = { FaqTopic, Faq, FaqConfig };
