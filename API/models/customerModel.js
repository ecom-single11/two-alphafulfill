const db = require('../config/db');
const jwt = require('jsonwebtoken');

const Customer = {

    register: async (data) => {
        const sql = `INSERT INTO customers (firstName, lastName, email, password, mobile, dateOfBirth, isActive, created_at, updated_at)
                     VALUES (?, ?, ?, ?, ?, ?, 1, NOW(), NOW())`;
        try {
            const [results] = await db.execute(sql, [
                data.firstName, data.lastName, data.email,
                data.password, data.mobile || null, data.dateOfBirth || null
            ]);
            return { status: 'success', data: results };
        } catch (err) { throw err; }
    },

    findByEmail: async (email) => {
        try {
            const [results] = await db.execute('SELECT * FROM customers WHERE email = ?', [email]);
            return results[0] || null;
        } catch (err) { throw err; }
    },

    findById: async (id) => {
        try {
            const [results] = await db.execute(
                'SELECT id, firstName, lastName, email, mobile, dateOfBirth, isActive, created_at FROM customers WHERE id = ?',
                [id]
            );
            return results[0] || null;
        } catch (err) { throw err; }
    },

    updateToken: async (id, token) => {
        try {
            await db.execute('UPDATE customers SET token = ?, updated_at = NOW() WHERE id = ?', [token, id]);
        } catch (err) { throw err; }
    },

    updateProfile: async (id, data) => {
        try {
            await db.execute(
                'UPDATE customers SET firstName = ?, lastName = ?, mobile = ?, dateOfBirth = ?, updated_at = NOW() WHERE id = ?',
                [data.firstName, data.lastName, data.mobile || null, data.dateOfBirth || null, id]
            );
            return { status: 'success' };
        } catch (err) { throw err; }
    },

    // Admin: paginated list
    getAllByPage: async (limit, pageNo, searchtxt) => {
        try {
            const offset = (pageNo - 1) * limit;
            let query = 'SELECT id, firstName, lastName, email, mobile, isActive, created_at FROM customers';
            let params = [];

            if (searchtxt) {
                query += ' WHERE firstName LIKE ? OR lastName LIKE ? OR email LIKE ?';
                params = [`%${searchtxt}%`, `%${searchtxt}%`, `%${searchtxt}%`];
            }

            query += ' ORDER BY created_at DESC LIMIT ? OFFSET ?';
            params.push(limit, offset);

            const [results] = await db.execute(query, params);

            let countQ = 'SELECT COUNT(*) AS totalCount FROM customers';
            let countP = [];
            if (searchtxt) {
                countQ += ' WHERE firstName LIKE ? OR lastName LIKE ? OR email LIKE ?';
                countP = [`%${searchtxt}%`, `%${searchtxt}%`, `%${searchtxt}%`];
            }
            const [countResult] = await db.execute(countQ, countP);

            return { status: 'success', data: results, totalCount: countResult[0].totalCount };
        } catch (err) { throw err; }
    },

    // Admin: create customer
    create: async (data) => {
        return Customer.register(data);
    },

    // Admin: update
    update: async (id, data) => {
        try {
            await db.execute(
                'UPDATE customers SET firstName = ?, lastName = ?, email = ?, mobile = ?, dateOfBirth = ?, updated_at = NOW() WHERE id = ?',
                [data.firstName, data.lastName, data.email, data.mobile || null, data.dateOfBirth || null, id]
            );
            return { status: 'success' };
        } catch (err) { throw err; }
    },

    updateStatus: async (id, isActive) => {
        try {
            await db.execute('UPDATE customers SET isActive = ?, updated_at = NOW() WHERE id = ?', [isActive ? 1 : 0, id]);
            return { status: 'success' };
        } catch (err) { throw err; }
    },

    delete: async (id) => {
        try {
            await db.execute('DELETE FROM customers WHERE id = ?', [id]);
            return { status: 'success' };
        } catch (err) { throw err; }
    }
};

module.exports = Customer;
