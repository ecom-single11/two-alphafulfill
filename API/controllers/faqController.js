const { FaqTopic, Faq, FaqConfig } = require('../models/faqModel');

// ── Topics ────────────────────────────────────────────────────────────────────
exports.getTopics = async (req, res) => {
    try { res.json(await FaqTopic.getAll()); }
    catch (e) { res.status(500).json({ error: 'Server error' }); }
};
exports.createTopic = async (req, res) => {
    try { res.status(201).json(await FaqTopic.create(req.body)); }
    catch (e) { res.status(500).json({ error: 'Server error' }); }
};
exports.updateTopic = async (req, res) => {
    try { res.json(await FaqTopic.update(req.params.id, req.body)); }
    catch (e) { res.status(500).json({ error: 'Server error' }); }
};
exports.deleteTopic = async (req, res) => {
    try { res.json(await FaqTopic.delete(req.params.id)); }
    catch (e) { res.status(500).json({ error: 'Server error' }); }
};

// ── FAQs ──────────────────────────────────────────────────────────────────────
exports.getAllFaqs = async (req, res) => {
    try { res.json(await Faq.getAll(req.query.topicId)); }
    catch (e) { res.status(500).json({ error: 'Server error' }); }
};
exports.getPublicFaqs = async (req, res) => {
    try { res.json(await Faq.getPublic()); }
    catch (e) { res.status(500).json({ error: 'Server error' }); }
};
exports.getFaqPreview = async (req, res) => {
    try { res.json(await Faq.getPreview(Number(req.query.limit) || 5)); }
    catch (e) { res.status(500).json({ error: 'Server error' }); }
};
exports.createFaq = async (req, res) => {
    try { res.status(201).json(await Faq.create(req.body)); }
    catch (e) { res.status(500).json({ error: 'Server error' }); }
};
exports.updateFaq = async (req, res) => {
    try { res.json(await Faq.update(req.params.id, req.body)); }
    catch (e) { res.status(500).json({ error: 'Server error' }); }
};
exports.deleteFaq = async (req, res) => {
    try { res.json(await Faq.delete(req.params.id)); }
    catch (e) { res.status(500).json({ error: 'Server error' }); }
};

// ── Config ────────────────────────────────────────────────────────────────────
exports.getFaqConfig = async (req, res) => {
    try { res.json(await FaqConfig.get()); }
    catch (e) { res.status(500).json({ error: 'Server error' }); }
};
exports.upsertFaqConfig = async (req, res) => {
    try { res.json(await FaqConfig.upsert(req.body)); }
    catch (e) { res.status(500).json({ error: 'Server error' }); }
};
