const db = require('../config/db');

const Contact = {
    create: async (data) => {
        const [r] = await db.execute(
            `INSERT INTO contact_leads (name, email, phone, message, isRead, created_at)
             VALUES (?, ?, ?, ?, 0, NOW())`,
            [data.name, data.email, data.phone || null, data.message]
        );
        return { status: 'success', data: { id: r.insertId } };
    },

    getAllByPage: async (limit, page, isRead) => {
        const offset = (page - 1) * limit;
        let where = '';
        const params = [];
        if (isRead !== undefined && isRead !== '') {
            where = 'WHERE isRead = ?';
            params.push(Number(isRead));
        }
        const [rows] = await db.execute(
            `SELECT * FROM contact_leads ${where} ORDER BY created_at DESC LIMIT ? OFFSET ?`,
            [...params, limit, offset]
        );
        const [cnt] = await db.execute(
            `SELECT COUNT(*) AS total FROM contact_leads ${where}`, params
        );
        return { status: 'success', data: rows, totalCount: cnt[0].total };
    },

    markRead: async (id, isRead) => {
        await db.execute(`UPDATE contact_leads SET isRead=? WHERE id=?`, [isRead ? 1 : 0, id]);
        return { status: 'success' };
    },

    delete: async (id) => {
        await db.execute(`DELETE FROM contact_leads WHERE id=?`, [id]);
        return { status: 'success' };
    },

    getUnreadCount: async () => {
        const [r] = await db.execute(`SELECT COUNT(*) AS cnt FROM contact_leads WHERE isRead=0`);
        return { status: 'success', count: r[0].cnt };
    }
};

module.exports = Contact;
