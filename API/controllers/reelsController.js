const Reels = require('../models/reelsModel');

exports.getAll = async (req, res) => {
    try { res.json(await Reels.getAll()); }
    catch (err) { res.status(500).json({ error: err.message }); }
};

exports.getActive = async (req, res) => {
    try { res.json(await Reels.getActive()); }
    catch (err) { res.status(500).json({ error: err.message }); }
};

exports.create = async (req, res) => {
    try {
        if (!req.body.videoUrl) return res.status(400).json({ error: 'videoUrl required' });
        res.status(201).json(await Reels.create(req.body));
    } catch (err) { res.status(500).json({ error: err.message }); }
};

exports.update = async (req, res) => {
    try { res.json(await Reels.update(req.params.id, req.body)); }
    catch (err) { res.status(500).json({ error: err.message }); }
};

exports.updateStatus = async (req, res) => {
    try { res.json(await Reels.updateStatus(req.params.id, req.body.isActive)); }
    catch (err) { res.status(500).json({ error: err.message }); }
};

exports.delete = async (req, res) => {
    try { res.json(await Reels.delete(req.params.id)); }
    catch (err) { res.status(500).json({ error: err.message }); }
};
