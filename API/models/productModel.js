const db = require('../config/db');

const Product = {

    create: async (data) => {
        const conn = await db.getConnection();
        try {
            await conn.beginTransaction();
            const [result] = await conn.execute(
                `INSERT INTO products (name, slug, description, shortDescription, resultTag, badge,
                 price, salePrice, categoryId, brandId, images, variants, tags,
                 benefits, whyLoveIt, keyIngredients, howToUse, additionalDetails, consumerCareDetails,
                 faqs, promoImage, promoReel, galleryMedia, sizeGuideImage, isActive, isFeatured, sortOrder, created_at, updated_at)
                 VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,NOW(),NOW())`,
                [
                    data.name, data.slug || '', data.description || '',
                    data.shortDescription || null, data.resultTag || null, data.badge || null,
                    data.price || 0, data.salePrice || null,
                    data.categoryId || null, data.brandId || null,
                    JSON.stringify(data.images || []),
                    JSON.stringify(data.variants || []),
                    JSON.stringify(data.tags || []),
                    JSON.stringify(data.benefits || []),
                    JSON.stringify(data.whyLoveIt || []),
                    JSON.stringify(data.keyIngredients || []),
                    data.howToUse || null,
                    data.additionalDetails || null,
                    data.consumerCareDetails || null,
                    JSON.stringify(data.faqs || []),
                    data.promoImage || null,
                    data.promoReel || null,
                    JSON.stringify(data.galleryMedia || []),
                    data.sizeGuideImage || null,
                    data.isActive !== undefined ? (data.isActive ? 1 : 0) : 1,
                    data.isFeatured ? 1 : 0,
                    data.sortOrder || 0
                ]
            );
            await conn.commit();
            return { status: 'success', data: { id: result.insertId } };
        } catch (err) { await conn.rollback(); throw err; }
        finally { conn.release(); }
    },

    getAllByPage: async (limit, pageNo, searchtxt, filters = {}) => {
        try {
            const offset = (pageNo - 1) * limit;
            let where = [];
            let params = [];

            if (searchtxt) {
                where.push(`(p.name LIKE ? OR p.description LIKE ?)`);
                params.push(`%${searchtxt}%`, `%${searchtxt}%`);
            }
            if (filters.categoryId) { where.push(`p.categoryId = ?`); params.push(filters.categoryId); }
            if (filters.brandId)    { where.push(`p.brandId = ?`);    params.push(filters.brandId); }
            if (filters.isActive !== undefined) { where.push(`p.isActive = ?`); params.push(filters.isActive ? 1 : 0); }

            const whereClause = where.length ? `WHERE ${where.join(' AND ')}` : '';

            const [results] = await db.execute(
                `SELECT p.*, c.name AS categoryName, b.name AS brandName
                 FROM products p
                 LEFT JOIN categories c ON p.categoryId = c.id
                 LEFT JOIN brands b ON p.brandId = b.id
                 ${whereClause}
                 ORDER BY p.sortOrder ASC, p.created_at DESC
                 LIMIT ? OFFSET ?`,
                [...params, limit, offset]
            );

            const [countResult] = await db.execute(
                `SELECT COUNT(*) AS totalCount FROM products p ${whereClause}`,
                params
            );

            return {
                status: 'success',
                data: results.map(r => Product._parse(r)),
                totalCount: countResult[0].totalCount
            };
        } catch (err) { throw err; }
    },

    // Lightweight shop listing — only fields needed for product cards
    // Optimized for 10k+ products: no full JSON parse, only first image extracted
    getShopListing: async (limit, offset, filters = {}) => {
        try {
            let where = [`p.isActive = 1`];
            let params = [];

            if (filters.categoryId) { where.push(`p.categoryId = ?`); params.push(filters.categoryId); }
            if (filters.brandId)    { where.push(`p.brandId = ?`);    params.push(filters.brandId); }
            if (filters.minPrice)   { where.push(`p.price >= ?`);     params.push(filters.minPrice); }
            if (filters.maxPrice)   { where.push(`p.price <= ?`);     params.push(filters.maxPrice); }
            if (filters.search) {
                where.push(`(p.name LIKE ? OR p.tags LIKE ?)`);
                params.push(`%${filters.search}%`, `%${filters.search}%`);
            }

            const whereClause = `WHERE ${where.join(' AND ')}`;

            let orderBy = 'p.sortOrder ASC, p.created_at DESC';
            if (filters.sort === 'price_asc')  orderBy = 'p.price ASC';
            if (filters.sort === 'price_desc') orderBy = 'p.price DESC';
            if (filters.sort === 'newest')     orderBy = 'p.created_at DESC';
            if (filters.sort === 'rating')     orderBy = 'p.avgRating DESC, p.reviewCount DESC';

            // Extract only first image from JSON array using JSON_UNQUOTE + JSON_EXTRACT
            const [results] = await db.execute(
                `SELECT
                    p.id,
                    p.name,
                    p.slug,
                    p.price,
                    p.salePrice,
                    p.avgRating,
                    p.reviewCount,
                    JSON_UNQUOTE(JSON_EXTRACT(p.images, '$[0]')) AS firstImage,
                    c.name AS categoryName,
                    b.name AS brandName
                 FROM products p
                 LEFT JOIN categories c ON p.categoryId = c.id
                 LEFT JOIN brands b ON p.brandId = b.id
                 ${whereClause}
                 ORDER BY ${orderBy}
                 LIMIT ? OFFSET ?`,
                [...params, limit, offset]
            );

            const [countResult] = await db.execute(
                `SELECT COUNT(*) AS totalCount FROM products p ${whereClause}`,
                params
            );

            return {
                status: 'success',
                data: results.map(r => ({
                    id: r.id,
                    name: r.name,
                    slug: r.slug,
                    price: parseFloat(r.price) || 0,
                    salePrice: r.salePrice ? parseFloat(r.salePrice) : null,
                    avgRating: parseFloat(r.avgRating) || 0,
                    reviewCount: r.reviewCount || 0,
                    firstImage: r.firstImage || null,
                    categoryName: r.categoryName || null,
                    brandName: r.brandName || null,
                })),
                totalCount: countResult[0].totalCount
            };
        } catch (err) { throw err; }
    },

    // Public shop listing — active only, with filters + infinite scroll
    getPublic: async (limit, offset, filters = {}) => {
        try {
            let where = [`p.isActive = 1`];
            let params = [];

            if (filters.categoryId) { where.push(`p.categoryId = ?`); params.push(filters.categoryId); }
            if (filters.brandId)    { where.push(`p.brandId = ?`);    params.push(filters.brandId); }
            if (filters.minPrice)   { where.push(`p.price >= ?`);     params.push(filters.minPrice); }
            if (filters.maxPrice)   { where.push(`p.price <= ?`);     params.push(filters.maxPrice); }
            if (filters.search)     { where.push(`(p.name LIKE ? OR p.tags LIKE ?)`); params.push(`%${filters.search}%`, `%${filters.search}%`); }
            if (filters.isFeatured !== undefined) { where.push(`p.isFeatured = ?`); params.push(filters.isFeatured ? 1 : 0); }

            const whereClause = `WHERE ${where.join(' AND ')}`;

            let orderBy = 'p.sortOrder ASC, p.created_at DESC';
            if (filters.sort === 'price_asc')  orderBy = 'p.price ASC';
            if (filters.sort === 'price_desc') orderBy = 'p.price DESC';
            if (filters.sort === 'newest')     orderBy = 'p.created_at DESC';
            if (filters.sort === 'rating')     orderBy = 'p.avgRating DESC';

            const [results] = await db.execute(
                `SELECT p.id, p.name, p.slug, p.price, p.salePrice, p.images, p.variants,
                        p.avgRating, p.reviewCount, p.isActive,
                        c.name AS categoryName, b.name AS brandName
                 FROM products p
                 LEFT JOIN categories c ON p.categoryId = c.id
                 LEFT JOIN brands b ON p.brandId = b.id
                 ${whereClause}
                 ORDER BY ${orderBy}
                 LIMIT ? OFFSET ?`,
                [...params, limit, offset]
            );

            const [countResult] = await db.execute(
                `SELECT COUNT(*) AS totalCount FROM products p ${whereClause}`,
                params
            );

            return {
                status: 'success',
                data: results.map(r => Product._parsePublic(r)),
                totalCount: countResult[0].totalCount
            };
        } catch (err) { throw err; }
    },

    getById: async (id) => {
        try {
            const [results] = await db.execute(
                `SELECT p.*, c.name AS categoryName, b.name AS brandName
                 FROM products p
                 LEFT JOIN categories c ON p.categoryId = c.id
                 LEFT JOIN brands b ON p.brandId = b.id
                 WHERE p.id = ?`,
                [id]
            );
            if (!results[0]) return { status: 'success', data: null };
            return { status: 'success', data: Product._parse(results[0]) };
        } catch (err) { throw err; }
    },

    getBySlug: async (slug) => {
        try {
            const [results] = await db.execute(
                `SELECT p.*, c.name AS categoryName, b.name AS brandName
                 FROM products p
                 LEFT JOIN categories c ON p.categoryId = c.id
                 LEFT JOIN brands b ON p.brandId = b.id
                 WHERE p.slug = ? AND p.isActive = 1`,
                [slug]
            );
            if (!results[0]) return { status: 'success', data: null };
            return { status: 'success', data: Product._parse(results[0]) };
        } catch (err) { throw err; }
    },

    // Related products — same category, exclude current
    getRelated: async (categoryId, excludeId, limit = 8) => {
        try {
            const [results] = await db.execute(
                `SELECT p.id, p.name, p.slug, p.price, p.salePrice, p.images, p.avgRating, p.reviewCount
                 FROM products p
                 WHERE p.categoryId = ? AND p.id != ? AND p.isActive = 1
                 ORDER BY p.avgRating DESC, p.created_at DESC
                 LIMIT ?`,
                [categoryId, excludeId, limit]
            );
            return { status: 'success', data: results.map(r => Product._parsePublic(r)) };
        } catch (err) { throw err; }
    },

    update: async (id, data) => {
        try {
            await db.execute(
                `UPDATE products SET name=?, slug=?, description=?, shortDescription=?, resultTag=?, badge=?,
                 price=?, salePrice=?, categoryId=?, brandId=?, images=?, variants=?, tags=?,
                 benefits=?, whyLoveIt=?, keyIngredients=?, howToUse=?, additionalDetails=?, consumerCareDetails=?,
                 faqs=?, promoImage=?, promoReel=?, galleryMedia=?, sizeGuideImage=?, isActive=?, isFeatured=?, sortOrder=?, updated_at=NOW()
                 WHERE id=?`,
                [
                    data.name, data.slug || '', data.description || '',
                    data.shortDescription || null, data.resultTag || null, data.badge || null,
                    data.price || 0, data.salePrice || null,
                    data.categoryId || null, data.brandId || null,
                    JSON.stringify(data.images || []),
                    JSON.stringify(data.variants || []),
                    JSON.stringify(data.tags || []),
                    JSON.stringify(data.benefits || []),
                    JSON.stringify(data.whyLoveIt || []),
                    JSON.stringify(data.keyIngredients || []),
                    data.howToUse || null,
                    data.additionalDetails || null,
                    data.consumerCareDetails || null,
                    JSON.stringify(data.faqs || []),
                    data.promoImage || null,
                    data.promoReel || null,
                    JSON.stringify(data.galleryMedia || []),
                    data.sizeGuideImage || null,
                    data.isActive !== undefined ? (data.isActive ? 1 : 0) : 1,
                    data.isFeatured ? 1 : 0,
                    data.sortOrder || 0, id
                ]
            );
            return { status: 'success' };
        } catch (err) { throw err; }
    },

    updateStatus: async (id, isActive) => {
        try {
            await db.execute(`UPDATE products SET isActive=?, updated_at=NOW() WHERE id=?`, [isActive ? 1 : 0, id]);
            return { status: 'success' };
        } catch (err) { throw err; }
    },

    updateFeatured: async (id, isFeatured) => {
        try {
            await db.execute(`UPDATE products SET isFeatured=?, updated_at=NOW() WHERE id=?`, [isFeatured ? 1 : 0, id]);
            return { status: 'success' };
        } catch (err) { throw err; }
    },

    getFeatured: async () => {
        try {
            const [results] = await db.execute(
                `SELECT p.*, c.name AS categoryName, b.name AS brandName
                 FROM products p
                 LEFT JOIN categories c ON p.categoryId = c.id
                 LEFT JOIN brands b ON p.brandId = b.id
                 WHERE p.isFeatured = 1 AND p.isActive = 1
                 ORDER BY p.sortOrder ASC, p.created_at DESC`,
                []
            );
            return { status: 'success', data: results.map(r => Product._parse(r)) };
        } catch (err) { throw err; }
    },

    updateRating: async (productId) => {
        try {
            await db.execute(
                `UPDATE products p SET
                    p.avgRating = (SELECT IFNULL(AVG(r.rating), 0) FROM product_reviews r WHERE r.productId = ? AND r.isActive = 1),
                    p.reviewCount = (SELECT COUNT(*) FROM product_reviews r WHERE r.productId = ? AND r.isActive = 1),
                    p.updated_at = NOW()
                 WHERE p.id = ?`,
                [productId, productId, productId]
            );
        } catch (err) { throw err; }
    },

    delete: async (id) => {
        try {
            await db.execute(`DELETE FROM products WHERE id=?`, [id]);
            return { status: 'success' };
        } catch (err) { throw err; }
    },

    _parse: (r) => ({
        ...r,
        images:              Product._tryParse(r.images,           []),
        variants:            Product._tryParse(r.variants,         []),
        tags:                Product._tryParse(r.tags,             []),
        benefits:            Product._tryParse(r.benefits,         []),
        whyLoveIt:           Product._tryParse(r.whyLoveIt,        []),
        keyIngredients:      Product._tryParse(r.keyIngredients,   []),
        faqs:                Product._tryParse(r.faqs,             []),
        galleryMedia:        Product._tryParse(r.galleryMedia,     []),
        price:               parseFloat(r.price) || 0,
        salePrice:           r.salePrice ? parseFloat(r.salePrice) : null,
        avgRating:           parseFloat(r.avgRating) || 0,
    }),

    _parsePublic: (r) => ({
        id: r.id, name: r.name, slug: r.slug,
        price: parseFloat(r.price) || 0,
        salePrice: r.salePrice ? parseFloat(r.salePrice) : null,
        images:   Product._tryParse(r.images,   []),
        variants: Product._tryParse(r.variants, []),
        avgRating: parseFloat(r.avgRating) || 0,
        reviewCount: r.reviewCount || 0,
        categoryName: r.categoryName, brandName: r.brandName,
    }),

    _tryParse: (val, fallback) => {
        try { return val ? JSON.parse(val) : fallback; } catch { return fallback; }
    }
};

module.exports = Product;
