const Siteconfigs = require('../models/siteconfigModel');

// ── In-memory cache — siteconfig rarely changes ───────────────────────────────
let _cache = null;
let _cacheTime = 0;
const CACHE_TTL_MS = 5 * 60 * 1000; // 5 minutes

function invalidateCache() { _cache = null; _cacheTime = 0; }

exports.createSiteconfig = async (req, res) => {
    try {
        const result = await Siteconfigs.create(req.body);
        invalidateCache();
        res.status(201).json({ message: 'Siteconfig created', id: result.insertId });
    } catch (err) {
        console.error('Error creating Siteconfig:', err);
        res.status(500).json({ error: 'Internal server error' });
    }
};

exports.getAllSiteconfigs = async (req, res) => {
    try {
        // Serve from cache if fresh
        const now = Date.now();
        if (_cache && (now - _cacheTime) < CACHE_TTL_MS) {
            return res.status(200).json(_cache);
        }

        const results = await Siteconfigs.getAll();

        // Cache the result
        _cache = results;
        _cacheTime = now;

        // HTTP cache headers — browser/CDN can cache for 60s
        res.set('Cache-Control', 'public, max-age=60, stale-while-revalidate=300');
        res.status(200).json(results);
    } catch (err) {
        console.error('Error fetching Siteconfigs:', err);
        res.status(500).json({ error: 'Internal server error' });
    }
};

exports.updateSiteconfig = async (req, res) => {
    const id = req.params.id;
    try {
        await Siteconfigs.update(id, req.body, req.userDetails);
        invalidateCache(); // bust cache on update
        res.status(200).json({ message: 'Siteconfig updated' });
    } catch (err) {
        console.error('Error updating Siteconfig:', err);
        res.status(500).json({ error: 'Internal server error' });
    }
};

exports.deleteSiteconfig = async (req, res) => {
    const id = req.params.id;
    try {
        await Siteconfigs.delete(id);
        invalidateCache();
        res.status(200).json({ message: 'Siteconfig deleted' });
    } catch (err) {
        console.error('Error deleting Siteconfig:', err);
        res.status(500).json({ error: 'Internal server error' });
    }
};
