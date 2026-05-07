const express = require('express');
const router = express.Router();
const customerController = require('../controllers/customerController');
const { auth } = require('../middlewares/auth.js');

// ── Customer auth middleware ───────────────────────────────────────────────────
const customerAuth = async (req, res, next) => {
    const token = req.headers['authorization']?.split(' ')[1];
    if (!token) return res.status(401).json({ error: 'Unauthorized' });
    try {
        const jwt = require('jsonwebtoken');
        const decoded = jwt.verify(token, process.env.JWT_KEY);
        if (decoded.type !== 'Customer') return res.status(403).json({ error: 'Forbidden' });
        req.customerDetails = decoded;
        next();
    } catch {
        return res.status(401).json({ error: 'Invalid token' });
    }
};

// ── Public (UI) ───────────────────────────────────────────────────────────────
router.post('/register', customerController.register);
router.post('/login',    customerController.login);
router.get('/profile',   customerAuth, customerController.getProfile);

// ── Admin (auth required) ─────────────────────────────────────────────────────
router.get('/getAllByPage',         auth, customerController.getAllByPage);
router.post('/createCustomer',      auth, customerController.createCustomer);
router.put('/updateCustomer/:id',   auth, customerController.updateCustomer);
router.put('/updateStatus/:id',     auth, customerController.updateStatus);
router.delete('/deleteCustomer/:id',auth, customerController.deleteCustomer);

module.exports = router;
