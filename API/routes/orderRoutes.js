const express = require('express');
const router = express.Router();
const { create, getAll, getById, getByCustomer, updateStatus } = require('../controllers/orderController');

router.post('/createOrder', create);
router.get('/getAllOrders', getAll);
router.get('/getById/:id', getById);
router.get('/getByCustomer/:customerId', getByCustomer);
router.put('/updateStatus/:id', updateStatus);

module.exports = router;
