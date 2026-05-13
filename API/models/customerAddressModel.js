const db = require('../config/db');

const CustomerAddress = {

    getAll: async (customerId) => {
        const [rows] = await db.execute(
            'SELECT * FROM customer_addresses WHERE customerId = ? ORDER BY isDefault DESC, created_at DESC',
            [customerId]
        );
        return rows;
    },

    create: async (customerId, data) => {
        // If this is the first address or marked as default, clear other defaults
        if (data.isDefault) {
            await db.execute('UPDATE customer_addresses SET isDefault = 0 WHERE customerId = ?', [customerId]);
        }
        const [result] = await db.execute(
            `INSERT INTO customer_addresses (customerId, firstName, lastName, line1, line2, city, county, postcode, country, phone, isDefault, created_at, updated_at)
             VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, NOW(), NOW())`,
            [customerId, data.firstName, data.lastName, data.line1, data.line2 || null,
             data.city || null, data.county || null, data.postcode, data.country || 'United Kingdom',
             data.phone || null, data.isDefault ? 1 : 0]
        );
        return { id: result.insertId };
    },

    update: async (id, customerId, data) => {
        if (data.isDefault) {
            await db.execute('UPDATE customer_addresses SET isDefault = 0 WHERE customerId = ?', [customerId]);
        }
        await db.execute(
            `UPDATE customer_addresses SET firstName=?, lastName=?, line1=?, line2=?, city=?, county=?, postcode=?, country=?, phone=?, isDefault=?, updated_at=NOW()
             WHERE id = ? AND customerId = ?`,
            [data.firstName, data.lastName, data.line1, data.line2 || null,
             data.city || null, data.county || null, data.postcode, data.country || 'United Kingdom',
             data.phone || null, data.isDefault ? 1 : 0, id, customerId]
        );
    },

    setDefault: async (id, customerId) => {
        await db.execute('UPDATE customer_addresses SET isDefault = 0 WHERE customerId = ?', [customerId]);
        await db.execute('UPDATE customer_addresses SET isDefault = 1, updated_at = NOW() WHERE id = ? AND customerId = ?', [id, customerId]);
    },

    delete: async (id, customerId) => {
        await db.execute('DELETE FROM customer_addresses WHERE id = ? AND customerId = ?', [id, customerId]);
    }
};

module.exports = CustomerAddress;
