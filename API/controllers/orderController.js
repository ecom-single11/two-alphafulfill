const { createOrder, getAllOrders, getAllOrdersForExport, getOrderById, getOrdersByCustomerId, updateOrderStatus } = require('../models/orderModel');
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

async function exportCSV(req, res) {
    try {
        const filters = {
            status:        req.query.status        || '',
            search:        req.query.search        || '',
            dateFrom:      req.query.dateFrom      || '',
            dateTo:        req.query.dateTo        || '',
            paymentMethod: req.query.paymentMethod || ''
        };

        const rows = await getAllOrdersForExport(filters);

        const headers = [
            'Order #', 'Order Date', 'Status',
            'Customer Name', 'Phone', 'Email',
            'Payment Method', 'Payment ID',
            'Items Summary', 'Items Detail',
            'Subtotal', 'Delivery Charge', 'Grand Total',
            'Address', 'Landmark', 'City', 'State', 'Pincode'
        ];

        const tryParse = (val, fallback) => {
            try { return typeof val === 'string' ? JSON.parse(val) : (val ?? fallback); }
            catch { return fallback; }
        };

        const csvRows = rows.map(o => {
            const items   = tryParse(o.items, []);
            const address = tryParse(o.deliveryAddress, null);
            const name    = `${o.firstName || ''} ${o.lastName || ''}`.trim() || o.guestName || '';

            const itemsSummary = items.map(i => `${i.name} x${i.quantity}`).join(' | ');
            const itemsDetail  = items.map(i => {
                const opts  = Object.entries(i.selectedOptions || {}).map(([k, v]) => `${k}:${v}`).join(',');
                const price = ((i.salePrice ?? i.price) * i.quantity).toFixed(2);
                return `${i.name}${opts ? ' ('+opts+')' : ''} x${i.quantity} = ${price}`;
            }).join(' | ');

            return [
                o.orderNumber,
                new Date(o.created_at).toLocaleString('en-IN'),
                o.status,
                name,
                o.contactPhone || '',
                o.email || o.guestEmail || '',
                o.paymentMethod || '',
                o.razorpayPaymentId || o.paymentId || '',
                itemsSummary,
                itemsDetail,
                o.subtotal,
                o.deliveryCharge,
                o.total,
                address?.line1 || '',
                address?.landmark || '',
                address?.city || '',
                address?.state || '',
                address?.postcode || ''
            ];
        });

        const csv = [headers, ...csvRows]
            .map(r => r.map(v => `"${String(v ?? '').replace(/"/g, '""')}"`).join(','))
            .join('\n');

        const filename = `orders_${new Date().toISOString().split('T')[0]}.csv`;
        res.setHeader('Content-Type', 'text/csv; charset=utf-8');
        res.setHeader('Content-Disposition', `attachment; filename="${filename}"`);
        res.send('\uFEFF' + csv); // BOM for Excel UTF-8
    } catch (err) {
        console.error('exportCSV:', err);
        res.status(500).json({ error: err.message });
    }
}

module.exports = { create, getAll, getById, getByCustomer, updateStatus, exportCSV };
