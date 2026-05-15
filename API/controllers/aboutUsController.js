const AboutUs = require('../models/aboutUsModel');

exports.get = async (req, res) => {
    try { res.json(await AboutUs.get()); }
    catch (err) { res.status(500).json({ error: err.message }); }
};

exports.upsert = async (req, res) => {
    try { res.json(await AboutUs.upsert(req.body)); }
    catch (err) { res.status(500).json({ error: err.message }); }
};
