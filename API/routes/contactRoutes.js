const express = require('express');
const router = express.Router();
const ctrl = require('../controllers/contactController');
const { auth } = require('../middlewares/auth');

// Public
router.post('/submit', ctrl.submit);

// Admin
router.get('/',              auth, ctrl.getAll);
router.put('/:id/read',      auth, ctrl.markRead);
router.delete('/:id',        auth, ctrl.delete);
router.get('/unread-count',  auth, ctrl.unreadCount);

module.exports = router;
