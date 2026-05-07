/**
 * Product Seed Script
 * Run: node scripts/seedProducts.js
 * Inserts 100 sample products into the database.
 * Safe to run multiple times — skips if products already exist.
 */

require('dotenv').config({ path: require('path').join(__dirname, '../.env') });
const db = require('../config/db');

const images = [
    'https://xcdn.next.co.uk/common/items/default/default/itemimages/3_4Ratio/product/lge/V28965s.jpg?im=Resize,width=750',
    'https://xcdn.next.co.uk/Common/Items/Default/Default/ItemImages/3_4Ratio/Search/Lge/G12769.jpg?im=Resize,width=450',
    'https://xcdn.next.co.uk/Common/Items/Default/Default/ItemImages/3_4Ratio/Search/Lge/G98617.jpg?im=Resize,width=450',
    'https://xcdn.next.co.uk/Common/Items/Default/Default/ItemImages/3_4Ratio/Search/Lge/V02370.jpg?im=Resize,width=450',
    'https://xcdn.next.co.uk/Common/Items/Default/Default/ItemImages/3_4Ratio/Search/Lge/V37174.jpg?im=Resize,width=450',
    'https://xcdn.next.co.uk/Common/Items/Default/Default/ItemImages/3_4Ratio/Search/Lge/G72035.jpg?im=Resize,width=450',
    'https://xcdn.next.co.uk/Common/Items/Default/Default/ItemImages/3_4Ratio/Search/Lge/G54316.jpg?im=Resize,width=450',
    'https://xcdn.next.co.uk/Common/Items/Default/Default/ItemImages/3_4Ratio/Search/Lge/E69210.jpg?im=Resize,width=450',
    'https://xcdn.next.co.uk/Common/Items/Default/Default/ItemImages/3_4Ratio/Search/Lge/V93112.jpg?im=Resize,width=450',
    'https://xcdn.next.co.uk/Common/Items/Default/Default/ItemImages/3_4Ratio/Search/Lge/H56225.jpg?im=Resize,width=450',
    'https://xcdn.next.co.uk/Common/Items/Default/Default/ItemImages/3_4Ratio/Search/Lge/G78573.jpg?im=Resize,width=450',
    'https://xcdn.next.co.uk/Common/Items/Default/Default/ItemImages/3_4Ratio/Search/Lge/H53192.jpg?im=Resize,width=450',
    'https://xcdn.next.co.uk/Common/Items/Default/Default/ItemImages/3_4Ratio/Search/Lge/W85416.jpg?im=Resize,width=450',
    'https://xcdn.next.co.uk/Common/Items/Default/Default/ItemImages/3_4Ratio/Search/Lge/Y92253.jpg?im=Resize,width=450',
    'https://xcdn.next.co.uk/Common/Items/Default/Default/ItemImages/3_4Ratio/Search/Lge/Y31276.jpg?im=Resize,width=450',
    'https://xcdn.next.co.uk/Common/Items/Default/Default/ItemImages/3_4Ratio/Search/Lge/H64369.jpg?im=Resize,width=450',
];

const products = [
    // ── Women's Clothing ──────────────────────────────────────────────────────
    { name: 'Black Polo Shirt', price: 25.00, salePrice: 18.00, desc: 'Classic black polo shirt, perfect for smart casual occasions.' },
    { name: 'Floral Summer Dress', price: 38.00, salePrice: 28.00, desc: 'Light and breezy floral print summer dress.' },
    { name: 'Navy Blue Hoodie', price: 32.00, salePrice: null, desc: 'Warm and comfortable navy hoodie for everyday wear.' },
    { name: 'White Linen Blouse', price: 28.00, salePrice: null, desc: 'Elegant white linen blouse, ideal for warm weather.' },
    { name: 'Red Wrap Dress', price: 42.00, salePrice: 32.00, desc: 'Flattering red wrap dress for any occasion.' },
    { name: 'Grey Maxi Skirt', price: 35.00, salePrice: null, desc: 'Flowing grey maxi skirt with elastic waistband.' },
    { name: 'Striped Breton Top', price: 22.00, salePrice: null, desc: 'Classic Breton stripe top in navy and white.' },
    { name: 'Black Midi Dress', price: 48.00, salePrice: 36.00, desc: 'Sophisticated black midi dress for evenings out.' },
    { name: 'Cream Knit Jumper', price: 40.00, salePrice: null, desc: 'Soft cream knit jumper, perfect for layering.' },
    { name: 'Floral Wrap Blouse', price: 30.00, salePrice: 22.00, desc: 'Pretty floral wrap blouse in pastel tones.' },

    // ── Men's Clothing ────────────────────────────────────────────────────────
    { name: 'Blue Denim Jeans', price: 45.00, salePrice: 35.00, desc: 'Classic straight-fit blue denim jeans.' },
    { name: 'Grey Casual Tee', price: 15.00, salePrice: null, desc: 'Comfortable everyday grey t-shirt.' },
    { name: 'Beige Chinos', price: 40.00, salePrice: 30.00, desc: 'Smart casual beige chinos for work or weekend.' },
    { name: 'Black Leather Jacket', price: 120.00, salePrice: 95.00, desc: 'Premium quality black leather biker jacket.' },
    { name: 'White Oxford Shirt', price: 35.00, salePrice: null, desc: 'Crisp white Oxford shirt for formal occasions.' },
    { name: 'Olive Green Cargo Pants', price: 42.00, salePrice: 32.00, desc: 'Practical olive cargo pants with multiple pockets.' },
    { name: 'Navy Slim Fit Suit', price: 150.00, salePrice: 120.00, desc: 'Sharp navy slim fit suit for formal events.' },
    { name: 'Grey Marl Sweatshirt', price: 28.00, salePrice: null, desc: 'Relaxed grey marl sweatshirt for casual days.' },
    { name: 'Black Skinny Jeans', price: 38.00, salePrice: 28.00, desc: 'Versatile black skinny jeans for any occasion.' },
    { name: 'Burgundy Polo Shirt', price: 25.00, salePrice: null, desc: 'Classic burgundy polo shirt in pique cotton.' },

    // ── Footwear ──────────────────────────────────────────────────────────────
    { name: 'White Leather Trainers', price: 55.00, salePrice: null, desc: 'Clean white leather trainers for everyday wear.' },
    { name: 'Brown Ankle Boots', price: 75.00, salePrice: 60.00, desc: 'Stylish brown leather ankle boots.' },
    { name: 'Black Chelsea Boots', price: 80.00, salePrice: 65.00, desc: 'Classic black Chelsea boots in premium leather.' },
    { name: 'Grey Running Trainers', price: 65.00, salePrice: null, desc: 'Lightweight grey running trainers with cushioned sole.' },
    { name: 'Tan Loafers', price: 58.00, salePrice: 45.00, desc: 'Smart tan leather loafers for smart casual looks.' },
    { name: 'Navy Canvas Pumps', price: 28.00, salePrice: null, desc: 'Casual navy canvas pumps for summer.' },
    { name: 'Black Heeled Sandals', price: 48.00, salePrice: 36.00, desc: 'Elegant black heeled sandals for evenings.' },
    { name: 'White Slip-On Trainers', price: 42.00, salePrice: null, desc: 'Easy slip-on white trainers for casual days.' },
    { name: 'Camel Knee High Boots', price: 95.00, salePrice: 75.00, desc: 'Luxurious camel knee-high boots in suede.' },
    { name: 'Pink Ballet Flats', price: 32.00, salePrice: null, desc: 'Comfortable pink ballet flats for everyday wear.' },

    // ── Kids ──────────────────────────────────────────────────────────────────
    { name: 'Kids Blue Denim Jacket', price: 28.00, salePrice: 20.00, desc: 'Durable blue denim jacket for kids.' },
    { name: 'Girls Pink Party Dress', price: 22.00, salePrice: null, desc: 'Pretty pink party dress with tulle skirt.' },
    { name: 'Boys Grey School Trousers', price: 15.00, salePrice: null, desc: 'Smart grey school trousers, easy care fabric.' },
    { name: 'Kids Rainbow Hoodie', price: 18.00, salePrice: 14.00, desc: 'Fun rainbow print hoodie for kids.' },
    { name: 'Girls Floral Leggings', price: 12.00, salePrice: null, desc: 'Soft floral print leggings for girls.' },
    { name: 'Boys Navy Polo Shirt', price: 10.00, salePrice: null, desc: 'Classic navy polo shirt for school or play.' },
    { name: 'Kids White Trainers', price: 25.00, salePrice: 18.00, desc: 'Durable white trainers for active kids.' },
    { name: 'Girls Denim Shorts', price: 14.00, salePrice: null, desc: 'Casual denim shorts for summer.' },
    { name: 'Boys Striped T-Shirt', price: 10.00, salePrice: null, desc: 'Fun striped t-shirt for boys.' },
    { name: 'Kids Waterproof Jacket', price: 35.00, salePrice: 25.00, desc: 'Waterproof jacket to keep kids dry.' },

    // ── Home ──────────────────────────────────────────────────────────────────
    { name: 'Grey Linen Cushion', price: 18.00, salePrice: null, desc: 'Soft grey linen cushion cover with insert.' },
    { name: 'White Fluffy Throw', price: 35.00, salePrice: 25.00, desc: 'Luxuriously soft white faux fur throw.' },
    { name: 'Scented Candle Set', price: 22.00, salePrice: null, desc: 'Set of 3 scented candles in vanilla, rose and cedar.' },
    { name: 'Marble Effect Vase', price: 28.00, salePrice: 20.00, desc: 'Elegant marble effect ceramic vase.' },
    { name: 'Woven Storage Basket', price: 24.00, salePrice: null, desc: 'Natural woven storage basket for any room.' },
    { name: 'Copper Table Lamp', price: 55.00, salePrice: 42.00, desc: 'Stylish copper table lamp with linen shade.' },
    { name: 'Geometric Wall Art', price: 30.00, salePrice: null, desc: 'Modern geometric wall art print, framed.' },
    { name: 'Velvet Cushion Cover', price: 15.00, salePrice: null, desc: 'Luxurious velvet cushion cover in teal.' },
    { name: 'Bamboo Serving Board', price: 20.00, salePrice: 15.00, desc: 'Eco-friendly bamboo serving and chopping board.' },
    { name: 'Ceramic Mug Set', price: 18.00, salePrice: null, desc: 'Set of 4 handmade ceramic mugs.' },

    // ── Beauty ────────────────────────────────────────────────────────────────
    { name: 'Rose Face Serum', price: 28.00, salePrice: null, desc: 'Hydrating rose extract face serum for all skin types.' },
    { name: 'Vitamin C Moisturiser', price: 22.00, salePrice: 16.00, desc: 'Brightening vitamin C daily moisturiser.' },
    { name: 'Lavender Body Lotion', price: 15.00, salePrice: null, desc: 'Soothing lavender body lotion for soft skin.' },
    { name: 'Charcoal Face Mask', price: 12.00, salePrice: null, desc: 'Deep cleansing charcoal face mask.' },
    { name: 'Argan Oil Hair Serum', price: 18.00, salePrice: 14.00, desc: 'Nourishing argan oil serum for shiny hair.' },
    { name: 'Micellar Cleansing Water', price: 10.00, salePrice: null, desc: 'Gentle micellar water for makeup removal.' },
    { name: 'SPF 50 Sunscreen', price: 16.00, salePrice: null, desc: 'Lightweight SPF 50 sunscreen for daily use.' },
    { name: 'Retinol Night Cream', price: 32.00, salePrice: 24.00, desc: 'Anti-ageing retinol night cream.' },
    { name: 'Hyaluronic Acid Toner', price: 20.00, salePrice: null, desc: 'Hydrating hyaluronic acid toner for plump skin.' },
    { name: 'Coconut Body Scrub', price: 14.00, salePrice: null, desc: 'Exfoliating coconut body scrub for smooth skin.' },

    // ── Sports ────────────────────────────────────────────────────────────────
    { name: 'Black Yoga Leggings', price: 30.00, salePrice: null, desc: 'High-waist black yoga leggings with pocket.' },
    { name: 'Blue Sports Bra', price: 22.00, salePrice: 16.00, desc: 'Medium support blue sports bra.' },
    { name: 'Grey Running Shorts', price: 18.00, salePrice: null, desc: 'Lightweight grey running shorts with liner.' },
    { name: 'Green Sports Tee', price: 20.00, salePrice: null, desc: 'Moisture-wicking green sports t-shirt.' },
    { name: 'Black Gym Bag', price: 35.00, salePrice: 25.00, desc: 'Spacious black gym bag with shoe compartment.' },
    { name: 'Pink Water Bottle', price: 15.00, salePrice: null, desc: 'Insulated pink water bottle, 750ml.' },
    { name: 'Navy Tracksuit Set', price: 55.00, salePrice: 42.00, desc: 'Matching navy tracksuit top and bottoms.' },
    { name: 'White Tennis Skirt', price: 25.00, salePrice: null, desc: 'Classic white pleated tennis skirt.' },
    { name: 'Orange Running Jacket', price: 48.00, salePrice: 36.00, desc: 'Lightweight orange running jacket, wind resistant.' },
    { name: 'Black Cycling Shorts', price: 28.00, salePrice: null, desc: 'Padded black cycling shorts for comfort.' },

    // ── Accessories ───────────────────────────────────────────────────────────
    { name: 'Brown Leather Belt', price: 22.00, salePrice: null, desc: 'Classic brown leather belt with silver buckle.' },
    { name: 'Navy Wool Scarf', price: 18.00, salePrice: 14.00, desc: 'Warm navy wool scarf for winter.' },
    { name: 'Black Leather Handbag', price: 65.00, salePrice: 50.00, desc: 'Structured black leather handbag with gold hardware.' },
    { name: 'Gold Hoop Earrings', price: 12.00, salePrice: null, desc: 'Classic gold hoop earrings in various sizes.' },
    { name: 'Tortoiseshell Sunglasses', price: 28.00, salePrice: null, desc: 'Stylish tortoiseshell frame sunglasses.' },
    { name: 'Grey Knit Beanie', price: 14.00, salePrice: null, desc: 'Cosy grey knit beanie hat.' },
    { name: 'Tan Crossbody Bag', price: 45.00, salePrice: 35.00, desc: 'Compact tan crossbody bag with adjustable strap.' },
    { name: 'Silver Watch', price: 85.00, salePrice: 65.00, desc: 'Elegant silver watch with leather strap.' },
    { name: 'Floral Silk Scarf', price: 25.00, salePrice: null, desc: 'Luxurious floral print silk scarf.' },
    { name: 'Black Leather Gloves', price: 30.00, salePrice: 22.00, desc: 'Warm black leather gloves with cashmere lining.' },

    // ── Baby ──────────────────────────────────────────────────────────────────
    { name: 'White Baby Grow Set', price: 18.00, salePrice: null, desc: 'Set of 3 white cotton baby grows.' },
    { name: 'Pink Knit Baby Cardigan', price: 15.00, salePrice: null, desc: 'Soft pink knit cardigan for newborns.' },
    { name: 'Blue Baby Sleepsuit', price: 12.00, salePrice: null, desc: 'Cosy blue sleepsuit for babies 0-3 months.' },
    { name: 'Cream Baby Blanket', price: 20.00, salePrice: 15.00, desc: 'Soft cream cellular baby blanket.' },
    { name: 'Baby Changing Bag', price: 45.00, salePrice: 35.00, desc: 'Spacious baby changing bag with mat.' },
    { name: 'Wooden Baby Rattle', price: 10.00, salePrice: null, desc: 'Natural wooden baby rattle, safe for newborns.' },
    { name: 'Baby Sun Hat', price: 8.00, salePrice: null, desc: 'UPF 50+ baby sun hat in white.' },
    { name: 'Muslin Swaddle Blankets', price: 22.00, salePrice: null, desc: 'Set of 3 organic muslin swaddle blankets.' },
    { name: 'Baby Booties Set', price: 12.00, salePrice: null, desc: 'Set of 2 pairs of soft baby booties.' },
    { name: 'Newborn Gift Set', price: 35.00, salePrice: 28.00, desc: 'Complete newborn gift set with essentials.' },

    // ── Furniture ─────────────────────────────────────────────────────────────
    { name: 'Oak Picture Shelf', price: 18.00, salePrice: null, desc: 'Solid oak picture shelf for displaying photos.' },
    { name: 'Grey Velvet Armchair', price: 280.00, salePrice: 220.00, desc: 'Luxurious grey velvet armchair with wooden legs.' },
    { name: 'White Bedside Table', price: 85.00, salePrice: null, desc: 'Minimalist white bedside table with drawer.' },
    { name: 'Natural Wood Coffee Table', price: 150.00, salePrice: 120.00, desc: 'Solid natural wood coffee table with shelf.' },
    { name: 'Black Metal Bookshelf', price: 95.00, salePrice: null, desc: 'Industrial black metal and wood bookshelf.' },
    { name: 'Cream Linen Sofa', price: 650.00, salePrice: 520.00, desc: 'Comfortable 3-seater cream linen sofa.' },
    { name: 'Rattan Dining Chair', price: 120.00, salePrice: 95.00, desc: 'Natural rattan dining chair with cushion.' },
    { name: 'Marble Dining Table', price: 450.00, salePrice: null, desc: 'Elegant marble top dining table for 6.' },
    { name: 'Walnut TV Unit', price: 220.00, salePrice: 175.00, desc: 'Sleek walnut TV unit with cable management.' },
    { name: 'Velvet Footstool', price: 75.00, salePrice: 58.00, desc: 'Plush velvet footstool in dusty pink.' },
];

async function seed() {
    console.log('🌱 Starting product seed...');

    // Check if products already exist
    const [existing] = await db.execute('SELECT COUNT(*) AS cnt FROM products');
    if (existing[0].cnt >= 100) {
        console.log(`✅ Already have ${existing[0].cnt} products — skipping seed.`);
        process.exit(0);
    }

    // Get first available categoryId and brandId
    const [cats] = await db.execute('SELECT id FROM categories LIMIT 10');
    const [brands] = await db.execute('SELECT id FROM brands LIMIT 10');

    const catIds = cats.map(c => c.id);
    const brandIds = brands.map(b => b.id);

    if (catIds.length === 0) {
        console.warn('⚠️  No categories found — products will have categoryId = NULL');
    }
    if (brandIds.length === 0) {
        console.warn('⚠️  No brands found — products will have brandId = NULL');
    }

    let inserted = 0;

    for (let i = 0; i < products.length; i++) {
        const p = products[i];
        const img = images[i % images.length];
        const img2 = images[(i + 1) % images.length];
        const img3 = images[(i + 2) % images.length];

        const slug = p.name.toLowerCase()
            .replace(/[^a-z0-9\s-]/g, '')
            .replace(/\s+/g, '-')
            .replace(/-+/g, '-')
            .trim() + '-' + (i + 1);

        const catId = catIds.length > 0 ? catIds[i % catIds.length] : null;
        const brandId = brandIds.length > 0 ? brandIds[i % brandIds.length] : null;
        const imagesJson = JSON.stringify([img, img2, img3]);

        try {
            await db.execute(
                `INSERT INTO products (name, slug, description, price, salePrice, categoryId, brandId, images, isActive, sortOrder, created_at, updated_at)
                 VALUES (?, ?, ?, ?, ?, ?, ?, ?, 1, ?, NOW(), NOW())`,
                [p.name, slug, p.desc, p.price, p.salePrice, catId, brandId, imagesJson, i]
            );
            inserted++;
            console.log(`   ✅ [${inserted}/${products.length}] ${p.name}`);
        } catch (err) {
            if (err.code === 'ER_DUP_ENTRY') {
                console.log(`   ⏭️  Skipped (duplicate): ${p.name}`);
            } else {
                console.error(`   ❌ Failed: ${p.name} —`, err.message);
            }
        }
    }

    console.log(`\n🌱 Seed complete! ${inserted} products inserted.`);
    process.exit(0);
}

seed().catch(err => {
    console.error('❌ Seed failed:', err);
    process.exit(1);
});
