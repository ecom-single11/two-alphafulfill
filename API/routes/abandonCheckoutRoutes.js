const express = require('express');
const router  = express.Router();
const ctrl    = require('../controllers/abandonCheckoutController');
const { auth } = require('../middlewares/auth.js');

router.post('/upsert',  ctrl.upsert);          // public — UI calls this
router.get('/getAll',   auth, ctrl.getAll);    // admin only

module.exports = router;
