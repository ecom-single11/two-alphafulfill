const Contact = require('../models/contactModel');

exports.submit = async (req, res) => {
    try {
        const { name, email, phone, message } = req.body;
        if (!name?.trim() || !email?.trim() || !message?.trim()) {
            return res.status(400).json({ error: 'Name, email and message are required' });
        }
        const result = await Contact.create({ name, email, phone, message });
        res.status(201).json({ message: 'Message sent successfully', data: result.data });
    } catch (e) {
        console.error('contact submit:', e);
        res.status(500).json({ error: 'Server error' });
    }
};

exports.getAll = async (req, res) => {
    try {
        const { limit = 20, page = 1, isRead } = req.query;
        const result = await Contact.getAllByPage(Number(limit), Number(page), isRead);
        res.json({ ...result, totalPages: Math.ceil(result.totalCount / Number(limit)) });
    } catch (e) { res.status(500).json({ error: 'Server error' }); }
};

exports.markRead = async (req, res) => {
    try {
        await Contact.markRead(req.params.id, req.body.isRead);
        res.json({ message: 'Updated' });
    } catch (e) { res.status(500).json({ error: 'Server error' }); }
};

exports.delete = async (req, res) => {
    try {
        await Contact.delete(req.params.id);
        res.json({ message: 'Deleted' });
    } catch (e) { res.status(500).json({ error: 'Server error' }); }
};

exports.unreadCount = async (req, res) => {
    try { res.json(await Contact.getUnreadCount()); }
    catch (e) { res.status(500).json({ error: 'Server error' }); }
};
