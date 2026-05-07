const jwt = require('jsonwebtoken');
const Customer = require('../models/customerModel');

// ── UI: Register ──────────────────────────────────────────────────────────────
exports.register = async (req, res) => {
    try {
        const { firstName, lastName, email, password, mobile, dateOfBirth } = req.body;

        if (!firstName || !lastName || !email || !password) {
            return res.status(400).json({ error: 'Required fields missing' });
        }

        // Check duplicate email
        const existing = await Customer.findByEmail(email);
        if (existing) {
            return res.status(409).json({ error: 'An account with this email already exists' });
        }

        await Customer.register({ firstName, lastName, email, password, mobile, dateOfBirth });

        // Auto-login after register
        const customer = await Customer.findByEmail(email);
        const token = jwt.sign({ id: customer.id, type: 'Customer' }, process.env.JWT_KEY);
        await Customer.updateToken(customer.id, token);

        const { password: _, token: __, ...safeCustomer } = customer;

        res.status(201).json({ message: 'Account created', customer: safeCustomer, token });
    } catch (err) {
        console.error('Register error:', err);
        res.status(500).json({ error: 'Internal server error' });
    }
};

// ── UI: Login ─────────────────────────────────────────────────────────────────
exports.login = async (req, res) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({ error: 'Email and password required' });
        }

        const customer = await Customer.findByEmail(email);
        if (!customer) {
            return res.status(404).json({ error: 'No account found with this email' });
        }

        if (password !== customer.password) {
            return res.status(401).json({ error: 'Incorrect password' });
        }

        if (!customer.isActive) {
            return res.status(403).json({ error: 'Your account has been deactivated' });
        }

        const token = jwt.sign({ id: customer.id, type: 'Customer' }, process.env.JWT_KEY);
        await Customer.updateToken(customer.id, token);

        const { password: _, token: __, ...safeCustomer } = customer;

        res.status(200).json({ message: 'Login successful', customer: safeCustomer, token });
    } catch (err) {
        console.error('Login error:', err);
        res.status(500).json({ error: 'Internal server error' });
    }
};

// ── UI: Get profile ───────────────────────────────────────────────────────────
exports.getProfile = async (req, res) => {
    try {
        const customer = await Customer.findById(req.customerDetails?.id);
        if (!customer) return res.status(404).json({ error: 'Customer not found' });
        res.status(200).json({ status: 'success', data: customer });
    } catch (err) {
        res.status(500).json({ error: 'Internal server error' });
    }
};

// ── Admin: Get all paginated ──────────────────────────────────────────────────
exports.getAllByPage = async (req, res) => {
    try {
        const { limit = 10, page = 1, searchtxt = '' } = req.query;
        const results = await Customer.getAllByPage(Number(limit), Number(page), searchtxt);
        res.status(200).json({
            status: 'success',
            data: results.data,
            totalCount: results.totalCount,
            totalPages: Math.ceil(results.totalCount / Number(limit)),
            currentPage: page
        });
    } catch (err) {
        res.status(500).json({ error: 'Internal server error' });
    }
};

// ── Admin: Create customer ────────────────────────────────────────────────────
exports.createCustomer = async (req, res) => {
    try {
        const existing = await Customer.findByEmail(req.body.email);
        if (existing) return res.status(409).json({ error: 'Email already exists' });
        await Customer.create(req.body);
        res.status(201).json({ message: 'Customer created' });
    } catch (err) {
        res.status(500).json({ error: 'Internal server error' });
    }
};

// ── Admin: Update customer ────────────────────────────────────────────────────
exports.updateCustomer = async (req, res) => {
    try {
        await Customer.update(req.params.id, req.body);
        res.status(200).json({ message: 'Customer updated' });
    } catch (err) {
        res.status(500).json({ error: 'Internal server error' });
    }
};

// ── Admin: Update status ──────────────────────────────────────────────────────
exports.updateStatus = async (req, res) => {
    try {
        await Customer.updateStatus(req.params.id, req.body.isActive);
        res.status(200).json({ message: 'Status updated' });
    } catch (err) {
        res.status(500).json({ error: 'Internal server error' });
    }
};

// ── Admin: Delete ─────────────────────────────────────────────────────────────
exports.deleteCustomer = async (req, res) => {
    try {
        await Customer.delete(req.params.id);
        res.status(200).json({ message: 'Customer deleted' });
    } catch (err) {
        res.status(500).json({ error: 'Internal server error' });
    }
};
