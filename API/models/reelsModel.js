const db = require('../config/db');

const Reels = {
    getAll: async () => {
        const [rows] = await db.execute('SELECT * FROM reels ORDER BY sortOrder ASC, created_at DESC');
        return { status: 'success', data: rows };
    },
    getActive: async () => {
        const [rows] = await db.execute('SELECT * FROM reels WHERE isActive=1 ORDER BY sortOrder ASC, created_at DESC');
        return { status: 'success', data: rows };
    },
    create: async (data) => {
        const [result] = await db.execute(
            'INSERT INTO reels (videoUrl, thumbnail, title, sortOrder, isActive, created_at, updated_at) VALUES (?,?,?,?,?,NOW(),NOW())',
            [data.videoUrl, data.thumbnail || null, data.title || null, data.sortOrder || 0, data.isActive !== false ? 1 : 0]
        );
        return { status: 'success', data: { id: result.insertId } };
    },
    update: async (id, data) => {
        await db.execute(
            'UPDATE reels SET videoUrl=?, thumbnail=?, title=?, sortOrder=?, isActive=?, updated_at=NOW() WHERE id=?',
            [data.videoUrl, data.thumbnail || null, data.title || null, data.sortOrder || 0, data.isActive ? 1 : 0, id]
        );
        return { status: 'success' };
    },
    updateStatus: async (id, isActive) => {
        await db.execute('UPDATE reels SET isActive=?, updated_at=NOW() WHERE id=?', [isActive ? 1 : 0, id]);
        return { status: 'success' };
    },
    delete: async (id) => {
        await db.execute('DELETE FROM reels WHERE id=?', [id]);
        return { status: 'success' };
    }
};

module.exports = Reels;
