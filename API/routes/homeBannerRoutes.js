const express = require('express');
const router = express.Router();
const homeBannerController = require('../controllers/homeBannerController');
const { auth } = require('../middlewares/auth.js');

// Admin routes (auth required)
router.post('/createBanner', auth, homeBannerController.createBanner);
router.get('/getAllBanners', auth, homeBannerController.getAllBanners);
router.get('/getAllBannersByPage', auth, homeBannerController.getAllBannersByPage);
router.put('/updateBanner/:id', auth, homeBannerController.updateBanner);
router.put('/updateBannerStatus/:id', auth, homeBannerController.updateBannerStatus);
router.delete('/deleteBanner/:id', auth, homeBannerController.deleteBanner);

// Public route — UI slider
router.get('/getActiveBanners', homeBannerController.getActiveBannersForUI);

module.exports = router;
