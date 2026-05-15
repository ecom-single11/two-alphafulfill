const db = require('../config/db');

const Review = {

    create: async (data) => {
        try {
            const [result] = await db.execute(
                `INSERT INTO product_reviews (productId, reviewerName, rating, title, body, isActive, created_at, updated_at)
                 VALUES (?, ?, ?, ?, ?, 1, NOW(), NOW())`,
                [data.productId, data.reviewerName, data.rating, data.title || '', data.body || '']
            );
            return { status: 'success', data: { id: result.insertId } };
        } catch (err) { throw err; }
    },

    getByProduct: async (productId, limit = 10, offset = 0, sort = 'newest') => {
        try {
            let orderBy = 'r.created_at DESC';
            if (sort === 'highest') orderBy = 'r.rating DESC, r.created_at DESC';
            if (sort === 'lowest')  orderBy = 'r.rating ASC, r.created_at DESC';

            const [results] = await db.execute(
                `SELECT * FROM product_reviews r
                 WHERE r.productId = ? AND r.isActive = 1
                 ORDER BY ${orderBy}
                 LIMIT ? OFFSET ?`,
                [productId, limit, offset]
            );

            const [countResult] = await db.execute(
                `SELECT COUNT(*) AS totalCount,
                        AVG(rating) AS avgRating,
                        SUM(rating = 5) AS star5,
                        SUM(rating = 4) AS star4,
                        SUM(rating = 3) AS star3,
                        SUM(rating = 2) AS star2,
                        SUM(rating = 1) AS star1
                 FROM product_reviews WHERE productId = ? AND isActive = 1`,
                [productId]
            );

            return {
                status: 'success',
                data: results,
                stats: countResult[0]
            };
        } catch (err) { throw err; }
    },

    getAllByPage: async (limit, pageNo, productId) => {
        try {
            const offset = (pageNo - 1) * limit;
            let where = productId ? `WHERE r.productId = ?` : '';
            let params = productId ? [productId] : [];

            const [results] = await db.execute(
                `SELECT r.*, p.name AS productName FROM product_reviews r
                 LEFT JOIN products p ON r.productId = p.id
                 ${where} ORDER BY r.created_at DESC LIMIT ? OFFSET ?`,
                [...params, limit, offset]
            );
            const [countResult] = await db.execute(
                `SELECT COUNT(*) AS totalCount FROM product_reviews r ${where}`, params
            );
            return { status: 'success', data: results, totalCount: countResult[0].totalCount };
        } catch (err) { throw err; }
    },

    updateStatus: async (id, isActive) => {
        try {
            await db.execute(`UPDATE product_reviews SET isActive=?, updated_at=NOW() WHERE id=?`, [isActive ? 1 : 0, id]);
            return { status: 'success' };
        } catch (err) { throw err; }
    },

    delete: async (id) => {
        try {
            await db.execute(`DELETE FROM product_reviews WHERE id=?`, [id]);
            return { status: 'success' };
        } catch (err) { throw err; }
    }
};

module.exports = Review;
