const db = require('../config/db');

const HomeBanner = {

    create: async (data) => {
        const sql = `INSERT INTO home_banners (type, url, forMobile, redirectionUrl, sortOrder, isActive, created_at, updated_at)
                     VALUES (?, ?, ?, ?, ?, ?, NOW(), NOW())`;
        try {
            const [results] = await db.execute(sql, [
                data.type,
                data.url,
                data.forMobile ? 1 : 0,
                data.redirectionUrl || null,
                data.sortOrder || 0,
                data.isActive !== undefined ? (data.isActive ? 1 : 0) : 1
            ]);
            return { status: 'success', data: results };
        } catch (err) {
            throw err;
        }
    },

    getAll: async () => {
        try {
            const [results] = await db.execute(
                `SELECT * FROM home_banners ORDER BY sortOrder ASC, created_at DESC`
            );
            return { status: 'success', data: results };
        } catch (err) {
            throw err;
        }
    },

    getAllByPage: async (limit, pageNo, searchtxt) => {
        try {
            const offset = (pageNo - 1) * limit;

            let query = `SELECT * FROM home_banners`;
            let queryParams = [];

            if (searchtxt) {
                query += ` WHERE redirectionUrl LIKE ? OR type LIKE ?`;
                queryParams.push(`%${searchtxt}%`, `%${searchtxt}%`);
            }

            query += ` ORDER BY sortOrder ASC, created_at DESC LIMIT ? OFFSET ?`;
            queryParams.push(limit, offset);

            const [results] = await db.execute(query, queryParams);

            let countQuery = `SELECT COUNT(*) AS totalCount FROM home_banners`;
            let countParams = [];
            if (searchtxt) {
                countQuery += ` WHERE redirectionUrl LIKE ? OR type LIKE ?`;
                countParams.push(`%${searchtxt}%`, `%${searchtxt}%`);
            }
            const [totalCountResults] = await db.execute(countQuery, countParams);
            const totalCount = totalCountResults[0].totalCount;

            return { status: 'success', data: results, totalCount };
        } catch (err) {
            throw err;
        }
    },

    // Only active banners for UI (public)
    getActiveForUI: async () => {
        try {
            const [results] = await db.execute(
                `SELECT id, type, url, forMobile, redirectionUrl FROM home_banners WHERE isActive = 1 ORDER BY sortOrder ASC, created_at DESC`
            );
            return { status: 'success', data: results };
        } catch (err) {
            throw err;
        }
    },

    update: async (id, data) => {
        const sql = `UPDATE home_banners SET type = ?, url = ?, forMobile = ?, redirectionUrl = ?, sortOrder = ?, isActive = ?, updated_at = NOW() WHERE id = ?`;
        try {
            const [results] = await db.execute(sql, [
                data.type,
                data.url,
                data.forMobile ? 1 : 0,
                data.redirectionUrl || null,
                data.sortOrder || 0,
                data.isActive !== undefined ? (data.isActive ? 1 : 0) : 1,
                id
            ]);
            return { status: 'success', data: results };
        } catch (err) {
            throw err;
        }
    },

    updateStatus: async (id, isActive) => {
        const sql = `UPDATE home_banners SET isActive = ?, updated_at = NOW() WHERE id = ?`;
        try {
            const [results] = await db.execute(sql, [isActive ? 1 : 0, id]);
            return { status: 'success', data: results };
        } catch (err) {
            throw err;
        }
    },

    delete: async (id) => {
        try {
            const [results] = await db.execute(`DELETE FROM home_banners WHERE id = ?`, [id]);
            return results;
        } catch (err) {
            throw err;
        }
    }
};

module.exports = HomeBanner;
