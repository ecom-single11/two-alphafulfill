const HomeBanner = require('../models/homeBannerModel');

exports.createBanner = async (req, res) => {
    try {
        const result = await HomeBanner.create(req.body);
        res.status(201).json({ message: 'Banner created', data: result });
    } catch (err) {
        console.error('Error creating Banner:', err);
        res.status(500).json({ error: 'Internal server error' });
    }
};

exports.getAllBanners = async (req, res) => {
    try {
        const results = await HomeBanner.getAll();
        res.status(200).json(results);
    } catch (err) {
        console.error('Error fetching Banners:', err);
        res.status(500).json({ error: 'Internal server error' });
    }
};

exports.getAllBannersByPage = async (req, res) => {
    try {
        const { limit = 10, page = 1, searchtxt = '' } = req.query;
        const results = await HomeBanner.getAllByPage(Number(limit), Number(page), searchtxt);
        res.status(200).json({
            status: 'success',
            data: results.data,
            totalCount: results.totalCount,
            totalPages: Math.ceil(results.totalCount / limit),
            currentPage: page
        });
    } catch (err) {
        console.error('Error fetching Banners by page:', err);
        res.status(500).json({ error: 'Internal server error' });
    }
};

// Public endpoint — only active banners for UI
exports.getActiveBannersForUI = async (req, res) => {
    try {
        const results = await HomeBanner.getActiveForUI();
        res.status(200).json(results);
    } catch (err) {
        console.error('Error fetching active Banners:', err);
        res.status(500).json({ error: 'Internal server error' });
    }
};

exports.updateBanner = async (req, res) => {
    const id = req.params.id;
    try {
        const results = await HomeBanner.update(id, req.body);
        res.status(200).json(results);
    } catch (err) {
        console.error('Error updating Banner:', err);
        res.status(500).json({ error: 'Internal server error' });
    }
};

exports.updateBannerStatus = async (req, res) => {
    const id = req.params.id;
    const { isActive } = req.body;
    try {
        await HomeBanner.updateStatus(id, isActive);
        res.status(200).json({ message: 'Banner status updated' });
    } catch (err) {
        console.error('Error updating Banner status:', err);
        res.status(500).json({ error: 'Internal server error' });
    }
};

exports.deleteBanner = async (req, res) => {
    const id = req.params.id;
    try {
        await HomeBanner.delete(id);
        res.status(200).json({ message: 'Banner deleted' });
    } catch (err) {
        console.error('Error deleting Banner:', err);
        res.status(500).json({ error: 'Internal server error' });
    }
};
