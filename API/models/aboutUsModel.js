const db = require('../config/db');

const DEFAULT = {
    bannerImage: null,
    tagline: 'Our Story, Our Mission',
    storyTitle: 'Who We Are',
    storyText: 'We are a brand built on passion, quality, and care.',
    storyImage: null,
    vision: 'To be the most trusted brand in every home.',
    mission: 'To deliver premium quality products that make everyday life better.',
    values: [
        { icon: '✨', title: 'Quality', text: 'We never compromise on quality.' },
        { icon: '💚', title: 'Care', text: 'Every product is made with care.' },
        { icon: '🌿', title: 'Sustainability', text: 'We care for the planet.' },
        { icon: '🤝', title: 'Trust', text: 'Built on trust, one customer at a time.' }
    ],
    stats: [
        { number: '1M+', label: 'Happy Customers' },
        { number: '500+', label: 'Products' },
        { number: '10+', label: 'Years of Excellence' },
        { number: '50+', label: 'Countries' }
    ],
    teamTitle: 'Meet Our Team',
    team: []
};

const AboutUs = {
    get: async () => {
        const [rows] = await db.execute('SELECT * FROM about_us LIMIT 1');
        if (!rows[0]) return { status: 'success', data: DEFAULT };
        const r = rows[0];
        return {
            status: 'success',
            data: {
                ...r,
                values: tryParse(r.values, DEFAULT.values),
                stats:  tryParse(r.stats,  DEFAULT.stats),
                team:   tryParse(r.team,   DEFAULT.team)
            }
        };
    },

    upsert: async (data) => {
        const now = new Date();
        const [existing] = await db.execute('SELECT id FROM about_us LIMIT 1');
        const vals = [
            data.bannerImage || null, data.tagline || null,
            data.storyTitle || null, data.storyText || null, data.storyImage || null,
            data.vision || null, data.mission || null,
            JSON.stringify(data.values || []),
            JSON.stringify(data.stats  || []),
            data.teamTitle || null,
            JSON.stringify(data.team   || []),
            now
        ];
        if (existing.length > 0) {
            await db.execute(
                `UPDATE about_us SET bannerImage=?,tagline=?,storyTitle=?,storyText=?,storyImage=?,
                 vision=?,mission=?,values=?,stats=?,teamTitle=?,team=?,updated_at=? WHERE id=?`,
                [...vals, existing[0].id]
            );
        } else {
            await db.execute(
                `INSERT INTO about_us (bannerImage,tagline,storyTitle,storyText,storyImage,
                 vision,mission,values,stats,teamTitle,team,updated_at) VALUES (?,?,?,?,?,?,?,?,?,?,?,?)`,
                vals
            );
        }
        return AboutUs.get();
    }
};

function tryParse(val, fallback) {
    try { return val ? (typeof val === 'string' ? JSON.parse(val) : val) : fallback; }
    catch { return fallback; }
}

module.exports = AboutUs;
