const { createOrder, getAllOrders, getOrderById, getOrdersByCustomerId, updateOrderStatus } = require('../models/orderModel');
const AbandonCheckout = require('../models/abandonCheckoutModel');

async function create(req, res) {
    try {
        const data = req.body;
        if (!data.items || !data.total) {
            return res.status(400).json({ error: 'Missing required fields' });
        }
        data.orderNumber = `ORD-${Date.now()}`;
        const id = await createOrder(data);
        const order = await getOrderById(id);

        if (data.sessionId) {
            try { await AbandonCheckout.markConverted(data.sessionId, id); } catch {}
        }

        res.json({ success: true, data: order });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
}

async function getAll(req, res) {
    try {
        const page   = parseInt(req.query.page)  || 1;
        const limit  = parseInt(req.query.limit) || 20;
        const filters = {
            status:        req.query.status        || '',
            search:        req.query.search        || '',
            dateFrom:      req.query.dateFrom      || '',
            dateTo:        req.query.dateTo        || '',
            paymentMethod: req.query.paymentMethod || ''
        };
        const result = await getAllOrders(page, limit, filters);
        res.json(result);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
}

async function getById(req, res) {
    try {
        const order = await getOrderById(req.params.id);
        if (!order) return res.status(404).json({ error: 'Order not found' });
        res.json({ data: order });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
}

async function getByCustomer(req, res) {
    try {
        const orders = await getOrdersByCustomerId(req.params.customerId);
        res.json({ data: orders });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
}

async function updateStatus(req, res) {
    try {
        const { status } = req.body;
        const order = await updateOrderStatus(req.params.id, status);
        res.json({ success: true, data: order });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
}

module.exports = { create, getAll, getById, getByCustomer, updateStatus };
