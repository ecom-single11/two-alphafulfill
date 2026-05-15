const CustomerAddress = require('../models/customerAddressModel');
const jwt = require('jsonwebtoken');

// Extract customer id from JWT token
const getCustomerId = (req) => {
    try {
        const token = req.headers['authorization']?.split(' ')[1];
        const decoded = jwt.verify(token, process.env.JWT_KEY);
        return decoded.id;
    } catch { return null; }
};

// ── Customer-facing endpoints ─────────────────────────────────────────────────

exports.getAddresses = async (req, res) => {
    const customerId = getCustomerId(req);
    if (!customerId) return res.status(401).json({ error: 'Unauthorized' });
    try {
        const addresses = await CustomerAddress.getAll(customerId);
        res.status(200).json({ status: 'success', data: addresses });
    } catch (err) {
        res.status(500).json({ error: 'Internal server error' });
    }
};

exports.createAddress = async (req, res) => {
    const customerId = getCustomerId(req);
    if (!customerId) return res.status(401).json({ error: 'Unauthorized' });
    try {
        const result = await CustomerAddress.create(customerId, req.body);
        res.status(201).json({ message: 'Address added', id: result.id });
    } catch (err) {
        res.status(500).json({ error: 'Internal server error' });
    }
};

exports.updateAddress = async (req, res) => {
    const customerId = getCustomerId(req);
    if (!customerId) return res.status(401).json({ error: 'Unauthorized' });
    try {
        await CustomerAddress.update(req.params.id, customerId, req.body);
        res.status(200).json({ message: 'Address updated' });
    } catch (err) {
        res.status(500).json({ error: 'Internal server error' });
    }
};

exports.setDefault = async (req, res) => {
    const customerId = getCustomerId(req);
    if (!customerId) return res.status(401).json({ error: 'Unauthorized' });
    try {
        await CustomerAddress.setDefault(req.params.id, customerId);
        res.status(200).json({ message: 'Default address updated' });
    } catch (err) {
        res.status(500).json({ error: 'Internal server error' });
    }
};

exports.deleteAddress = async (req, res) => {
    const customerId = getCustomerId(req);
    if (!customerId) return res.status(401).json({ error: 'Unauthorized' });
    try {
        await CustomerAddress.delete(req.params.id, customerId);
        res.status(200).json({ message: 'Address deleted' });
    } catch (err) {
        res.status(500).json({ error: 'Internal server error' });
    }
};

// ── Admin endpoint — get addresses for any customer ───────────────────────────
exports.getAddressesByCustomerId = async (req, res) => {
    try {
        const addresses = await CustomerAddress.getAll(req.params.customerId);
        res.status(200).json({ status: 'success', data: addresses });
    } catch (err) {
        res.status(500).json({ error: 'Internal server error' });
    }
};
