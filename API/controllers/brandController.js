const Brand = require('../models/brandModel');

exports.createBrand = async (req, res) => {
    try {
        const result = await Brand.create(req.body);
        res.status(201).json({ message: 'Brand created', data: result });
    } catch (err) {
        console.error('Error creating Brand:', err);
        res.status(500).json({ error: 'Internal server error' });
    }
};

exports.getAllBrandsByPage = async (req, res) => {
    try {
        const { limit = 10, page = 1, searchtxt = '' } = req.query;
        const results = await Brand.getAllByPage(Number(limit), Number(page), searchtxt);
        res.status(200).json({
            status: 'success',
            data: results.data,
            totalCount: results.totalCount,
            totalPages: Math.ceil(results.totalCount / Number(limit)),
            currentPage: page
        });
    } catch (err) {
        console.error('Error fetching Brands:', err);
        res.status(500).json({ error: 'Internal server error' });
    }
};

exports.getAllBrands = async (req, res) => {
    try {
        const results = await Brand.getAll();
        res.status(200).json(results);
    } catch (err) {
        console.error('Error fetching all Brands:', err);
        res.status(500).json({ error: 'Internal server error' });
    }
};

exports.getBrandById = async (req, res) => {
    try {
        const result = await Brand.getById(req.params.id);
        res.status(200).json(result);
    } catch (err) {
        console.error('Error fetching Brand:', err);
        res.status(500).json({ error: 'Internal server error' });
    }
};

exports.updateBrand = async (req, res) => {
    try {
        const result = await Brand.update(req.params.id, req.body);
        res.status(200).json(result);
    } catch (err) {
        console.error('Error updating Brand:', err);
        res.status(500).json({ error: 'Internal server error' });
    }
};

exports.updateBrandStatus = async (req, res) => {
    try {
        await Brand.updateStatus(req.params.id, req.body.isActive);
        res.status(200).json({ message: 'Brand status updated' });
    } catch (err) {
        console.error('Error updating Brand status:', err);
        res.status(500).json({ error: 'Internal server error' });
    }
};

exports.deleteBrand = async (req, res) => {
    try {
        await Brand.delete(req.params.id);
        res.status(200).json({ message: 'Brand deleted' });
    } catch (err) {
        console.error('Error deleting Brand:', err);
        res.status(500).json({ error: 'Internal server error' });
    }
};

// Public
exports.getActiveBrandsForUI = async (req, res) => {
    try {
        const results = await Brand.getActiveForUI();
        res.status(200).json(results);
    } catch (err) {
        console.error('Error fetching active Brands:', err);
        res.status(500).json({ error: 'Internal server error' });
    }
};
