const express = require('express');
const router = express.Router();
const categoryController = require('../controllers/categoryController');
const { auth } = require('../middlewares/auth.js');

// Admin routes (auth required)
router.post('/createCategory',          auth, categoryController.createCategory);
router.get('/getAllCategoriesByPage',    auth, categoryController.getAllCategoriesByPage);
router.get('/getAllCategories',          auth, categoryController.getAllCategories);
router.get('/getChildren',              auth, categoryController.getChildren);
router.get('/getCategoryById/:id',      auth, categoryController.getCategoryById);
router.put('/updateCategory/:id',       auth, categoryController.updateCategory);
router.put('/updateCategoryStatus/:id', auth, categoryController.updateCategoryStatus);
router.delete('/deleteCategory/:id',    auth, categoryController.deleteCategory);

// Public — UI
router.get('/getPublicCategories', categoryController.getPublicCategories);

module.exports = router;
