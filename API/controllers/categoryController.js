const Category = require('../models/categoryModel');

exports.createCategory = async (req, res) => {
    try {
        const result = await Category.create(req.body);
        res.status(201).json({ message: 'Category created', data: result });
    } catch (err) {
        console.error('Error creating Category:', err);
        res.status(500).json({ error: 'Internal server error' });
    }
};

exports.getAllCategories = async (req, res) => {
    try {
        const results = await Category.getAll();
        res.status(200).json(results);
    } catch (err) {
        console.error('Error fetching Categories:', err);
        res.status(500).json({ error: 'Internal server error' });
    }
};

exports.getAllCategoriesByPage = async (req, res) => {
    try {
        const { limit = 10, page = 1, searchtxt = '' } = req.query;
        const results = await Category.getAllByPage(Number(limit), Number(page), searchtxt);
        res.status(200).json({
            status: 'success',
            data: results.data,
            totalCount: results.totalCount,
            totalPages: Math.ceil(results.totalCount / Number(limit)),
            currentPage: page
        });
    } catch (err) {
        console.error('Error fetching Categories by page:', err);
        res.status(500).json({ error: 'Internal server error' });
    }
};

exports.getChildren = async (req, res) => {
    try {
        const parentId = req.query.parentId === 'null' || !req.query.parentId
            ? null
            : Number(req.query.parentId);
        const results = await Category.getChildren(parentId);
        res.status(200).json(results);
    } catch (err) {
        console.error('Error fetching children:', err);
        res.status(500).json({ error: 'Internal server error' });
    }
};

exports.getCategoryById = async (req, res) => {
    try {
        const result = await Category.getById(req.params.id);
        res.status(200).json(result);
    } catch (err) {
        console.error('Error fetching Category:', err);
        res.status(500).json({ error: 'Internal server error' });
    }
};

exports.updateCategory = async (req, res) => {
    const id = req.params.id;
    try {
        // Prevent setting a category as its own parent
        if (req.body.parentId && Number(req.body.parentId) === Number(id)) {
            return res.status(400).json({ error: 'A category cannot be its own parent' });
        }
        const results = await Category.update(id, req.body);
        res.status(200).json(results);
    } catch (err) {
        console.error('Error updating Category:', err);
        res.status(500).json({ error: 'Internal server error' });
    }
};

exports.updateCategoryStatus = async (req, res) => {
    const id = req.params.id;
    const { isActive } = req.body;
    try {
        await Category.updateStatus(id, isActive);
        res.status(200).json({ message: 'Category status updated' });
    } catch (err) {
        console.error('Error updating Category status:', err);
        res.status(500).json({ error: 'Internal server error' });
    }
};

exports.deleteCategory = async (req, res) => {
    const id = req.params.id;
    try {
        await Category.delete(id);
        res.status(200).json({ message: 'Category deleted' });
    } catch (err) {
        console.error('Error deleting Category:', err);
        res.status(500).json({ error: 'Internal server error' });
    }
};

// Public — full flat list for UI
exports.getPublicCategories = async (req, res) => {
    try {
        const results = await Category.getAll();
        res.status(200).json(results);
    } catch (err) {
        console.error('Error fetching public Categories:', err);
        res.status(500).json({ error: 'Internal server error' });
    }
};
