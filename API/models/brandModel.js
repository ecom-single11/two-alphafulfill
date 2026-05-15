const db = require('../config/db');

const Brand = {

    create: async (data) => {
        const conn = await db.getConnection();
        try {
            await conn.beginTransaction();

            const [result] = await conn.execute(
                `INSERT INTO brands (name, image, sortOrder, isActive, created_at, updated_at)
                 VALUES (?, ?, ?, ?, NOW(), NOW())`,
                [data.name, data.image || null, data.sortOrder || 0, data.isActive !== undefined ? (data.isActive ? 1 : 0) : 1]
            );
            const brandId = result.insertId;

            // Insert category mappings
            if (data.categoryIds && data.categoryIds.length > 0) {
                const vals = data.categoryIds.map(cid => [brandId, cid]);
                await conn.query(`INSERT INTO brand_categories (brandId, categoryId) VALUES ?`, [vals]);
            }

            await conn.commit();
            return { status: 'success', data: { id: brandId } };
        } catch (err) {
            await conn.rollback();
            throw err;
        } finally {
            conn.release();
        }
    },

    getAllByPage: async (limit, pageNo, searchtxt) => {
        try {
            const offset = (pageNo - 1) * limit;
            let query = `SELECT b.*, GROUP_CONCAT(bc.categoryId) AS categoryIds FROM brands b LEFT JOIN brand_categories bc ON b.id = bc.brandId`;
            let queryParams = [];

            if (searchtxt) {
                query += ` WHERE b.name LIKE ?`;
                queryParams.push(`%${searchtxt}%`);
            }

            query += ` GROUP BY b.id ORDER BY b.sortOrder ASC, b.name ASC LIMIT ? OFFSET ?`;
            queryParams.push(limit, offset);

            const [results] = await db.execute(query, queryParams);

            // Parse categoryIds string → array
            const parsed = results.map(r => ({
                ...r,
                categoryIds: r.categoryIds ? r.categoryIds.split(',').map(Number) : []
            }));

            let countQuery = `SELECT COUNT(*) AS totalCount FROM brands b`;
            let countParams = [];
            if (searchtxt) {
                countQuery += ` WHERE b.name LIKE ?`;
                countParams.push(`%${searchtxt}%`);
            }
            const [countResult] = await db.execute(countQuery, countParams);

            return { status: 'success', data: parsed, totalCount: countResult[0].totalCount };
        } catch (err) { throw err; }
    },

    getAll: async () => {
        try {
            const [results] = await db.execute(
                `SELECT b.*, GROUP_CONCAT(bc.categoryId) AS categoryIds
                 FROM brands b
                 LEFT JOIN brand_categories bc ON b.id = bc.brandId
                 GROUP BY b.id
                 ORDER BY b.sortOrder ASC, b.name ASC`
            );
            const parsed = results.map(r => ({
                ...r,
                categoryIds: r.categoryIds ? r.categoryIds.split(',').map(Number) : []
            }));
            return { status: 'success', data: parsed };
        } catch (err) { throw err; }
    },

    getById: async (id) => {
        try {
            const [results] = await db.execute(
                `SELECT b.*, GROUP_CONCAT(bc.categoryId) AS categoryIds
                 FROM brands b
                 LEFT JOIN brand_categories bc ON b.id = bc.brandId
                 WHERE b.id = ?
                 GROUP BY b.id`,
                [id]
            );
            if (!results[0]) return { status: 'success', data: null };
            const r = results[0];
            return {
                status: 'success',
                data: { ...r, categoryIds: r.categoryIds ? r.categoryIds.split(',').map(Number) : [] }
            };
        } catch (err) { throw err; }
    },

    update: async (id, data) => {
        const conn = await db.getConnection();
        try {
            await conn.beginTransaction();

            await conn.execute(
                `UPDATE brands SET name = ?, image = ?, sortOrder = ?, isActive = ?, updated_at = NOW() WHERE id = ?`,
                [data.name, data.image || null, data.sortOrder || 0, data.isActive !== undefined ? (data.isActive ? 1 : 0) : 1, id]
            );

            // Replace category mappings
            await conn.execute(`DELETE FROM brand_categories WHERE brandId = ?`, [id]);
            if (data.categoryIds && data.categoryIds.length > 0) {
                const vals = data.categoryIds.map(cid => [id, cid]);
                await conn.query(`INSERT INTO brand_categories (brandId, categoryId) VALUES ?`, [vals]);
            }

            await conn.commit();
            return { status: 'success' };
        } catch (err) {
            await conn.rollback();
            throw err;
        } finally {
            conn.release();
        }
    },

    updateStatus: async (id, isActive) => {
        try {
            await db.execute(`UPDATE brands SET isActive = ?, updated_at = NOW() WHERE id = ?`, [isActive ? 1 : 0, id]);
            return { status: 'success' };
        } catch (err) { throw err; }
    },

    delete: async (id) => {
        try {
            await db.execute(`DELETE FROM brands WHERE id = ?`, [id]);
            return { status: 'success' };
        } catch (err) { throw err; }
    },

    // Public — active brands with their categories
    getActiveForUI: async () => {
        try {
            const [results] = await db.execute(
                `SELECT b.id, b.name, b.image, GROUP_CONCAT(bc.categoryId) AS categoryIds
                 FROM brands b
                 LEFT JOIN brand_categories bc ON b.id = bc.brandId
                 WHERE b.isActive = 1
                 GROUP BY b.id
                 ORDER BY b.sortOrder ASC, b.name ASC`
            );
            const parsed = results.map(r => ({
                ...r,
                categoryIds: r.categoryIds ? r.categoryIds.split(',').map(Number) : []
            }));
            return { status: 'success', data: parsed };
        } catch (err) { throw err; }
    }
};

module.exports = Brand;
