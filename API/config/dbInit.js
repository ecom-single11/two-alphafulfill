const db = require('./db');

const tables = [

    // USERS
    {
        name: 'users',
        sql: `
            CREATE TABLE IF NOT EXISTS \`users\` (
                \`id\`         INT(11)      NOT NULL AUTO_INCREMENT,
                \`name\`       VARCHAR(255) NOT NULL,
                \`password\`   VARCHAR(255) NOT NULL,
                \`mobile\`     VARCHAR(20)  DEFAULT NULL,
                \`email\`      VARCHAR(255) NOT NULL,
                \`token\`      TEXT         DEFAULT NULL,
                \`roleName\`   VARCHAR(100) DEFAULT NULL,
                \`isActive\`   TINYINT(1)   NOT NULL DEFAULT 1,
                \`created_at\` DATETIME     NOT NULL,
                \`updated_at\` DATETIME     NOT NULL,
                PRIMARY KEY (\`id\`),
                UNIQUE KEY \`uq_users_email\` (\`email\`)
            ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
        `
    },

    // SITE CONFIG
    {
        name: 'siteconfig',
        sql: `
            CREATE TABLE IF NOT EXISTS \`siteconfig\` (
                \`id\`           INT(11)      NOT NULL AUTO_INCREMENT,
                \`siteName\`     VARCHAR(255) DEFAULT NULL,
                \`clientUrl\`    VARCHAR(500) DEFAULT NULL,
                \`logo\`         VARCHAR(500) DEFAULT NULL,
                \`whiteLogo\`    VARCHAR(500) DEFAULT NULL,
                \`icon\`         VARCHAR(500) DEFAULT NULL,
                \`instagramURL\` VARCHAR(500) DEFAULT NULL,
                \`facebookURL\`  VARCHAR(500) DEFAULT NULL,
                \`twitterURL\`   VARCHAR(500) DEFAULT NULL,
                \`linkedInURL\`  VARCHAR(500) DEFAULT NULL,
                \`youtubeURL\`   VARCHAR(500) DEFAULT NULL,
                \`mobile\`       VARCHAR(20)  DEFAULT NULL,
                \`email\`        VARCHAR(255) DEFAULT NULL,
                \`created_at\`   DATETIME     NOT NULL,
                \`updated_at\`   DATETIME     NOT NULL,
                PRIMARY KEY (\`id\`)
            ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
        `
    },

    // FILES
    {
        name: 'files',
        sql: `
            CREATE TABLE IF NOT EXISTS \`files\` (
                \`id\`         INT(11)      NOT NULL AUTO_INCREMENT,
                \`url\`        VARCHAR(500) NOT NULL,
                \`directory\`  VARCHAR(255) DEFAULT NULL,
                \`created_at\` DATETIME     NOT NULL,
                PRIMARY KEY (\`id\`),
                INDEX \`idx_files_directory\` (\`directory\`)
            ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
        `
    },

    // HOME BANNERS
    {
        name: 'home_banners',
        sql: `
            CREATE TABLE IF NOT EXISTS \`home_banners\` (
                \`id\`             INT(11)                NOT NULL AUTO_INCREMENT,
                \`type\`           ENUM('image','video')  NOT NULL DEFAULT 'image',
                \`url\`            VARCHAR(500)           NOT NULL,
                \`forMobile\`      TINYINT(1)             NOT NULL DEFAULT 0,
                \`redirectionUrl\` VARCHAR(500)           DEFAULT NULL,
                \`sortOrder\`      INT(11)                NOT NULL DEFAULT 0,
                \`isActive\`       TINYINT(1)             NOT NULL DEFAULT 1,
                \`created_at\`     DATETIME               NOT NULL,
                \`updated_at\`     DATETIME               NOT NULL,
                PRIMARY KEY (\`id\`),
                INDEX \`idx_hb_active_sort\` (\`isActive\`, \`sortOrder\`)
            ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
        `
    },

    // CATEGORIES
    {
        name: 'categories',
        sql: `
            CREATE TABLE IF NOT EXISTS \`categories\` (
                \`id\`         INT(11)      NOT NULL AUTO_INCREMENT,
                \`name\`       VARCHAR(255) NOT NULL,
                \`image\`      VARCHAR(500) DEFAULT NULL,
                \`parentId\`   INT(11)      DEFAULT NULL,
                \`sortOrder\`  INT(11)      NOT NULL DEFAULT 0,
                \`isActive\`   TINYINT(1)   NOT NULL DEFAULT 1,
                \`created_at\` DATETIME     NOT NULL,
                \`updated_at\` DATETIME     NOT NULL,
                PRIMARY KEY (\`id\`),
                INDEX \`idx_cat_parent\`      (\`parentId\`),
                INDEX \`idx_cat_active_sort\` (\`isActive\`, \`sortOrder\`),
                CONSTRAINT \`fk_cat_parent\` FOREIGN KEY (\`parentId\`)
                    REFERENCES \`categories\` (\`id\`) ON DELETE CASCADE ON UPDATE CASCADE
            ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
        `
    },

    // CATEGORIES: add image column if missing
    {
        name: 'categories_image_col',
        sql: `
            ALTER TABLE \`categories\`
            ADD COLUMN IF NOT EXISTS \`image\` VARCHAR(500) DEFAULT NULL
            AFTER \`name\`;
        `
    },

    // SITECONFIG: add currency column if missing
    {
        name: 'siteconfig_currency_col',
        sql: `
            ALTER TABLE \`siteconfig\`
            ADD COLUMN IF NOT EXISTS \`currency\` VARCHAR(10) NOT NULL DEFAULT '£'
            AFTER \`email\`;
        `
    },

    // SITECONFIG: add deliveryCharge column if missing
    {
        name: 'siteconfig_delivery_col',
        sql: `
            ALTER TABLE \`siteconfig\`
            ADD COLUMN IF NOT EXISTS \`deliveryCharge\` DECIMAL(10,2) NOT NULL DEFAULT 20.00
            AFTER \`currency\`;
        `
    },

    // SITECONFIG: add primaryColor column if missing
    {
        name: 'siteconfig_primaryColor_col',
        sql: `
            ALTER TABLE \`siteconfig\`
            ADD COLUMN IF NOT EXISTS \`primaryColor\` VARCHAR(20) NOT NULL DEFAULT '#7b10b9'
            AFTER \`deliveryCharge\`;
        `
    },

    // SITECONFIG: add marqueeItems column if missing
    {
        name: 'siteconfig_marqueeItems_col',
        sql: `
            ALTER TABLE \`siteconfig\`
            ADD COLUMN IF NOT EXISTS \`marqueeItems\` JSON DEFAULT NULL
            AFTER \`primaryColor\`;
        `
    },

    // SITECONFIG: add metaPixelId column if missing
    {
        name: 'siteconfig_metaPixelId_col',
        sql: `
            ALTER TABLE \`siteconfig\`
            ADD COLUMN IF NOT EXISTS \`metaPixelId\` VARCHAR(50) DEFAULT NULL
            AFTER \`marqueeItems\`;
        `
    },

    // ABANDON CHECKOUTS: rename firstName/lastName to name if needed
    {
        name: 'abandon_checkouts_name_col',
        sql: `
            ALTER TABLE \`abandon_checkouts\`
            ADD COLUMN IF NOT EXISTS \`name\` VARCHAR(200) DEFAULT NULL AFTER \`sessionId\`;
        `
    },

    // PRODUCTS: add isFeatured column if missing
    { name: 'products_isFeatured_col', sql: "ALTER TABLE `products` ADD COLUMN `isFeatured` TINYINT(1) NOT NULL DEFAULT 0 AFTER `isActive`" },

    // PRODUCTS: add promoReel column if missing
    { name: 'products_promoReel_col', sql: "ALTER TABLE `products` ADD COLUMN `promoReel` VARCHAR(500) DEFAULT NULL AFTER `promoImage`" },

    // PRODUCTS: add sizeGuideImage column if missing
    { name: 'products_sizeGuideImage_col', sql: "ALTER TABLE `products` ADD COLUMN `sizeGuideImage` VARCHAR(500) DEFAULT NULL AFTER `galleryMedia`" },

    // ABANDON CHECKOUTS
    {
        name: 'abandon_checkouts',
        sql: `
            CREATE TABLE IF NOT EXISTS \`abandon_checkouts\` (
                \`id\`            INT(11)      NOT NULL AUTO_INCREMENT,
                \`sessionId\`     VARCHAR(64)  NOT NULL,
                \`name\`          VARCHAR(200) DEFAULT NULL,
                \`email\`         VARCHAR(255) DEFAULT NULL,
                \`phone\`         VARCHAR(20)  DEFAULT NULL,
                \`address\`       JSON         DEFAULT NULL,
                \`items\`         JSON         NOT NULL,
                \`subtotal\`      DECIMAL(10,2) NOT NULL DEFAULT 0,
                \`total\`         DECIMAL(10,2) NOT NULL DEFAULT 0,
                \`isConverted\`   TINYINT(1)   NOT NULL DEFAULT 0,
                \`orderId\`       INT(11)      DEFAULT NULL,
                \`created_at\`    DATETIME     NOT NULL,
                \`updated_at\`    DATETIME     NOT NULL,
                PRIMARY KEY (\`id\`),
                UNIQUE KEY \`uq_abandon_session\` (\`sessionId\`),
                INDEX \`idx_abandon_email\` (\`email\`),
                INDEX \`idx_abandon_converted\` (\`isConverted\`)
            ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
        `
    },

    // BRANDS
    {
        name: 'brands',
        sql: `
            CREATE TABLE IF NOT EXISTS \`brands\` (
                \`id\`         INT(11)      NOT NULL AUTO_INCREMENT,
                \`name\`       VARCHAR(255) NOT NULL,
                \`image\`      VARCHAR(500) DEFAULT NULL,
                \`sortOrder\`  INT(11)      NOT NULL DEFAULT 0,
                \`isActive\`   TINYINT(1)   NOT NULL DEFAULT 1,
                \`created_at\` DATETIME     NOT NULL,
                \`updated_at\` DATETIME     NOT NULL,
                PRIMARY KEY (\`id\`),
                UNIQUE KEY \`uq_brand_name\` (\`name\`),
                INDEX \`idx_brand_active_sort\` (\`isActive\`, \`sortOrder\`)
            ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
        `
    },

    // BRAND_CATEGORIES
    {
        name: 'brand_categories',
        sql: `
            CREATE TABLE IF NOT EXISTS \`brand_categories\` (
                \`id\`         INT(11) NOT NULL AUTO_INCREMENT,
                \`brandId\`    INT(11) NOT NULL,
                \`categoryId\` INT(11) NOT NULL,
                PRIMARY KEY (\`id\`),
                UNIQUE KEY \`uq_brand_cat\` (\`brandId\`, \`categoryId\`),
                INDEX \`idx_bc_brand\`    (\`brandId\`),
                INDEX \`idx_bc_category\` (\`categoryId\`),
                CONSTRAINT \`fk_bc_brand\`    FOREIGN KEY (\`brandId\`)    REFERENCES \`brands\`     (\`id\`) ON DELETE CASCADE,
                CONSTRAINT \`fk_bc_category\` FOREIGN KEY (\`categoryId\`) REFERENCES \`categories\` (\`id\`) ON DELETE CASCADE
            ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
        `
    },

    // PRODUCTS
    {
        name: 'products',
        sql: `
            CREATE TABLE IF NOT EXISTS \`products\` (
                \`id\`          INT(11)        NOT NULL AUTO_INCREMENT,
                \`name\`        VARCHAR(500)   NOT NULL,
                \`slug\`        VARCHAR(500)   NOT NULL DEFAULT '',
                \`description\` LONGTEXT       DEFAULT NULL,
                \`price\`       DECIMAL(10,2)  NOT NULL DEFAULT 0.00,
                \`salePrice\`   DECIMAL(10,2)  DEFAULT NULL,
                \`categoryId\`  INT(11)        DEFAULT NULL,
                \`brandId\`     INT(11)        DEFAULT NULL,
                \`images\`      JSON           DEFAULT NULL,
                \`variants\`    JSON           DEFAULT NULL,
                \`tags\`        JSON           DEFAULT NULL,
                \`avgRating\`   DECIMAL(3,2)   NOT NULL DEFAULT 0.00,
                \`reviewCount\` INT(11)        NOT NULL DEFAULT 0,
                \`isActive\`    TINYINT(1)     NOT NULL DEFAULT 1,
                \`sortOrder\`   INT(11)        NOT NULL DEFAULT 0,
                \`created_at\`  DATETIME       NOT NULL,
                \`updated_at\`  DATETIME       NOT NULL,
                PRIMARY KEY (\`id\`),
                INDEX \`idx_prod_slug\`   (\`slug\`(191)),
                INDEX \`idx_prod_cat\`    (\`categoryId\`),
                INDEX \`idx_prod_brand\`  (\`brandId\`),
                INDEX \`idx_prod_active\` (\`isActive\`),
                CONSTRAINT \`fk_prod_cat\`   FOREIGN KEY (\`categoryId\`) REFERENCES \`categories\` (\`id\`) ON DELETE SET NULL,
                CONSTRAINT \`fk_prod_brand\` FOREIGN KEY (\`brandId\`)    REFERENCES \`brands\`     (\`id\`) ON DELETE SET NULL
            ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
        `
    },

    // PRODUCTS: extra Sanfe-style fields (individual columns for MySQL 5.7 compat)
    { name: 'products_col_shortDescription',    sql: "ALTER TABLE `products` ADD COLUMN `shortDescription` VARCHAR(500) DEFAULT NULL AFTER `description`" },
    { name: 'products_col_resultTag',           sql: "ALTER TABLE `products` ADD COLUMN `resultTag` VARCHAR(100) DEFAULT NULL AFTER `shortDescription`" },
    { name: 'products_col_badge',               sql: "ALTER TABLE `products` ADD COLUMN `badge` VARCHAR(100) DEFAULT NULL AFTER `resultTag`" },
    { name: 'products_col_benefits',            sql: "ALTER TABLE `products` ADD COLUMN `benefits` JSON DEFAULT NULL AFTER `badge`" },
    { name: 'products_col_whyLoveIt',           sql: "ALTER TABLE `products` ADD COLUMN `whyLoveIt` JSON DEFAULT NULL AFTER `benefits`" },
    { name: 'products_col_keyIngredients',      sql: "ALTER TABLE `products` ADD COLUMN `keyIngredients` JSON DEFAULT NULL AFTER `whyLoveIt`" },
    { name: 'products_col_howToUse',            sql: "ALTER TABLE `products` ADD COLUMN `howToUse` LONGTEXT DEFAULT NULL AFTER `keyIngredients`" },
    { name: 'products_col_additionalDetails',   sql: "ALTER TABLE `products` ADD COLUMN `additionalDetails` LONGTEXT DEFAULT NULL AFTER `howToUse`" },
    { name: 'products_col_consumerCareDetails', sql: "ALTER TABLE `products` ADD COLUMN `consumerCareDetails` LONGTEXT DEFAULT NULL AFTER `additionalDetails`" },
    { name: 'products_col_faqs',                sql: "ALTER TABLE `products` ADD COLUMN `faqs` JSON DEFAULT NULL AFTER `consumerCareDetails`" },
    { name: 'products_col_promoImage',          sql: "ALTER TABLE `products` ADD COLUMN `promoImage` VARCHAR(500) DEFAULT NULL AFTER `faqs`" },
    { name: 'products_col_promoReel',           sql: "ALTER TABLE `products` ADD COLUMN `promoReel` VARCHAR(500) DEFAULT NULL AFTER `promoImage`" },
    { name: 'products_col_galleryMedia',        sql: "ALTER TABLE `products` ADD COLUMN `galleryMedia` JSON DEFAULT NULL AFTER `promoReel`" },
    { name: 'products_col_sizeGuideImage',      sql: "ALTER TABLE `products` ADD COLUMN `sizeGuideImage` VARCHAR(500) DEFAULT NULL AFTER `galleryMedia`" },
    { name: 'products_col_isFeatured',          sql: "ALTER TABLE `products` ADD COLUMN `isFeatured` TINYINT(1) NOT NULL DEFAULT 0 AFTER `isActive`" },
    { name: 'products_col_sortOrder',           sql: "ALTER TABLE `products` ADD COLUMN `sortOrder` INT(11) NOT NULL DEFAULT 0 AFTER `isFeatured`" },

    // PRODUCT REVIEWS
    {
        name: 'product_reviews',
        sql: `
            CREATE TABLE IF NOT EXISTS \`product_reviews\` (
                \`id\`           INT(11)      NOT NULL AUTO_INCREMENT,
                \`productId\`    INT(11)      NOT NULL,
                \`reviewerName\` VARCHAR(255) NOT NULL,
                \`rating\`       TINYINT(1)   NOT NULL DEFAULT 5,
                \`title\`        VARCHAR(500) DEFAULT NULL,
                \`body\`         TEXT         DEFAULT NULL,
                \`isActive\`     TINYINT(1)   NOT NULL DEFAULT 1,
                \`created_at\`   DATETIME     NOT NULL,
                \`updated_at\`   DATETIME     NOT NULL,
                PRIMARY KEY (\`id\`),
                INDEX \`idx_rev_product\` (\`productId\`),
                CONSTRAINT \`fk_rev_product\` FOREIGN KEY (\`productId\`) REFERENCES \`products\` (\`id\`) ON DELETE CASCADE
            ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
        `
    },

    // CUSTOMERS
    {
        name: 'customers',
        sql: `
            CREATE TABLE IF NOT EXISTS \`customers\` (
                \`id\`          INT(11)      NOT NULL AUTO_INCREMENT,
                \`firstName\`   VARCHAR(100) NOT NULL,
                \`lastName\`    VARCHAR(100) NOT NULL,
                \`email\`       VARCHAR(255) NOT NULL,
                \`password\`    VARCHAR(255) NOT NULL,
                \`mobile\`      VARCHAR(20)  DEFAULT NULL,
                \`dateOfBirth\` DATE         DEFAULT NULL,
                \`token\`       TEXT         DEFAULT NULL,
                \`isActive\`    TINYINT(1)   NOT NULL DEFAULT 1,
                \`created_at\`  DATETIME     NOT NULL,
                \`updated_at\`  DATETIME     NOT NULL,
                PRIMARY KEY (\`id\`),
                UNIQUE KEY \`uq_customers_email\` (\`email\`),
                INDEX \`idx_cust_active\` (\`isActive\`)
            ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
        `
    },

    // CUSTOMER ADDRESSES
    {
        name: 'customer_addresses',
        sql: `
            CREATE TABLE IF NOT EXISTS \`customer_addresses\` (
                \`id\`         INT(11)      NOT NULL AUTO_INCREMENT,
                \`customerId\` INT(11)      NOT NULL,
                \`firstName\`  VARCHAR(100) NOT NULL,
                \`lastName\`   VARCHAR(100) NOT NULL,
                \`line1\`      VARCHAR(255) NOT NULL,
                \`line2\`      VARCHAR(255) DEFAULT NULL,
                \`city\`       VARCHAR(100) DEFAULT NULL,
                \`county\`     VARCHAR(100) DEFAULT NULL,
                \`postcode\`   VARCHAR(20)  NOT NULL,
                \`country\`    VARCHAR(100) NOT NULL DEFAULT 'United Kingdom',
                \`phone\`      VARCHAR(20)  DEFAULT NULL,
                \`isDefault\`  TINYINT(1)   NOT NULL DEFAULT 0,
                \`created_at\` DATETIME     NOT NULL,
                \`updated_at\` DATETIME     NOT NULL,
                PRIMARY KEY (\`id\`),
                INDEX \`idx_addr_customer\` (\`customerId\`),
                CONSTRAINT \`fk_addr_customer\` FOREIGN KEY (\`customerId\`)
                    REFERENCES \`customers\` (\`id\`) ON DELETE CASCADE
            ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
        `
    },

    // PAYMENT SETTINGS
    {
        name: 'payment_settings',
        sql: `
            CREATE TABLE IF NOT EXISTS \`payment_settings\` (
                \`id\`                INT(11)      NOT NULL AUTO_INCREMENT,
                \`razorpayKeyId\`     VARCHAR(255) DEFAULT NULL,
                \`razorpayKeySecret\` VARCHAR(255) DEFAULT NULL,
                \`isTestMode\`        TINYINT(1)   NOT NULL DEFAULT 1,
                \`isActive\`          TINYINT(1)   NOT NULL DEFAULT 1,
                \`created_at\`        DATETIME     NOT NULL,
                \`updated_at\`        DATETIME     NOT NULL,
                PRIMARY KEY (\`id\`)
            ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
        `
    },

    // PAYMENT SETTINGS: add PhonePe columns if missing
    {
        name: 'payment_settings_phonepe',
        sql: `
            ALTER TABLE \`payment_settings\`
            ADD COLUMN IF NOT EXISTS \`phonepeMerchantId\`  VARCHAR(255) DEFAULT NULL AFTER \`razorpayKeySecret\`,
            ADD COLUMN IF NOT EXISTS \`phonepeApiKey\`      VARCHAR(500) DEFAULT NULL AFTER \`phonepeMerchantId\`,
            ADD COLUMN IF NOT EXISTS \`phonepeSaltIndex\`   VARCHAR(10)  DEFAULT '1'  AFTER \`phonepeApiKey\`,
            ADD COLUMN IF NOT EXISTS \`phonepeSaltKey\`     VARCHAR(500) DEFAULT NULL AFTER \`phonepeSaltIndex\`,
            ADD COLUMN IF NOT EXISTS \`phonepeMerchantUserId\` VARCHAR(255) DEFAULT NULL AFTER \`phonepeSaltKey\`,
            ADD COLUMN IF NOT EXISTS \`phonepeIsActive\`    TINYINT(1)   NOT NULL DEFAULT 0 AFTER \`phonepeMerchantUserId\`,
            ADD COLUMN IF NOT EXISTS \`codIsActive\`        TINYINT(1)   NOT NULL DEFAULT 0 AFTER \`phonepeIsActive\`;
        `
    },

    // ORDERS
    {
        name: 'orders',
        sql: `
            CREATE TABLE IF NOT EXISTS \`orders\` (
                \`id\`                INT(11)       NOT NULL AUTO_INCREMENT,
                \`customerId\`        INT(11)       NOT NULL,
                \`orderNumber\`       VARCHAR(100)  NOT NULL,
                \`items\`             JSON          NOT NULL,
                \`subtotal\`          DECIMAL(10,2) NOT NULL DEFAULT 0.00,
                \`deliveryCharge\`    DECIMAL(10,2) NOT NULL DEFAULT 0.00,
                \`total\`             DECIMAL(10,2) NOT NULL DEFAULT 0.00,
                \`deliveryAddress\`   JSON          DEFAULT NULL,
                \`contactPhone\`      VARCHAR(20)   DEFAULT NULL,
                \`paymentMethod\`     VARCHAR(50)   DEFAULT 'razorpay',
                \`paymentId\`         VARCHAR(255)  DEFAULT NULL,
                \`razorpayOrderId\`   VARCHAR(255)  DEFAULT NULL,
                \`razorpayPaymentId\` VARCHAR(255)  DEFAULT NULL,
                \`status\`            ENUM('pending','confirmed','processing','shipped','delivered','cancelled') NOT NULL DEFAULT 'pending',
                \`notes\`             TEXT          DEFAULT NULL,
                \`created_at\`        DATETIME      NOT NULL,
                \`updated_at\`        DATETIME      NOT NULL,
                PRIMARY KEY (\`id\`),
                UNIQUE KEY \`uq_order_number\` (\`orderNumber\`),
                INDEX \`idx_order_customer\` (\`customerId\`),
                INDEX \`idx_order_status\`   (\`status\`),
                CONSTRAINT \`fk_order_customer\` FOREIGN KEY (\`customerId\`)
                    REFERENCES \`customers\` (\`id\`) ON DELETE CASCADE
            ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
        `
    },

    // CONTACT LEADS
    {
        name: 'contact_leads',
        sql: `
            CREATE TABLE IF NOT EXISTS \`contact_leads\` (
                \`id\`         INT(11)      NOT NULL AUTO_INCREMENT,
                \`name\`       VARCHAR(255) NOT NULL,
                \`email\`      VARCHAR(255) NOT NULL,
                \`phone\`      VARCHAR(20)  DEFAULT NULL,
                \`message\`    TEXT         NOT NULL,
                \`isRead\`     TINYINT(1)   NOT NULL DEFAULT 0,
                \`created_at\` DATETIME     NOT NULL,
                PRIMARY KEY (\`id\`),
                INDEX \`idx_lead_read\` (\`isRead\`)
            ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
        `
    },

    // FAQ TOPICS
    {
        name: 'faq_topics',
        sql: `
            CREATE TABLE IF NOT EXISTS \`faq_topics\` (
                \`id\`         INT(11)      NOT NULL AUTO_INCREMENT,
                \`name\`       VARCHAR(255) NOT NULL,
                \`sortOrder\`  INT(11)      NOT NULL DEFAULT 0,
                \`isActive\`   TINYINT(1)   NOT NULL DEFAULT 1,
                \`created_at\` DATETIME     NOT NULL,
                \`updated_at\` DATETIME     NOT NULL,
                PRIMARY KEY (\`id\`)
            ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
        `
    },

    // FAQS
    {
        name: 'faqs',
        sql: `
            CREATE TABLE IF NOT EXISTS \`faqs\` (
                \`id\`         INT(11)      NOT NULL AUTO_INCREMENT,
                \`topicId\`    INT(11)      DEFAULT NULL,
                \`question\`   VARCHAR(500) NOT NULL,
                \`answer\`     TEXT         NOT NULL,
                \`sortOrder\`  INT(11)      NOT NULL DEFAULT 0,
                \`isActive\`   TINYINT(1)   NOT NULL DEFAULT 1,
                \`created_at\` DATETIME     NOT NULL,
                \`updated_at\` DATETIME     NOT NULL,
                PRIMARY KEY (\`id\`),
                INDEX \`idx_faq_topic\` (\`topicId\`),
                CONSTRAINT \`fk_faq_topic\` FOREIGN KEY (\`topicId\`)
                    REFERENCES \`faq_topics\` (\`id\`) ON DELETE SET NULL
            ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
        `
    },

    // FAQ PAGE CONFIG (banner image + page title)
    {
        name: 'faq_config',
        sql: `
            CREATE TABLE IF NOT EXISTS \`faq_config\` (
                \`id\`          INT(11)      NOT NULL AUTO_INCREMENT,
                \`pageTitle\`   VARCHAR(255) DEFAULT 'FAQs',
                \`bannerImage\` VARCHAR(500) DEFAULT NULL,
                \`updated_at\`  DATETIME     NOT NULL,
                PRIMARY KEY (\`id\`)
            ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
        `
    },

    // PROMO BANNERS
    {
        name: 'promo_banners',
        sql: `
            CREATE TABLE IF NOT EXISTS \`promo_banners\` (
                \`id\`             INT(11)      NOT NULL AUTO_INCREMENT,
                \`rowIndex\`       TINYINT(1)   NOT NULL,
                \`colIndex\`       TINYINT(1)   NOT NULL,
                \`url\`            VARCHAR(500) DEFAULT NULL,
                \`redirectionUrl\` VARCHAR(500) DEFAULT NULL,
                \`label\`          VARCHAR(255) DEFAULT NULL,
                \`isActive\`       TINYINT(1)   NOT NULL DEFAULT 1,
                \`created_at\`     DATETIME     NOT NULL,
                \`updated_at\`     DATETIME     NOT NULL,
                PRIMARY KEY (\`id\`),
                UNIQUE KEY \`uq_promo_slot\` (\`rowIndex\`, \`colIndex\`)
            ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
        `
    },

    // ORDERS: allow guest orders (nullable customerId + guest fields)
    {
        name: 'orders_guest_cols',
        sql: `
            ALTER TABLE \`orders\`
            MODIFY COLUMN \`customerId\` INT(11) DEFAULT NULL,
            ADD COLUMN IF NOT EXISTS \`guestName\`  VARCHAR(200) DEFAULT NULL AFTER \`contactPhone\`,
            ADD COLUMN IF NOT EXISTS \`guestEmail\` VARCHAR(255) DEFAULT NULL AFTER \`guestName\`;
        `
    },

    // LEGAL PAGES
    {
        name: 'legal_pages',
        sql: `
            CREATE TABLE IF NOT EXISTS \`legal_pages\` (
                \`id\`         INT(11)      NOT NULL AUTO_INCREMENT,
                \`slug\`       VARCHAR(100) NOT NULL,
                \`title\`      VARCHAR(255) NOT NULL,
                \`content\`    LONGTEXT     DEFAULT NULL,
                \`updated_at\` DATETIME     NOT NULL,
                PRIMARY KEY (\`id\`),
                UNIQUE KEY \`uq_legal_slug\` (\`slug\`)
            ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
        `
    },

    // ABOUT US
    {
        name: 'about_us',
        sql: `
            CREATE TABLE IF NOT EXISTS \`about_us\` (
                \`id\`           INT(11)      NOT NULL AUTO_INCREMENT,
                \`bannerImage\`  VARCHAR(500) DEFAULT NULL,
                \`tagline\`      VARCHAR(255) DEFAULT NULL,
                \`storyTitle\`   VARCHAR(255) DEFAULT NULL,
                \`storyText\`    LONGTEXT     DEFAULT NULL,
                \`storyImage\`   VARCHAR(500) DEFAULT NULL,
                \`vision\`       TEXT         DEFAULT NULL,
                \`mission\`      TEXT         DEFAULT NULL,
                \`values\`       JSON         DEFAULT NULL,
                \`stats\`        JSON         DEFAULT NULL,
                \`teamTitle\`    VARCHAR(255) DEFAULT NULL,
                \`team\`         JSON         DEFAULT NULL,
                \`updated_at\`   DATETIME     NOT NULL,
                PRIMARY KEY (\`id\`)
            ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
        `
    },

    // SITECONFIG: add metaAccessToken column if missing
    {
        name: 'siteconfig_metaAccessToken_col',
        sql: `
            ALTER TABLE \`siteconfig\`
            ADD COLUMN IF NOT EXISTS \`metaAccessToken\` VARCHAR(500) DEFAULT NULL
            AFTER \`metaPixelId\`;
        `
    },

    // SITECONFIG: add buyNow text columns if missing
    {
        name: 'siteconfig_buynow_cols',
        sql: `
            ALTER TABLE \`siteconfig\`
            ADD COLUMN IF NOT EXISTS \`buyNowText\`    VARCHAR(100) DEFAULT 'BUY NOW' AFTER \`metaPixelId\`,
            ADD COLUMN IF NOT EXISTS \`buyNowSubtext\` VARCHAR(200) DEFAULT NULL      AFTER \`buyNowText\`;
        `
    },

    // REELS
    {
        name: 'reels',
        sql: `
            CREATE TABLE IF NOT EXISTS \`reels\` (
                \`id\`          INT(11)      NOT NULL AUTO_INCREMENT,
                \`videoUrl\`    VARCHAR(500) NOT NULL,
                \`thumbnail\`   VARCHAR(500) DEFAULT NULL,
                \`title\`       VARCHAR(255) DEFAULT NULL,
                \`sortOrder\`   INT(11)      NOT NULL DEFAULT 0,
                \`isActive\`    TINYINT(1)   NOT NULL DEFAULT 1,
                \`created_at\`  DATETIME     NOT NULL,
                \`updated_at\`  DATETIME     NOT NULL,
                PRIMARY KEY (\`id\`),
                INDEX \`idx_reels_active_sort\` (\`isActive\`, \`sortOrder\`)
            ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
        `
    },

];

async function initDB() {
    console.log('Checking database tables...');
    for (const table of tables) {
        try {
            await db.execute(table.sql);
            console.log(`   Table ready: ${table.name}`);
        } catch (err) {
            // ER_DUP_FIELDNAME = column already exists — safe to ignore
            if (err.code === 'ER_DUP_FIELDNAME') {
                console.log(`   Column exists (ok): ${table.name}`);
            } else {
                console.error(`   Failed: ${table.name} - ${err.message}`);
            }
        }
    }
    console.log('Database init complete.\n');
}

module.exports = initDB;
