const Xlsx = require('xlsx');
const fs = require('fs');
const Product = require('../Models/Product.model');
const Category = require('../Models/Category.model');
const e = require('express');

const MISSING = v => v === null || v === undefined || String(v).trim() === '' || ['-', 'n/a', 'null', 'undefined'].includes(String(v).trim().toLowerCase());
const parseList = v => (Array.isArray(v) ? v : String(v || '').split(/\||,/).map(s => s.trim()).filter(Boolean));
const slugify = s => String(s || '').trim().toLowerCase().replace(/[^a-z0-9-]+/g, '-');

async function XlsxTojson(req, res) {
    try {
        const { excel } = req.files || {};

        if (!excel || !excel.tempFilePath || !fs.existsSync(excel.tempFilePath)) return res.status(400).json({ message: 'No file' });
        const wb = Xlsx.readFile(excel.tempFilePath); try { fs.unlinkSync(excel.tempFilePath) } catch (e) { }

        const raw = Xlsx.utils.sheet_to_json(wb.Sheets[wb.SheetNames[0]], { defval: '' });

        // normalize headers
        const rows = raw.map(r => Object.fromEntries(Object.keys(r).map(k => [String(k).trim().toLowerCase(), r[k]])));

        const successData = [], errorData = [];

        for (let i = 0; i < rows.length; i++) {

            const rowNum = i + 2, row = rows[i];
            const name = row['name'] ?? row['name '] ?? row['Name'] ?? null;
            const priceRaw = row['price'] ?? row['Price'] ?? row['c'] ?? null;
            const categoryRaw = row['category'] ?? row['category '] ?? row['Category'] ?? null;

            const sku = row['sku'] ?? row['Sku'] ?? row['sku '] ?? null;
            const images = parseList(row['images'] ?? row['image'] ?? row['Images'] ?? '');

            const missing = [];
            if (MISSING(name)) missing.push('name');
            const price = Number(String(priceRaw).replace(/[^0-9.-]+/g, '')); if (isNaN(price)) missing.push('price');
            if (MISSING(categoryRaw)) missing.push('category');
            if (MISSING(sku)) missing.push('sku');
            if (!images.length) missing.push('image');
            if (missing.length) { errorData.push({ row: rowNum, errors: missing, data: row }); continue }

            // resolve category to ObjectId by slug or name (case-insensitive)
            const catSlug = slugify(categoryRaw);
            let cat = null;
            try {
                cat = await Category.findOne({ slug: catSlug });
                if (!cat) cat = await Category.findOne({ name: new RegExp('^' + String(categoryRaw).trim() + '$', 'i') });
                if (!cat) cat = await Category.findOne({ name: new RegExp(String(categoryRaw).trim(), 'i') }); // fuzzy
            } catch (lookupErr) {
                console.error('Category lookup error:', lookupErr);
            }

            if (!cat) {
                console.debug(`Category not found for raw='${categoryRaw}', slug='${catSlug}'. Creating new category.`);
                // auto-create category to avoid import failure
                try {
                    cat = await Category.create({ name: String(categoryRaw).trim(), slug: catSlug });
                } catch (createErr) {

                    console.error('Failed to create category for', categoryRaw, createErr);
                }
            }

            if (!cat) { errorData.push({ row: rowNum, errors: ['category_not_found'], data: row }); continue }

            const prepared = {
                name: String(name).trim(),
                slug: slugify(name),
                price,
                category: cat._id,
                sku: String(sku).trim(),
                image: String(images[0]).trim(),
                // optional fields -> null if missing
                description: MISSING(row['description']) ? null : String(row['description']).trim(),
                originalPrice: MISSING(row['original price'] || row['originalprice']) ? null : Number(String(row['original price'] || row['originalprice']).replace(/[^0-9.-]+/g, '')),
                collection: MISSING(row['collection']) ? null : String(row['collection']).trim(),
                material: MISSING(row['material']) ? null : String(row['material']).trim(),
                weight: MISSING(row['weight']) ? null : String(row['weight']).trim(),
                dimensions: MISSING(row['dimensions']) ? null : String(row['dimensions']).trim(),
                inStock: MISSING(row['in stock'] || row['instock']) ? null : (String(row['in stock'] || row['instock']).toLowerCase().includes('false') ? false : true),
                stockQuantity: MISSING(row['stock quantity'] || row['stockquantity']) ? null : Number(row['stock quantity'] || row['stockquantity']),
                features: MISSING(row['features']) ? null : parseList(row['features']),
                relatedImage: MISSING(row['relatedimages']) ? null : parseList(row['relatedimages']),
                certifications: MISSING(row['certifications']) ? null : parseList(row['certifications']),
                tags: MISSING(row['tags']) ? null : parseList(row['tags']),
                metaTitle: MISSING(row['meta title']) ? null : String(row['meta title']).trim(),
                metaDescription: MISSING(row['meta description']) ? null : String(row['meta description']).trim(),
                featured: MISSING(row['featured']) ? null : Boolean(row['featured'])
            };

            try {
                const exist = await Product.findOne({ sku: prepared.sku });
                if (exist) { errorData.push({ row: rowNum, errors: ['sku_exists'], data: prepared }); continue }
                const created = await Product.create(prepared);
                successData.push({ row: rowNum, data: created });
            } catch (e) { errorData.push({ row: rowNum, errors: ['db', e.message || String(e)], data: prepared }) }
        }

        return { successData, errorData };
    } catch (e) { console.error(e); return res.status(500).json({ message: 'Import failed', error: e.message }) }
}

module.exports = { XlsxTojson };
