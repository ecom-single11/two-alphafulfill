const db = require('../config/db');

const AbandonCheckout = {

    upsert: async (sessionId, data) => {
        const now = new Date();
        const [existing] = await db.execute(
            'SELECT id FROM abandon_checkouts WHERE sessionId = ?', [sessionId]
        );
        if (existing.length > 0) {
            await db.execute(
                `UPDATE abandon_checkouts SET
                    name=?, email=?, phone=?,
                    address=?, items=?, subtotal=?, total=?, updated_at=?
                 WHERE sessionId=? AND isConverted=0`,
                [
                    data.name || null, data.email || null, data.phone || null,
                    JSON.stringify(data.address || null),
                    JSON.stringify(data.items || []),
                    data.subtotal || 0, data.total || 0,
                    now, sessionId
                ]
            );
            return existing[0].id;
        } else {
            const [result] = await db.execute(
                `INSERT INTO abandon_checkouts
                    (sessionId, name, email, phone, address, items, subtotal, total, isConverted, created_at, updated_at)
                 VALUES (?,?,?,?,?,?,?,?,0,?,?)`,
                [
                    sessionId,
                    data.name || null, data.email || null, data.phone || null,
                    JSON.stringify(data.address || null),
                    JSON.stringify(data.items || []),
                    data.subtotal || 0, data.total || 0,
                    now, now
                ]
            );
            return result.insertId;
        }
    },

    markConverted: async (sessionId, orderId) => {
        await db.execute(
            'UPDATE abandon_checkouts SET isConverted=1, orderId=?, updated_at=NOW() WHERE sessionId=?',
            [orderId, sessionId]
        );
    },

    getAll: async (page = 1, limit = 20, filters = {}) => {
        const offset = (page - 1) * limit;
        let where = [];
        let params = [];

        if (filters.isConverted !== undefined) {
            where.push('isConverted = ?');
            params.push(filters.isConverted ? 1 : 0);
        }

        const whereClause = where.length ? `WHERE ${where.join(' AND ')}` : '';

        const [rows] = await db.execute(
            `SELECT * FROM abandon_checkouts ${whereClause} ORDER BY updated_at DESC LIMIT ? OFFSET ?`,
            [...params, limit, offset]
        );
        const [[{ total }]] = await db.execute(
            `SELECT COUNT(*) as total FROM abandon_checkouts ${whereClause}`, params
        );
        const [[{ totalCount }]]     = await db.execute('SELECT COUNT(*) as totalCount FROM abandon_checkouts');
        const [[{ abandonedCount }]] = await db.execute('SELECT COUNT(*) as abandonedCount FROM abandon_checkouts WHERE isConverted=0');
        const [[{ convertedCount }]] = await db.execute('SELECT COUNT(*) as convertedCount FROM abandon_checkouts WHERE isConverted=1');

        return {
            data: rows.map(r => ({
                ...r,
                address: AbandonCheckout._tryParse(r.address, null),
                items:   AbandonCheckout._tryParse(r.items, []),
            })),
            total, page, limit,
            totalCount, abandonedCount, convertedCount
        };
    },

    _tryParse: (val, fallback) => {
        try { return val ? JSON.parse(val) : fallback; } catch { return fallback; }
    }
};

module.exports = AbandonCheckout;
