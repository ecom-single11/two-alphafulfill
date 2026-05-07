const db = require('../config/db');

const DEFAULT_MARQUEE = JSON.stringify([
    { emoji: '🎁', text: 'Free shipping on every order' },
    { emoji: '⚡', text: 'Get up to 20% OFF on all Prepaid Orders!' },
    { emoji: '🛒', text: 'Buy 3 Products for Just ₹699!' },
    { emoji: '✨', text: 'Free Kojic Acid Soap on purchase of Exfoliating Gel Pack of 3' }
]);

const siteconfig = {
    create: async (data) => {
        const sql = `INSERT INTO siteconfig
            (siteName, clientUrl, logo, whiteLogo, icon, instagramURL, facebookURL, twitterURL,
             linkedInURL, youtubeURL, mobile, email, currency, deliveryCharge, primaryColor, marqueeItems,
             metaPixelId, metaAccessToken,
             buyNowText, buyNowSubtext,
             created_at, updated_at)
            VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,NOW(),NOW())`;
        try {
            const [results] = await db.execute(sql, [
                data.siteName, data.clientUrl, data.logo, data.whiteLogo, data.icon,
                data.instagramURL, data.facebookURL, data.twitterURL, data.linkedInURL, data.youtubeURL,
                data.mobile, data.email, data.currency || '£', data.deliveryCharge ?? 20,
                data.primaryColor || '#7b10b9',
                data.marqueeItems ? JSON.stringify(data.marqueeItems) : DEFAULT_MARQUEE,
                data.metaPixelId || null,
                data.metaAccessToken || null,
                data.buyNowText || 'BUY NOW',
                data.buyNowSubtext || null
            ]);
            return { status: 'success', data: results };
        } catch (err) { throw err; }
    },

    getAll: async () => {
        try {
            const [results] = await db.execute(`SELECT * FROM siteconfig ORDER BY created_at DESC`);
            return {
                status: 'success',
                data: results.map(r => ({
                    ...r,
                    marqueeItems: r.marqueeItems
                        ? (typeof r.marqueeItems === 'string' ? JSON.parse(r.marqueeItems) : r.marqueeItems)
                        : JSON.parse(DEFAULT_MARQUEE)
                }))
            };
        } catch (err) { throw err; }
    },

    update: async (id, data) => {
        const sqlUpdate = `UPDATE siteconfig SET
            siteName=?, clientUrl=?, logo=?, whiteLogo=?, icon=?,
            instagramURL=?, facebookURL=?, twitterURL=?, linkedInURL=?, youtubeURL=?,
            mobile=?, email=?, currency=?, deliveryCharge=?, primaryColor=?, marqueeItems=?,
            metaPixelId=?, metaAccessToken=?,
            buyNowText=?, buyNowSubtext=?,
            updated_at=NOW() WHERE id=?`;
        try {
            const [results] = await db.execute(sqlUpdate, [
                data.siteName, data.clientUrl, data.logo, data.whiteLogo, data.icon,
                data.instagramURL, data.facebookURL, data.twitterURL, data.linkedInURL, data.youtubeURL,
                data.mobile, data.email, data.currency || '£', data.deliveryCharge ?? 20,
                data.primaryColor || '#7b10b9',
                data.marqueeItems ? JSON.stringify(data.marqueeItems) : DEFAULT_MARQUEE,
                data.metaPixelId || null,
                data.metaAccessToken || null,
                data.buyNowText || 'BUY NOW',
                data.buyNowSubtext || null,
                id
            ]);
            return { status: 'success', data: results };
        } catch (err) { throw err; }
    },

    delete: async (id) => {
        try {
            const [results] = await db.execute('DELETE FROM siteconfig WHERE id = ?', [id]);
            return results;
        } catch (err) { throw err; }
    }
};

module.exports = siteconfig;
