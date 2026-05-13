/**
 * Run this script ONCE to add all missing product columns.
 * Usage: node API/scripts/migrate-products.js
 */
require('dotenv').config({ path: require('path').join(__dirname, '../.env') });
const mysql = require('mysql2/promise');

async function run() {
    const conn = await mysql.createConnection({
        host:     process.env.DB_HOST,
        port:     process.env.DB_PORT || 3306,
        user:     process.env.DB_USER,
        password: process.env.DB_PASSWORD,
        database: process.env.DB_NAME,
    });

    const columns = [
        { name: 'shortDescription',    sql: "ALTER TABLE `products` ADD COLUMN `shortDescription` VARCHAR(500) DEFAULT NULL AFTER `description`" },
        { name: 'resultTag',           sql: "ALTER TABLE `products` ADD COLUMN `resultTag` VARCHAR(100) DEFAULT NULL AFTER `shortDescription`" },
        { name: 'badge',               sql: "ALTER TABLE `products` ADD COLUMN `badge` VARCHAR(100) DEFAULT NULL AFTER `resultTag`" },
        { name: 'benefits',            sql: "ALTER TABLE `products` ADD COLUMN `benefits` JSON DEFAULT NULL AFTER `badge`" },
        { name: 'whyLoveIt',           sql: "ALTER TABLE `products` ADD COLUMN `whyLoveIt` JSON DEFAULT NULL AFTER `benefits`" },
        { name: 'keyIngredients',      sql: "ALTER TABLE `products` ADD COLUMN `keyIngredients` JSON DEFAULT NULL AFTER `whyLoveIt`" },
        { name: 'howToUse',            sql: "ALTER TABLE `products` ADD COLUMN `howToUse` LONGTEXT DEFAULT NULL AFTER `keyIngredients`" },
        { name: 'additionalDetails',   sql: "ALTER TABLE `products` ADD COLUMN `additionalDetails` LONGTEXT DEFAULT NULL AFTER `howToUse`" },
        { name: 'consumerCareDetails', sql: "ALTER TABLE `products` ADD COLUMN `consumerCareDetails` LONGTEXT DEFAULT NULL AFTER `additionalDetails`" },
        { name: 'faqs',                sql: "ALTER TABLE `products` ADD COLUMN `faqs` JSON DEFAULT NULL AFTER `consumerCareDetails`" },
        { name: 'promoImage',          sql: "ALTER TABLE `products` ADD COLUMN `promoImage` VARCHAR(500) DEFAULT NULL AFTER `faqs`" },
        { name: 'promoReel',           sql: "ALTER TABLE `products` ADD COLUMN `promoReel` VARCHAR(500) DEFAULT NULL AFTER `promoImage`" },
        { name: 'galleryMedia',        sql: "ALTER TABLE `products` ADD COLUMN `galleryMedia` JSON DEFAULT NULL AFTER `promoReel`" },
        { name: 'sizeGuideImage',      sql: "ALTER TABLE `products` ADD COLUMN `sizeGuideImage` VARCHAR(500) DEFAULT NULL AFTER `galleryMedia`" },
        { name: 'isFeatured',          sql: "ALTER TABLE `products` ADD COLUMN `isFeatured` TINYINT(1) NOT NULL DEFAULT 0 AFTER `isActive`" },
        { name: 'sortOrder',           sql: "ALTER TABLE `products` ADD COLUMN `sortOrder` INT(11) NOT NULL DEFAULT 0 AFTER `isFeatured`" },
    ];

    console.log('Running product column migrations...\n');

    for (const col of columns) {
        try {
            await conn.execute(col.sql);
            console.log(`  ✅ Added: ${col.name}`);
        } catch (err) {
            if (err.code === 'ER_DUP_FIELDNAME') {
                console.log(`  ⏭  Already exists: ${col.name}`);
            } else {
                console.error(`  ❌ Failed: ${col.name} — ${err.message}`);
            }
        }
    }

    await conn.end();
    console.log('\nMigration complete.');
}

run().catch(err => { console.error(err); process.exit(1); });
