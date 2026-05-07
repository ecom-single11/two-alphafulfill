const db = require('../config/db');

async function getSettings() {
    const [rows] = await db.execute('SELECT * FROM payment_settings LIMIT 1');
    return rows[0] || null;
}

async function upsertSettings(data) {
    const existing = await getSettings();
    const now = new Date();
    const vals = [
        data.razorpayKeyId || null, data.razorpayKeySecret || null,
        data.isTestMode ? 1 : 0, data.isActive ? 1 : 0,
        data.phonepeMerchantId || null, data.phonepeApiKey || null,
        data.phonepeSaltIndex || '1', data.phonepeSaltKey || null,
        data.phonepeMerchantUserId || null, data.phonepeIsActive ? 1 : 0,
        data.codIsActive ? 1 : 0,
        now
    ];
    if (existing) {
        await db.execute(
            `UPDATE payment_settings SET
                razorpayKeyId=?, razorpayKeySecret=?, isTestMode=?, isActive=?,
                phonepeMerchantId=?, phonepeApiKey=?, phonepeSaltIndex=?, phonepeSaltKey=?,
                phonepeMerchantUserId=?, phonepeIsActive=?, codIsActive=?,
                updated_at=? WHERE id=?`,
            [...vals, existing.id]
        );
    } else {
        await db.execute(
            `INSERT INTO payment_settings
                (razorpayKeyId, razorpayKeySecret, isTestMode, isActive,
                 phonepeMerchantId, phonepeApiKey, phonepeSaltIndex, phonepeSaltKey,
                 phonepeMerchantUserId, phonepeIsActive, codIsActive, created_at, updated_at)
             VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?)`,
            [...vals, now]
        );
    }
    return await getSettings();
}

module.exports = { getSettings, upsertSettings };
