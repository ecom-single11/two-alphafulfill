-- Home Banners Table for Full-Width Slider
CREATE TABLE IF NOT EXISTS `home_banners` (
  `id` INT(11) NOT NULL AUTO_INCREMENT,
  `type` ENUM('image', 'video') NOT NULL DEFAULT 'image' COMMENT 'Media type: image or video',
  `url` VARCHAR(500) NOT NULL COMMENT 'URL of the image or video',
  `forMobile` TINYINT(1) NOT NULL DEFAULT 0 COMMENT '1 = Mobile only, 0 = Desktop/All',
  `redirectionUrl` VARCHAR(500) DEFAULT NULL COMMENT 'URL to redirect on click (opens in new tab)',
  `sortOrder` INT(11) NOT NULL DEFAULT 0 COMMENT 'Display order (lower = first)',
  `isActive` TINYINT(1) NOT NULL DEFAULT 1 COMMENT '1 = Active, 0 = Inactive',
  `created_at` DATETIME NOT NULL,
  `updated_at` DATETIME NOT NULL,
  PRIMARY KEY (`id`),
  INDEX `idx_active_sort` (`isActive`, `sortOrder`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Sample data
INSERT INTO `home_banners` (`type`, `url`, `forMobile`, `redirectionUrl`, `sortOrder`, `isActive`, `created_at`, `updated_at`) VALUES
('image', 'https://placehold.co/1920x600/1c1c1c/ffffff?text=Desktop+Banner+1', 0, 'https://www.next.co.uk/shop/gender-women', 1, 1, NOW(), NOW()),
('image', 'https://placehold.co/1920x600/c8102e/ffffff?text=Desktop+Banner+2', 0, 'https://www.next.co.uk/shop/gender-men', 2, 1, NOW(), NOW()),
('image', 'https://placehold.co/768x400/1c1c1c/ffffff?text=Mobile+Banner+1', 1, 'https://www.next.co.uk/shop/gender-women', 1, 1, NOW(), NOW()),
('image', 'https://placehold.co/768x400/c8102e/ffffff?text=Mobile+Banner+2', 1, 'https://www.next.co.uk/shop/gender-men', 2, 1, NOW(), NOW());
