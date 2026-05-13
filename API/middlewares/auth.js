var jwt = require('jsonwebtoken');
const db = require('../config/db');

module.exports.auth = async (req, res, next) => {
    try {
        const token = req.headers.authorization;
        let decoded;
        
        if (token) {
            decoded = jwt.verify(token, process.env.JWT_KEY);
        }

        if (!decoded) {
            return res.status(401).send({ status: 401, msg: "Unauthorized" });
        }

        let rows = [];
        if (decoded.type === 'Administrator User') {
            [rows] = await db.execute(`SELECT * FROM users WHERE token = ?`, [token]);
        }

        if (!rows || rows.length === 0) {
            return res.status(401).send({ status: 401, msg: "Unauthorized" });
        } else {
            req.userDetails = { data: rows[0], type: decoded.type };
            next();
        }
    } catch (e) {
        console.log(e);
        return res.status(401).send({ status: 401, msg: "Unauthorized" });
    }
};