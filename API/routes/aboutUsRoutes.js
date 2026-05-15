const express = require('express');
const router  = express.Router();
const ctrl    = require('../controllers/aboutUsController');
const { auth } = require('../middlewares/auth.js');

router.get('/get',    ctrl.get);           // public
router.post('/upsert', auth, ctrl.upsert); // admin only

module.exports = router;
