const db = require('../config/db');

const PromoBanner = {

    getAll: async () => {
        const [rows] = await db.execute(
            `SELECT * FROM promo_banners ORDER BY rowIndex ASC, colIndex ASC`
        );
        return rows;
    },

    // Public — active only, grouped by row
    getActive: async () => {
        const [rows] = await db.execute(
            `SELECT * FROM promo_banners WHERE isActive = 1 ORDER BY rowIndex ASC, colIndex ASC`
        );
        // Group into rows: { 0: [...], 1: [...], 2: [...] }
        const grouped = {};
        rows.forEach(r => {
            if (!grouped[r.rowIndex]) grouped[r.rowIndex] = [];
            grouped[r.rowIndex].push(r);
        });
        return grouped;
    },

    upsert: async (rowIndex, colIndex, data) => {
        // Check if exists
        const [existing] = await db.execute(
            `SELECT id FROM promo_banners WHERE rowIndex = ? AND colIndex = ?`,
            [rowIndex, colIndex]
        );
        if (existing.length > 0) {
            await db.execute(
                `UPDATE promo_banners SET url=?, redirectionUrl=?, label=?, isActive=?, updated_at=NOW()
                 WHERE rowIndex=? AND colIndex=?`,
                [data.url || null, data.redirectionUrl || null, data.label || null, data.isActive ? 1 : 0, rowIndex, colIndex]
            );
        } else {
            await db.execute(
                `INSERT INTO promo_banners (rowIndex, colIndex, url, redirectionUrl, label, isActive, created_at, updated_at)
                 VALUES (?,?,?,?,?,?,NOW(),NOW())`,
                [rowIndex, colIndex, data.url || null, data.redirectionUrl || null, data.label || null, data.isActive ? 1 : 0]
            );
        }
        return { status: 'success' };
    },

    updateStatus: async (rowIndex, colIndex, isActive) => {
        await db.execute(
            `UPDATE promo_banners SET isActive=?, updated_at=NOW() WHERE rowIndex=? AND colIndex=?`,
            [isActive ? 1 : 0, rowIndex, colIndex]
        );
        return { status: 'success' };
    },

    clearSlot: async (rowIndex, colIndex) => {
        await db.execute(
            `UPDATE promo_banners SET url=NULL, redirectionUrl=NULL, label=NULL, updated_at=NOW()
             WHERE rowIndex=? AND colIndex=?`,
            [rowIndex, colIndex]
        );
        return { status: 'success' };
    }
};

module.exports = PromoBanner;
