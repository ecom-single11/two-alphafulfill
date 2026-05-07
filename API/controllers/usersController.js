const jwt = require("jsonwebtoken");
const axios = require('axios');
const Users = require('../models/usersModel');

exports.createUser = async (req, res) => {
    try {
        const result = await Users.create(req.body);
        res.status(201).json({ message: 'User created', id: result.insertId });
    } catch (err) {
        console.error('Error creating User:', err);
        res.status(500).json({ error: 'Internal server error' });
    }
};

exports.getAllUsers = async (req, res) => {
    try {
        const results = await Users.getAll();
        res.status(200).json(results);
    } catch (err) {
        console.error('Error fetching Users:', err);
        res.status(500).json({ error: 'Internal server error' });
    }
};

exports.getAllUsersByPage = async (req, res) => {
    try {
        const { limit = 10, page = 1, searchtxt = '' } = req.query;

        const results = await Users.getAllByPage(Number(limit), Number(page), searchtxt);

        res.status(200).json({
            status: 'success',
            data: results.data,
            totalCount: results.totalCount,
            totalPages: Math.ceil(results.totalCount / limit),
            currentPage: page
        });
    } catch (err) {
        console.error('Error fetching Users:', err);
        res.status(500).json({ error: 'Internal server error' });
    }
};
exports.updateUser = async (req, res) => {
    const id = req.params.id;
    try {
        const results = await Users.update(id, req.body);
        res.status(200).json(results);
    } catch (err) {
        console.error('Error updating User:', err);
        res.status(500).json({ error: 'Internal server error' });
    }
};

exports.updateUserStatus = async (req, res) => {
    const id = req.params.id;
    const { isActive } = req.body;
    try {
        await Users.updateUserStatus(id, isActive);
        res.status(200).json({ message: 'User Status updated' });
    } catch (err) {
        console.error('Error updating User Status:', err);
        res.status(500).json({ error: 'Internal server error' });
    }
};

exports.deleteUser = async (req, res) => {
    const id = req.params.id;
    try {
        await Users.delete(id, req.userDetails);
        res.status(200).json({ message: 'User deleted' });
    } catch (err) {
        console.error('Error deleting User:', err);
        res.status(500).json({ error: 'Internal server error' });
    }
};

exports.loginUser = async (req, res) => {
    try {
        const { email, password } = req.body;

        const user = await Users.findByEmail(email);
        if (!user || !user.data) {
            return res.status(404).json({ error: 'User not found' });
        }

        if (password !== user.data.password) {
            return res.status(401).json({ error: 'Invalid credentials' });
        }

        const isActive = await Users.getUserStatus(user.data.id);
        if (!isActive) {
            return res.status(403).json({ error: 'User is Inactive' });
        }


        let token;
        if (user.data) {
            token = jwt.sign({ id: user.data.id, type: 'Administrator User' }, process.env.JWT_KEY);
            await Users.updateUserToken(user.data.id, token);
        }

        res.status(200).json({
            message: 'Login successful',
            user: user.data,
            token: token
        });

    } catch (err) {
        console.error('Error logging in user:', err);
        res.status(500).json({ error: 'Internal server error' });
    }
};