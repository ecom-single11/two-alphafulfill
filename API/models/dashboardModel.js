const db = require('../config/db');

const Dashboard = {
    adminDashboard: async () => {
        try {
            // ── Basic counts ──────────────────────────────────────────────────
            const [[{ totalOrders }]]   = await db.execute(`SELECT COUNT(*) AS totalOrders FROM orders`);
            const [[{ totalRevenue }]]  = await db.execute(`SELECT COALESCE(SUM(total),0) AS totalRevenue FROM orders WHERE status != 'cancelled'`);
            const [[{ totalProducts }]] = await db.execute(`SELECT COUNT(*) AS totalProducts FROM products WHERE isActive=1`);
            const [[{ totalCustomers }]]= await db.execute(`SELECT COUNT(*) AS totalCustomers FROM customers`);
            const [[{ abandonedCount }]]= await db.execute(`SELECT COUNT(*) AS abandonedCount FROM abandon_checkouts WHERE isConverted=0`);

            // ── Today ─────────────────────────────────────────────────────────
            const [[{ todaySale }]] = await db.execute(
                `SELECT COALESCE(SUM(total),0) AS todaySale FROM orders
                 WHERE DATE(created_at) = CURDATE() AND status != 'cancelled'`
            );
            const [[{ todayOrders }]] = await db.execute(
                `SELECT COUNT(*) AS todayOrders FROM orders WHERE DATE(created_at) = CURDATE()`
            );

            // ── This week (Mon–Sun) ───────────────────────────────────────────
            const [[{ weekSale }]] = await db.execute(
                `SELECT COALESCE(SUM(total),0) AS weekSale FROM orders
                 WHERE YEARWEEK(created_at, 1) = YEARWEEK(CURDATE(), 1) AND status != 'cancelled'`
            );
            const [[{ weekOrders }]] = await db.execute(
                `SELECT COUNT(*) AS weekOrders FROM orders
                 WHERE YEARWEEK(created_at, 1) = YEARWEEK(CURDATE(), 1)`
            );

            // ── This month ────────────────────────────────────────────────────
            const [[{ monthSale }]] = await db.execute(
                `SELECT COALESCE(SUM(total),0) AS monthSale FROM orders
                 WHERE MONTH(created_at)=MONTH(CURDATE()) AND YEAR(created_at)=YEAR(CURDATE()) AND status != 'cancelled'`
            );
            const [[{ monthOrders }]] = await db.execute(
                `SELECT COUNT(*) AS monthOrders FROM orders
                 WHERE MONTH(created_at)=MONTH(CURDATE()) AND YEAR(created_at)=YEAR(CURDATE())`
            );

            // ── Last 7 days daily sales (for line chart) ──────────────────────
            const [dailySales] = await db.execute(
                `SELECT DATE(created_at) AS day, COALESCE(SUM(total),0) AS revenue, COUNT(*) AS orders
                 FROM orders
                 WHERE created_at >= DATE_SUB(CURDATE(), INTERVAL 6 DAY) AND status != 'cancelled'
                 GROUP BY DATE(created_at)
                 ORDER BY day ASC`
            );

            // ── Last 6 months monthly sales (for bar chart) ───────────────────
            const [monthlySales] = await db.execute(
                `SELECT DATE_FORMAT(created_at,'%b %Y') AS month,
                        YEAR(created_at) AS yr, MONTH(created_at) AS mo,
                        COALESCE(SUM(total),0) AS revenue, COUNT(*) AS orders
                 FROM orders
                 WHERE created_at >= DATE_SUB(CURDATE(), INTERVAL 5 MONTH) AND status != 'cancelled'
                 GROUP BY yr, mo
                 ORDER BY yr ASC, mo ASC`
            );

            // ── Payment method breakdown ──────────────────────────────────────
            const [paymentMethods] = await db.execute(
                `SELECT paymentMethod, COUNT(*) AS cnt, COALESCE(SUM(total),0) AS revenue
                 FROM orders WHERE status != 'cancelled'
                 GROUP BY paymentMethod ORDER BY cnt DESC`
            );

            // ── Order status breakdown ────────────────────────────────────────
            const [orderStatuses] = await db.execute(
                `SELECT status, COUNT(*) AS cnt FROM orders GROUP BY status`
            );

            // ── Top 5 products by revenue ─────────────────────────────────────
            const [topProducts] = await db.execute(
                `SELECT
                    JSON_UNQUOTE(JSON_EXTRACT(item.value, '$.name')) AS name,
                    JSON_UNQUOTE(JSON_EXTRACT(item.value, '$.image')) AS image,
                    SUM(JSON_EXTRACT(item.value, '$.quantity')) AS qty,
                    SUM(
                        COALESCE(JSON_EXTRACT(item.value,'$.salePrice'), JSON_EXTRACT(item.value,'$.price'))
                        * JSON_EXTRACT(item.value,'$.quantity')
                    ) AS revenue
                 FROM orders o
                 JOIN JSON_TABLE(o.items, '$[*]' COLUMNS (value JSON PATH '$')) AS item
                 WHERE o.status != 'cancelled'
                 GROUP BY name
                 ORDER BY revenue DESC
                 LIMIT 5`
            );

            // ── Recent 5 orders ───────────────────────────────────────────────
            const [recentOrders] = await db.execute(
                `SELECT o.id, o.orderNumber, o.total, o.status, o.paymentMethod,
                        o.created_at,
                        COALESCE(o.guestName, CONCAT(c.firstName,' ',c.lastName)) AS customerName
                 FROM orders o
                 LEFT JOIN customers c ON c.id = o.customerId
                 ORDER BY o.created_at DESC LIMIT 5`
            );

            return {
                status: 'success',
                data: {
                    summary: {
                        totalOrders, totalRevenue, totalProducts, totalCustomers, abandonedCount,
                        todaySale, todayOrders, weekSale, weekOrders, monthSale, monthOrders
                    },
                    dailySales,
                    monthlySales,
                    paymentMethods,
                    orderStatuses,
                    topProducts,
                    recentOrders
                }
            };
        } catch (err) { throw err; }
    }
};

module.exports = Dashboard;
