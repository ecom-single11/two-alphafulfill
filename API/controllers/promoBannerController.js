const PromoBanner = require('../models/promoBannerModel');

exports.getAll = async (req, res) => {
    try {
        const data = await PromoBanner.getAll();
        res.json({ status: 'success', data });
    } catch (err) {
        res.status(500).json({ error: 'Internal server error' });
    }
};

exports.getActive = async (req, res) => {
    try {
        const data = await PromoBanner.getActive();
        res.json({ status: 'success', data });
    } catch (err) {
        res.status(500).json({ error: 'Internal server error' });
    }
};

exports.upsert = async (req, res) => {
    try {
        const { rowIndex, colIndex } = req.params;
        await PromoBanner.upsert(+rowIndex, +colIndex, req.body);
        res.json({ status: 'success' });
    } catch (err) {
        res.status(500).json({ error: 'Internal server error' });
    }
};

exports.updateStatus = async (req, res) => {
    try {
        const { rowIndex, colIndex } = req.params;
        await PromoBanner.updateStatus(+rowIndex, +colIndex, req.body.isActive);
        res.json({ status: 'success' });
    } catch (err) {
        res.status(500).json({ error: 'Internal server error' });
    }
};

exports.clearSlot = async (req, res) => {
    try {
        const { rowIndex, colIndex } = req.params;
        await PromoBanner.clearSlot(+rowIndex, +colIndex);
        res.json({ status: 'success' });
    } catch (err) {
        res.status(500).json({ error: 'Internal server error' });
    }
};
