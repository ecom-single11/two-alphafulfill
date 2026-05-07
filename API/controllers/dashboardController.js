const Dashboard = require('../models/dashboardModel');

exports.adminDashboard = async (req, res) => {
    try {
        const result = await Dashboard.adminDashboard();
        res.status(200).json(result);
    } catch (err) {
        console.error('Dashboard error:', err);
        res.status(500).json({ error: 'Internal server error' });
    }
};
