const express = require('express');
const router = express.Router();
const brandController = require('../controllers/brandController');
const { auth } = require('../middlewares/auth.js');

// Admin (auth required)
router.post('/createBrand',          auth, brandController.createBrand);
router.get('/getAllBrandsByPage',     auth, brandController.getAllBrandsByPage);
router.get('/getAllBrands',           auth, brandController.getAllBrands);
router.get('/getBrandById/:id',       auth, brandController.getBrandById);
router.put('/updateBrand/:id',        auth, brandController.updateBrand);
router.put('/updateBrandStatus/:id',  auth, brandController.updateBrandStatus);
router.delete('/deleteBrand/:id',     auth, brandController.deleteBrand);

// Public
router.get('/getActiveBrands', brandController.getActiveBrandsForUI);

module.exports = router;
