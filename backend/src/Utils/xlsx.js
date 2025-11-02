const Xlsx = require('xlsx');
const fs = require('fs');
const Product = require('../Models/Product.model');
const Category = require('../Models/Category.model');

const MISSING = v => v === null || v === undefined || String(v).trim() === '' || ['-', 'n/a', 'null', 'undefined'].includes(String(v).trim().toLowerCase());
const parseList = v => (Array.isArray(v) ? v : String(v || '').split(/\||,/).map(s => s.trim()).filter(Boolean));
const slugify = s => String(s || '').trim().toLowerCase().replace(/[^a-z0-9-]+/g, '-');

async function XlsxTojson(req, res) {
    try {
        const { excel } = req.files || {};

        if (!excel || !excel.tempFilePath || !fs.existsSync(excel.tempFilePath)) {
            return res.status(400).json({ message: 'No file uploaded' });
        }

        const wb = Xlsx.readFile(excel.tempFilePath);
        try { fs.unlinkSync(excel.tempFilePath) } catch (e) { }

        const raw = Xlsx.utils.sheet_to_json(wb.Sheets[wb.SheetNames[0]], { defval: '' });
        const rows = raw.map(r => Object.fromEntries(Object.keys(r).map(k => [String(k).trim().toLowerCase(), r[k]])));

        const allCategories = await Category.find({}).lean();
        const categoryMap = new Map();
        allCategories.forEach(cat => {
            categoryMap.set(cat.slug.toLowerCase(), cat);
            categoryMap.set(cat.name.toLowerCase(), cat);
        });

        const allSkus = new Set((await Product.find({}, 'sku').lean()).map(p => p.sku));

        // ✅ FIX: पहले सभी unique categories को collect करो और batch create करो
        const uniqueCategoriesNeeded = new Set();
        rows.forEach(row => {
            const categoryRaw = row['category'] ?? row['category '] ?? row['Category'] ?? null;
            if (!MISSING(categoryRaw)) {
                const catSlug = slugify(categoryRaw);
                const catNameLower = String(categoryRaw).trim().toLowerCase();
                if (!categoryMap.has(catSlug) && !categoryMap.has(catNameLower)) {
                    uniqueCategoriesNeeded.add(JSON.stringify({ name: String(categoryRaw).trim(), slug: catSlug }));
                }
            }
        });

        // ✅ Missing categories को batch में create करो (duplicates avoid होंगे)
        if (uniqueCategoriesNeeded.size > 0) {
            const categoriesToCreate = Array.from(uniqueCategoriesNeeded).map(c => JSON.parse(c));
            try {
                const createdCategories = await Category.insertMany(categoriesToCreate, { ordered: false });
                createdCategories.forEach(cat => {
                    categoryMap.set(cat.slug.toLowerCase(), cat);
                    categoryMap.set(cat.name.toLowerCase(), cat);
                });
            } catch (bulkErr) {
                // Duplicate key errors को ignore करो (already exists)
                if (bulkErr.writeErrors) {
                    bulkErr.insertedDocs?.forEach(cat => {
                        if (cat) {
                            categoryMap.set(cat.slug.toLowerCase(), cat);
                            categoryMap.set(cat.name.toLowerCase(), cat);
                        }
                    });
                }
            }
        }

        const successData = [], errorData = [];

        const BATCH_SIZE = 10;

        for (let i = 0; i < rows.length; i += BATCH_SIZE) {
            const batch = rows.slice(i, i + BATCH_SIZE);

            const batchPromises = batch.map(async (row, batchIdx) => {
                const rowNum = i + batchIdx + 2;

                try {
                    // Validation
                    const name = row['name'] ?? row['name '] ?? row['Name'] ?? null;
                    const priceRaw = row['price'] ?? row['Price'] ?? null;
                    const categoryRaw = row['category'] ?? row['category '] ?? row['Category'] ?? null;
                    const sku = row['sku'] ?? row['Sku'] ?? row['sku '] ?? null;
                    const images = parseList(row['images'] ?? row['image'] ?? row['Images'] ?? '');

                    const missing = [];
                    if (MISSING(name)) missing.push('name');
                    const price = Number(String(priceRaw).replace(/[^0-9.-]+/g, ''));
                    if (isNaN(price)) missing.push('price');
                    if (MISSING(categoryRaw)) missing.push('category');
                    if (MISSING(sku)) missing.push('sku');
                    if (!images.length) missing.push('image');

                    if (missing.length) {
                        return { success: false, row: rowNum, errors: missing, data: row };
                    }

                    // ✅ Category lookup from Map (ab duplicates nahi honge!)
                    const catSlug = slugify(categoryRaw);
                    const catNameLower = String(categoryRaw).trim().toLowerCase();
                    let cat = categoryMap.get(catSlug) || categoryMap.get(catNameLower);

                    if (!cat) {
                        return { success: false, row: rowNum, errors: ['category_not_found'], data: row };
                    }

                    // ✅ SKU check from Set (super fast - no DB query!)
                    if (allSkus.has(String(sku).trim())) {
                        return { success: false, row: rowNum, errors: ['sku_exists'], data: row };
                    }

                    const prepared = {
                        name: String(name).trim(),
                        slug: slugify(name),
                        price,
                        category: cat._id,
                        sku: String(sku).trim(),
                        image: String(images[0]).trim(),
                        description: MISSING(row['description']) ? null : String(row['description']).trim(),
                        originalPrice: MISSING(row['original price'] || row['originalprice']) ? null : Number(String(row['original price'] || row['originalprice']).replace(/[^0-9.-]+/g, '')),
                        collection: MISSING(row['collection']) ? null : String(row['collection']).trim(),
                        material: MISSING(row['material']) ? null : String(row['material']).trim(),
                        weight: MISSING(row['weight']) ? null : String(row['weight']).trim(),
                        dimensions: MISSING(row['dimensions']) ? null : String(row['dimensions']).trim(),
                        inStock: MISSING(row['in stock'] || row['instock']) ? null : !String(row['in stock'] || row['instock']).toLowerCase().includes('false'),
                        stockQuantity: MISSING(row['stock quantity'] || row['stockquantity']) ? null : Number(row['stock quantity'] || row['stockquantity']),
                        features: MISSING(row['features']) ? null : parseList(row['features']),
                        relatedImage: MISSING(row['relatedimages']) ? null : parseList(row['relatedimages']),
                        certifications: MISSING(row['certifications']) ? null : parseList(row['certifications']),
                        tags: MISSING(row['tags']) ? null : parseList(row['tags']),
                        metaTitle: MISSING(row['meta title']) ? null : String(row['meta title']).trim(),
                        metaDescription: MISSING(row['meta description']) ? null : String(row['meta description']).trim(),
                        featured: MISSING(row['featured']) ? null : Boolean(row['featured'])
                    };

                    const created = await Product.create(prepared);
                    allSkus.add(prepared.sku); // SKU set में add करो ताकि duplicate न हो

                    return { success: true, row: rowNum, data: created };

                } catch (e) {
                    return { success: false, row: rowNum, errors: ['db_error', e.message || String(e)], data: row };
                }
            });

            const batchResults = await Promise.all(batchPromises);

            batchResults.forEach(result => {
                if (result.success) {
                    successData.push({ row: result.row, data: result.data });
                } else {
                    errorData.push({ row: result.row, errors: result.errors, data: result.data });
                }
            });
        }

        return res.status(200).json({
            message: 'Import completed',
            summary: {
                total: rows.length,
                success: successData.length,
                failed: errorData.length
            },
            successData,
            errorData
        });

    } catch (e) {
        console.error(e);
        return res.status(500).json({ message: 'Import failed', error: e.message });
    }
}

module.exports = { XlsxTojson };