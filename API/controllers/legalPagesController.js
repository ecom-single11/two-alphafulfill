const LegalPages = require('../models/legalPagesModel');

exports.getAll = async (req, res) => {
    try { res.json(await LegalPages.getAll()); }
    catch (err) { res.status(500).json({ error: err.message }); }
};

exports.getBySlug = async (req, res) => {
    try {
        const result = await LegalPages.getBySlug(req.params.slug);
        if (!result.data) return res.status(404).json({ error: 'Page not found' });
        res.json(result);
    } catch (err) { res.status(500).json({ error: err.message }); }
};

exports.upsert = async (req, res) => {
    try {
        const { slug, title, content } = req.body;
        if (!slug || !title) return res.status(400).json({ error: 'slug and title required' });
        res.json(await LegalPages.upsert(slug, title, content));
    } catch (err) { res.status(500).json({ error: err.message }); }
};
