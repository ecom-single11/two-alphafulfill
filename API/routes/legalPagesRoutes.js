const express = require('express');
const router  = express.Router();
const ctrl    = require('../controllers/legalPagesController');
const { auth } = require('../middlewares/auth.js');

router.get('/getAll',        ctrl.getAll);
router.get('/get/:slug',     ctrl.getBySlug);
router.post('/upsert', auth, ctrl.upsert);

module.exports = router;
