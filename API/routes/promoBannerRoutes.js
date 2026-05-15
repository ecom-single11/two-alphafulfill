const express = require('express');
const router  = express.Router();
const ctrl    = require('../controllers/promoBannerController');
const { auth } = require('../middlewares/auth.js');

// Public
router.get('/getActive', ctrl.getActive);

// Admin
router.get('/getAll',                          auth, ctrl.getAll);
router.put('/upsert/:rowIndex/:colIndex',       auth, ctrl.upsert);
router.put('/status/:rowIndex/:colIndex',       auth, ctrl.updateStatus);
router.put('/clear/:rowIndex/:colIndex',        auth, ctrl.clearSlot);

module.exports = router;
