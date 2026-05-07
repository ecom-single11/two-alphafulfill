const express = require('express');
const router  = express.Router();
const ctrl    = require('../controllers/reelsController');
const { auth } = require('../middlewares/auth.js');

router.get('/getAll',          auth, ctrl.getAll);
router.get('/getActive',             ctrl.getActive);   // public
router.post('/create',         auth, ctrl.create);
router.put('/update/:id',      auth, ctrl.update);
router.put('/updateStatus/:id',auth, ctrl.updateStatus);
router.delete('/delete/:id',   auth, ctrl.delete);

module.exports = router;
