-- Add sizeGuideImage column to products table
ALTER TABLE products ADD COLUMN IF NOT EXISTS sizeGuideImage VARCHAR(500) NULL AFTER galleryMedia;
