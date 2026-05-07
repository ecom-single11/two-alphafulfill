const express = require('express');
const router = express.Router();
const ctrl = require('../controllers/paymentSettingsController');

router.get('/public',                   ctrl.getPublicSettings);
router.get('/admin',                    ctrl.getFullSettings);
router.post('/update',                  ctrl.updateSettings);
router.post('/phonepe/initiate',        ctrl.phonePeInitiate);
router.get('/phonepe/verify/:transactionId', ctrl.phonePeVerify);

module.exports = router;
