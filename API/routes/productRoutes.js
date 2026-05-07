const express = require('express');
const router  = express.Router();
const ctrl    = require('../controllers/productController');
const { auth } = require('../middlewares/auth.js');

// ── Admin (auth required) ──────────────────────────────────────────────────
router.post('/createProduct',           auth, ctrl.createProduct);
router.get('/getAllProductsByPage',      auth, ctrl.getAllProductsByPage);
router.get('/getProductById/:id',        auth, ctrl.getProductById);
router.put('/updateProduct/:id',         auth, ctrl.updateProduct);
router.put('/updateProductStatus/:id',   auth, ctrl.updateProductStatus);
router.put('/updateProductFeatured/:id', auth, ctrl.updateProductFeatured);
router.delete('/deleteProduct/:id',      auth, ctrl.deleteProduct);

// Reviews admin
router.get('/getAllReviews',             auth, ctrl.getAllReviewsByPage);
router.put('/updateReviewStatus/:id',    auth, ctrl.updateReviewStatus);
router.delete('/deleteReview/:id',       auth, ctrl.deleteReview);

// ── Public ─────────────────────────────────────────────────────────────────
router.get('/getShopListing',           ctrl.getShopListing);
router.get('/getProducts',              ctrl.getPublicProducts);
router.get('/getFeaturedProducts',      ctrl.getFeaturedProducts);
router.get('/getProduct/:slug',         ctrl.getProductBySlug);
router.get('/getRelated',               ctrl.getRelatedProducts);
router.post('/addReview/:id',           ctrl.addReview);
router.get('/getReviews/:id',           ctrl.getReviews);

module.exports = router;
