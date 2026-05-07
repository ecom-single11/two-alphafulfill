const db = require('../config/db');

const Category = {

    // Create a category (root or child)
    create: async (data) => {
        const sql = `INSERT INTO categories (name, image, parentId, sortOrder, isActive, created_at, updated_at)
                     VALUES (?, ?, ?, ?, ?, NOW(), NOW())`;
        try {
            const [results] = await db.execute(sql, [
                data.name,
                data.image || null,
                data.parentId || null,
                data.sortOrder || 0,
                data.isActive !== undefined ? (data.isActive ? 1 : 0) : 1
            ]);
            return { status: 'success', data: results };
        } catch (err) { throw err; }
    },

    // Get ALL categories flat (admin tree builder uses this)
    getAll: async () => {
        try {
            const [results] = await db.execute(
                `SELECT * FROM categories ORDER BY parentId ASC, sortOrder ASC, name ASC`
            );
            return { status: 'success', data: results };
        } catch (err) { throw err; }
    },

    // Paginated flat list for table view (admin)
    getAllByPage: async (limit, pageNo, searchtxt) => {
        try {
            const offset = (pageNo - 1) * limit;
            let query = `
                SELECT c.*, p.name AS parentName
                FROM categories c
                LEFT JOIN categories p ON c.parentId = p.id
            `;
            let queryParams = [];

            if (searchtxt) {
                query += ` WHERE c.name LIKE ?`;
                queryParams.push(`%${searchtxt}%`);
            }

            query += ` ORDER BY c.parentId ASC, c.sortOrder ASC, c.name ASC LIMIT ? OFFSET ?`;
            queryParams.push(limit, offset);

            const [results] = await db.execute(query, queryParams);

            let countQuery = `SELECT COUNT(*) AS totalCount FROM categories c`;
            let countParams = [];
            if (searchtxt) {
                countQuery += ` WHERE c.name LIKE ?`;
                countParams.push(`%${searchtxt}%`);
            }
            const [countResult] = await db.execute(countQuery, countParams);

            return { status: 'success', data: results, totalCount: countResult[0].totalCount };
        } catch (err) { throw err; }
    },

    // Get direct children of a parentId (null = root)
    getChildren: async (parentId) => {
        try {
            let query, params;
            if (parentId === null || parentId === undefined) {
                query = `SELECT * FROM categories WHERE parentId IS NULL ORDER BY sortOrder ASC, name ASC`;
                params = [];
            } else {
                query = `SELECT * FROM categories WHERE parentId = ? ORDER BY sortOrder ASC, name ASC`;
                params = [parentId];
            }
            const [results] = await db.execute(query, params);
            return { status: 'success', data: results };
        } catch (err) { throw err; }
    },

    // Get single category by id
    getById: async (id) => {
        try {
            const [results] = await db.execute(`SELECT * FROM categories WHERE id = ?`, [id]);
            return { status: 'success', data: results[0] || null };
        } catch (err) { throw err; }
    },

    update: async (id, data) => {
        const sql = `UPDATE categories SET name = ?, image = ?, parentId = ?, sortOrder = ?, isActive = ?, updated_at = NOW() WHERE id = ?`;
        try {
            const [results] = await db.execute(sql, [
                data.name,
                data.image || null,
                data.parentId || null,
                data.sortOrder || 0,
                data.isActive !== undefined ? (data.isActive ? 1 : 0) : 1,
                id
            ]);
            return { status: 'success', data: results };
        } catch (err) { throw err; }
    },

    updateStatus: async (id, isActive) => {
        try {
            const [results] = await db.execute(
                `UPDATE categories SET isActive = ?, updated_at = NOW() WHERE id = ?`,
                [isActive ? 1 : 0, id]
            );
            return { status: 'success', data: results };
        } catch (err) { throw err; }
    },

    // Cascade delete handled by FK ON DELETE CASCADE
    delete: async (id) => {
        try {
            const [results] = await db.execute(`DELETE FROM categories WHERE id = ?`, [id]);
            return results;
        } catch (err) { throw err; }
    },

    // Check if a category has children
    hasChildren: async (id) => {
        try {
            const [results] = await db.execute(
                `SELECT COUNT(*) AS cnt FROM categories WHERE parentId = ?`, [id]
            );
            return results[0].cnt > 0;
        } catch (err) { throw err; }
    }
};

module.exports = Category;
