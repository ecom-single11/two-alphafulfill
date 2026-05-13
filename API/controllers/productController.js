const Product = require('../models/productModel');
const Review  = require('../models/reviewModel');

// ── Admin ──────────────────────────────────────────────────────────────────

exports.createProduct = async (req, res) => {
    try {
        // Auto-generate slug from name if not provided
        if (!req.body.slug && req.body.name) {
            req.body.slug = req.body.name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
        }
        const result = await Product.create(req.body);
        res.status(201).json({ message: 'Product created', data: result.data });
    } catch (err) {
        console.error('createProduct:', err);
        res.status(500).json({ error: 'Internal server error' });
    }
};

exports.getAllProductsByPage = async (req, res) => {
    try {
        const { limit = 20, page = 1, searchtxt = '', categoryId, brandId, isActive } = req.query;
        const filters = {};
        if (categoryId) filters.categoryId = Number(categoryId);
        if (brandId)    filters.brandId    = Number(brandId);
        if (isActive !== undefined) filters.isActive = isActive === 'true';

        const result = await Product.getAllByPage(Number(limit), Number(page), searchtxt, filters);
        res.status(200).json({ ...result, totalPages: Math.ceil(result.totalCount / Number(limit)), currentPage: page });
    } catch (err) {
        console.error('getAllProductsByPage:', err);
        res.status(500).json({ error: 'Internal server error' });
    }
};

exports.getProductById = async (req, res) => {
    try {
        const result = await Product.getById(req.params.id);
        res.status(200).json(result);
    } catch (err) {
        console.error('getProductById:', err);
        res.status(500).json({ error: 'Internal server error' });
    }
};

exports.updateProduct = async (req, res) => {
    try {
        if (!req.body.slug && req.body.name) {
            req.body.slug = req.body.name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
        }
        await Product.update(req.params.id, req.body);
        res.status(200).json({ message: 'Product updated' });
    } catch (err) {
        console.error('updateProduct:', err);
        res.status(500).json({ error: 'Internal server error' });
    }
};

exports.updateProductStatus = async (req, res) => {
    try {
        await Product.updateStatus(req.params.id, req.body.isActive);
        res.status(200).json({ message: 'Status updated' });
    } catch (err) {
        console.error('updateProductStatus:', err);
        res.status(500).json({ error: 'Internal server error' });
    }
};

exports.updateProductFeatured = async (req, res) => {
    try {
        await Product.updateFeatured(req.params.id, req.body.isFeatured);
        res.status(200).json({ message: 'Featured status updated' });
    } catch (err) {
        console.error('updateProductFeatured:', err);
        res.status(500).json({ error: 'Internal server error' });
    }
};

exports.deleteProduct = async (req, res) => {
    try {
        await Product.delete(req.params.id);
        res.status(200).json({ message: 'Product deleted' });
    } catch (err) {
        console.error('deleteProduct:', err);
        res.status(500).json({ error: 'Internal server error' });
    }
};

// ── Public ─────────────────────────────────────────────────────────────────

exports.getShopListing = async (req, res) => {
    try {
        const { limit = 20, offset = 0, categoryId, brandId, minPrice, maxPrice, search, sort } = req.query;
        const filters = {};
        if (categoryId) filters.categoryId = Number(categoryId);
        if (brandId)    filters.brandId    = Number(brandId);
        if (minPrice)   filters.minPrice   = Number(minPrice);
        if (maxPrice)   filters.maxPrice   = Number(maxPrice);
        if (search)     filters.search     = search;
        if (sort)       filters.sort       = sort;

        const result = await Product.getShopListing(Number(limit), Number(offset), filters);
        res.status(200).json(result);
    } catch (err) {
        console.error('getShopListing:', err);
        res.status(500).json({ error: 'Internal server error' });
    }
};

exports.getPublicProducts = async (req, res) => {
    try {
        const { limit = 20, offset = 0, categoryId, brandId, minPrice, maxPrice, search, sort, isFeatured } = req.query;
        const filters = {};
        if (categoryId) filters.categoryId = Number(categoryId);
        if (brandId)    filters.brandId    = Number(brandId);
        if (minPrice)   filters.minPrice   = Number(minPrice);
        if (maxPrice)   filters.maxPrice   = Number(maxPrice);
        if (search)     filters.search     = search;
        if (sort)       filters.sort       = sort;
        if (isFeatured !== undefined) filters.isFeatured = isFeatured === 'true';

        const result = await Product.getPublic(Number(limit), Number(offset), filters);
        res.status(200).json(result);
    } catch (err) {
        console.error('getPublicProducts:', err);
        res.status(500).json({ error: 'Internal server error' });
    }
};

exports.getFeaturedProducts = async (req, res) => {
    try {
        const result = await Product.getFeatured();
        res.status(200).json(result);
    } catch (err) {
        console.error('getFeaturedProducts:', err);
        res.status(500).json({ error: 'Internal server error' });
    }
};

exports.getProductBySlug = async (req, res) => {
    try {
        const result = await Product.getBySlug(req.params.slug);
        if (!result.data) return res.status(404).json({ error: 'Product not found' });
        res.status(200).json(result);
    } catch (err) {
        console.error('getProductBySlug:', err);
        res.status(500).json({ error: 'Internal server error' });
    }
};

exports.getRelatedProducts = async (req, res) => {
    try {
        const { categoryId, excludeId, limit = 8 } = req.query;
        if (!categoryId) return res.status(400).json({ error: 'categoryId required' });
        const result = await Product.getRelated(Number(categoryId), Number(excludeId), Number(limit));
        res.status(200).json(result);
    } catch (err) {
        console.error('getRelatedProducts:', err);
        res.status(500).json({ error: 'Internal server error' });
    }
};

// ── Reviews ────────────────────────────────────────────────────────────────

exports.addReview = async (req, res) => {
    try {
        const result = await Review.create({ ...req.body, productId: req.params.id });
        await Product.updateRating(req.params.id);
        res.status(201).json({ message: 'Review added', data: result.data });
    } catch (err) {
        console.error('addReview:', err);
        res.status(500).json({ error: 'Internal server error' });
    }
};

exports.getReviews = async (req, res) => {
    try {
        const { limit = 8, offset = 0, sort = 'newest' } = req.query;
        const result = await Review.getByProduct(req.params.id, Number(limit), Number(offset), sort);
        res.status(200).json(result);
    } catch (err) {
        console.error('getReviews:', err);
        res.status(500).json({ error: 'Internal server error' });
    }
};

exports.getAllReviewsByPage = async (req, res) => {
    try {
        const { limit = 20, page = 1, productId } = req.query;
        const result = await Review.getAllByPage(Number(limit), Number(page), productId ? Number(productId) : null);
        res.status(200).json(result);
    } catch (err) {
        console.error('getAllReviewsByPage:', err);
        res.status(500).json({ error: 'Internal server error' });
    }
};

exports.updateReviewStatus = async (req, res) => {
    try {
        await Review.updateStatus(req.params.id, req.body.isActive);
        res.status(200).json({ message: 'Review status updated' });
    } catch (err) {
        res.status(500).json({ error: 'Internal server error' });
    }
};

exports.deleteReview = async (req, res) => {
    try {
        await Review.delete(req.params.id);
        res.status(200).json({ message: 'Review deleted' });
    } catch (err) {
        res.status(500).json({ error: 'Internal server error' });
    }
};
