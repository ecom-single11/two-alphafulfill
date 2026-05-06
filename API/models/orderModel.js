const db = require('../config/db');

async function createOrder(data) {
    const now = new Date();
    const [result] = await db.execute(
        `INSERT INTO orders
            (customerId, orderNumber, items, subtotal, deliveryCharge, total,
             deliveryAddress, contactPhone, guestName, guestEmail,
             paymentMethod, paymentId, razorpayOrderId, razorpayPaymentId,
             status, notes, created_at, updated_at)
         VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)`,
        [
            data.customerId        || null,
            data.orderNumber,
            JSON.stringify(data.items || []),
            data.subtotal          || 0,
            data.deliveryCharge    ?? 0,
            data.total             || 0,
            JSON.stringify(data.deliveryAddress || null),
            data.contactPhone      || null,
            data.guestName         || null,
            data.guestEmail        || null,
            data.paymentMethod     || 'cod',
            data.paymentId         || null,
            data.razorpayOrderId   || null,
            data.razorpayPaymentId || null,
            data.status            || 'confirmed',
            data.notes             || null,
            now, now
        ]
    );
    return result.insertId;
}

async function getAllOrders(page = 1, limit = 20, filters = {}) {
    const offset = (page - 1) * limit;

    // ── Build WHERE clause ────────────────────────────────────────────────────
    const conditions = [];
    const params     = [];

    if (filters.status) {
        conditions.push('o.status = ?');
        params.push(filters.status);
    }
    if (filters.search) {
        conditions.push('(o.orderNumber LIKE ? OR o.guestName LIKE ? OR o.guestEmail LIKE ? OR o.contactPhone LIKE ? OR CONCAT(c.firstName," ",c.lastName) LIKE ?)');
        const like = `%${filters.search}%`;
        params.push(like, like, like, like, like);
    }
    if (filters.dateFrom) {
        conditions.push('DATE(o.created_at) >= ?');
        params.push(filters.dateFrom);
    }
    if (filters.dateTo) {
        conditions.push('DATE(o.created_at) <= ?');
        params.push(filters.dateTo);
    }
    if (filters.paymentMethod) {
        conditions.push('o.paymentMethod = ?');
        params.push(filters.paymentMethod);
    }

    const where = conditions.length ? `WHERE ${conditions.join(' AND ')}` : '';

    // ── Orders ────────────────────────────────────────────────────────────────
    const [rows] = await db.execute(
        `SELECT o.*,
                COALESCE(c.firstName, '') AS firstName,
                COALESCE(c.lastName,  '') AS lastName,
                COALESCE(c.email, o.guestEmail) AS email
         FROM orders o
         LEFT JOIN customers c ON c.id = o.customerId
         ${where}
         ORDER BY o.created_at DESC
         LIMIT ? OFFSET ?`,
        [...params, limit, offset]
    );

    // ── Filtered total ────────────────────────────────────────────────────────
    const [[{ total }]] = await db.execute(
        `SELECT COUNT(*) as total FROM orders o
         LEFT JOIN customers c ON c.id = o.customerId ${where}`,
        params
    );

    // ── Status counts (always global, not filtered) ───────────────────────────
    const [statusCounts] = await db.execute(
        `SELECT status, COUNT(*) as cnt, COALESCE(SUM(total),0) as revenue
         FROM orders GROUP BY status`
    );

    const stats = {
        total: 0, pending: 0, confirmed: 0, processing: 0,
        shipped: 0, delivered: 0, cancelled: 0, revenue: 0
    };
    let grandTotal = 0;
    statusCounts.forEach((r) => {
        stats[r.status] = parseInt(r.cnt) || 0;
        grandTotal += parseInt(r.cnt) || 0;
        if (r.status !== 'cancelled') stats.revenue += parseFloat(r.revenue) || 0;
    });
    stats.total = grandTotal;

    return { orders: rows, total, page, limit, stats };
}

async function getOrderById(id) {
    const [rows] = await db.execute(
        `SELECT o.*,
                COALESCE(c.firstName, o.guestName) AS firstName,
                COALESCE(c.lastName,  '')           AS lastName,
                COALESCE(c.email, o.guestEmail)     AS email
         FROM orders o
         LEFT JOIN customers c ON c.id = o.customerId
         WHERE o.id = ?`,
        [id]
    );
    return rows[0] || null;
}

async function getOrdersByCustomerId(customerId) {
    const [rows] = await db.execute(
        'SELECT * FROM orders WHERE customerId = ? ORDER BY created_at DESC',
        [customerId]
    );
    return rows;
}

async function updateOrderStatus(id, status) {
    const now = new Date();
    await db.execute('UPDATE orders SET status=?, updated_at=? WHERE id=?', [status, now, id]);
    return await getOrderById(id);
}

module.exports = { createOrder, getAllOrders, getOrderById, getOrdersByCustomerId, updateOrderStatus };
