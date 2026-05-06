const express = require('express');
const router = express.Router();
const ctrl = require('../controllers/customerAddressController');
const { auth } = require('../middlewares/auth.js');

// Customer routes (token-based)
router.get('/',              ctrl.getAddresses);
router.post('/',             ctrl.createAddress);
router.put('/:id',           ctrl.updateAddress);
router.put('/:id/default',   ctrl.setDefault);
router.delete('/:id',        ctrl.deleteAddress);

// Admin route
router.get('/admin/:customerId', auth, ctrl.getAddressesByCustomerId);

module.exports = router;
