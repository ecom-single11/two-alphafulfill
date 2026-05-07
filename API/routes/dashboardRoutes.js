const express = require('express');
const router = express.Router();
const DashboardController = require('../controllers/dashboardController');
const { auth } = require('../middlewares/auth.js');

router.get('/dashboard', auth, DashboardController.adminDashboard);

module.exports = router;
