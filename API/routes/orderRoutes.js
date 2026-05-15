const express = require('express');
const router = express.Router();
const { create, getAll, getById, getByCustomer, updateStatus, exportCSV } = require('../controllers/orderController');
const { auth } = require('../middlewares/auth.js');

router.post('/createOrder', create);
router.get('/getAllOrders',  auth, getAll);
router.get('/exportCSV',     auth, exportCSV);
router.get('/getById/:id',   auth, getById);
router.get('/getByCustomer/:customerId', getByCustomer);
router.put('/updateStatus/:id', auth, updateStatus);

module.exports = router;
