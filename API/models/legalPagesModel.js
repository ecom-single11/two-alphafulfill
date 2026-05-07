const db = require('../config/db');

const DEFAULTS = [
    { slug: 'shipping-policy',   title: 'Shipping Policy' },
    { slug: 'return-refund',     title: 'Return & Refund Policy' },
    { slug: 'privacy-policy',    title: 'Privacy Policy' },
    { slug: 'terms-conditions',  title: 'Terms & Conditions' },
];

const LegalPages = {

    getAll: async () => {
        const [rows] = await db.execute('SELECT * FROM legal_pages ORDER BY id ASC');
        // Ensure all 4 defaults exist in response
        const map = {};
        rows.forEach(r => { map[r.slug] = r; });
        const result = DEFAULTS.map(d => map[d.slug] || { id: null, slug: d.slug, title: d.title, content: '' });
        return { status: 'success', data: result };
    },

    getBySlug: async (slug) => {
        const [rows] = await db.execute('SELECT * FROM legal_pages WHERE slug = ?', [slug]);
        if (rows[0]) return { status: 'success', data: rows[0] };
        const def = DEFAULTS.find(d => d.slug === slug);
        if (def) return { status: 'success', data: { id: null, slug: def.slug, title: def.title, content: '' } };
        return { status: 'success', data: null };
    },

    upsert: async (slug, title, content) => {
        const now = new Date();
        const [existing] = await db.execute('SELECT id FROM legal_pages WHERE slug = ?', [slug]);
        if (existing.length > 0) {
            await db.execute('UPDATE legal_pages SET title=?, content=?, updated_at=? WHERE slug=?',
                [title, content || '', now, slug]);
        } else {
            await db.execute('INSERT INTO legal_pages (slug, title, content, updated_at) VALUES (?,?,?,?)',
                [slug, title, content || '', now]);
        }
        return LegalPages.getBySlug(slug);
    }
};

module.exports = LegalPages;
