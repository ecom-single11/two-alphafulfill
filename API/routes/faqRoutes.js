const express = require('express');
const router = express.Router();
const ctrl = require('../controllers/faqController');
const { auth } = require('../middlewares/auth');

// ── Public (no auth) ──────────────────────────────────────────────────────────
router.get('/public',  ctrl.getPublicFaqs);
router.get('/preview', ctrl.getFaqPreview);
router.get('/config',  ctrl.getFaqConfig);

// ── Admin (protected) ─────────────────────────────────────────────────────────
router.get('/topics',        auth, ctrl.getTopics);
router.post('/topics',       auth, ctrl.createTopic);
router.put('/topics/:id',    auth, ctrl.updateTopic);
router.delete('/topics/:id', auth, ctrl.deleteTopic);

router.put('/config/upsert', auth, ctrl.upsertFaqConfig);

router.get('/',              auth, ctrl.getAllFaqs);
router.post('/',             auth, ctrl.createFaq);
router.put('/:id',           auth, ctrl.updateFaq);
router.delete('/:id',        auth, ctrl.deleteFaq);

module.exports = router;
