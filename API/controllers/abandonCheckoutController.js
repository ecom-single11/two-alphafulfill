const AbandonCheckout = require('../models/abandonCheckoutModel');

exports.upsert = async (req, res) => {
    try {
        const { sessionId, ...data } = req.body;
        if (!sessionId) return res.status(400).json({ error: 'sessionId required' });
        const id = await AbandonCheckout.upsert(sessionId, data);
        res.json({ success: true, id });
    } catch (err) {
        console.error('abandon upsert:', err);
        res.status(500).json({ error: 'Internal server error' });
    }
};

exports.getAll = async (req, res) => {
    try {
        const page  = parseInt(req.query.page)  || 1;
        const limit = parseInt(req.query.limit) || 20;
        const filters = {};
        if (req.query.isConverted !== undefined) {
            filters.isConverted = req.query.isConverted === '1' || req.query.isConverted === 'true';
        }
        const result = await AbandonCheckout.getAll(page, limit, filters);
        res.json(result);
    } catch (err) {
        console.error('abandon getAll:', err);
        res.status(500).json({ error: 'Internal server error' });
    }
};
