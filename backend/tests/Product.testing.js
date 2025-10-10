const request = require('supertest');
const app = require('../src/index');
const Product = require('../src/Models/Product.model');
const Category = require('../src/Models/Category.model');
const User = require('../src/Models/User.model');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');

// Mock ImageKit to prevent real API calls during testing
jest.mock('imagekit', () => {
    return jest.fn().mockImplementation(() => ({
        upload: jest.fn().mockResolvedValue({
            url: 'https://mock-imagekit-url.com/test-product.jpg',
            fileId: 'mock-product-file-id-123'
        }),
        deleteFile: jest.fn().mockResolvedValue({ success: true }),
        listFiles: jest.fn().mockResolvedValue([
            {
                fileId: 'mock-product-file-id-123',
                url: 'https://mock-imagekit-url.com/test-product.jpg',
                filePath: '/product/test-product.jpg'
            }
        ])
    }));
});

// Mock Redis before any tests run
jest.mock('../Db/Redis', () => ({
    set: jest.fn().mockResolvedValue('OK'),
    get: jest.fn().mockResolvedValue(null),
    del: jest.fn().mockResolvedValue(1),
    on: jest.fn(),
}));

describe('Product API Tests', () => {
    let adminToken;
    let userToken;
    let adminUser;
    let regularUser;
    let testCategory;

    // Helper function to create a user and get token
    const createUserAndGetToken = async (userData, role = 'user') => {
        const hashedPassword = await bcrypt.hash(userData.password, 10);
        const user = await User.create({
            ...userData,
            password: hashedPassword,
            role: role
        });

        const token = jwt.sign({
            id: user._id,
            role: user.role,
            email: user.email,
        }, process.env.JWT_SECRET, { expiresIn: "1d" });

        return { user, token };
    };

    // Set up test users and category before all tests
    beforeAll(async () => {
        // Create admin user
        const adminData = {
            name: 'Admin User',
            email: 'admin@test.com',
            password: 'AdminPass@123',
            phone: 9876543210,
            gender: 'male',
        };
        const adminResult = await createUserAndGetToken(adminData, 'admin');
        adminUser = adminResult.user;
        adminToken = adminResult.token;

        // Create regular user
        const userData = {
            name: 'Regular User',
            email: 'user@test.com',
            password: 'UserPass@123',
            phone: 1234567890,
            gender: 'female',
        };
        const userResult = await createUserAndGetToken(userData, 'user');
        regularUser = userResult.user;
        userToken = userResult.token;

        // Create test category
        testCategory = await Category.create({
            name: 'Test Category',
            slug: 'test-category'
        });

        // Set environment variables for ImageKit (mocked)
        process.env.IMAGEKIT_PUBLIC_KEY = 'test_public_key';
        process.env.IMAGEKIT_PRIVATE_KEY = 'test_private_key';
        process.env.IMAGEKIT_URL_ENGPOINT = 'https://mock-imagekit-url.com';
    });

    describe('POST /products/create', () => {
        const endpoint = '/products/create';
        const validProductData = {
            name: 'Test Product',
            slug: 'test-product',
            price: 999,
            category: null, // Will be set in tests
            productCategory: 'Electronics',
            discount_price: 899,
            status: true,
            stock: true,
            sale: false
        };

        beforeEach(() => {
            validProductData.category = testCategory._id.toString();
        });

        it('should create product successfully with admin auth and valid data', async () => {
            const res = await request(app)
                .post(endpoint)
                .set('cookie', `token=${adminToken}`)
                .send(validProductData);

            expect(res.statusCode).toBe(201);
            expect(res.body).toHaveProperty('message', 'Product created successfully');
            expect(res.body).toHaveProperty('data');
            expect(res.body.data).toHaveProperty('name', validProductData.name);
            expect(res.body.data).toHaveProperty('slug', validProductData.slug);
            expect(res.body.data).toHaveProperty('price', validProductData.price);
        });

        it('should create product with image upload', async () => {
            const productWithImage = {
                ...validProductData,
                name: 'Product with Image',
                slug: 'product-with-image'
            };

            const res = await request(app)
                .post(endpoint)
                .set('cookie', `token=${adminToken}`)
                .field('name', productWithImage.name)
                .field('slug', productWithImage.slug)
                .field('price', productWithImage.price.toString())
                .field('category', productWithImage.category)
                .field('productCategory', productWithImage.productCategory)
                .attach('image', Buffer.from('fake product image data'), 'test-product.jpg');

            expect(res.statusCode).toBe(201);
            expect(res.body).toHaveProperty('message', 'Product created successfully');
            expect(res.body.data).toHaveProperty('image');
            expect(res.body.data.image).toBe('https://mock-imagekit-url.com/test-product.jpg');
        });

        it('should return 400 when required fields are missing', async () => {
            const res = await request(app)
                .post(endpoint)
                .set('cookie', `token=${adminToken}`)
                .send({});

            expect(res.statusCode).toBe(400);
            expect(res.body).toHaveProperty('message');
        });

        it('should return 409 when product with same slug already exists', async () => {
            // Create first product
            await request(app)
                .post(endpoint)
                .set('cookie', `token=${adminToken}`)
                .send(validProductData);

            // Try to create another product with same slug
            const duplicateProduct = {
                ...validProductData,
                name: 'Different Name'
            };

            const res = await request(app)
                .post(endpoint)
                .set('cookie', `token=${adminToken}`)
                .send(duplicateProduct);

            expect(res.statusCode).toBe(409);
            expect(res.body).toHaveProperty('message', 'Product with this slug already exists');
        });

        it('should return 401 when no authentication token is provided', async () => {
            const res = await request(app)
                .post(endpoint)
                .send(validProductData);

            expect(res.statusCode).toBe(401);
            expect(res.body).toHaveProperty('message', 'Unauthorized');
        });

        it('should return 403 when non-admin user tries to create product', async () => {
            const res = await request(app)
                .post(endpoint)
                .set('cookie', `token=${userToken}`)
                .send(validProductData);

            expect(res.statusCode).toBe(403);
            expect(res.body).toHaveProperty('message', 'Access denied. Admin role required.');
        });
    });

    describe('GET /products/get', () => {
        const endpoint = '/products/get';
        let testProduct;

        beforeEach(async () => {
            // Create a test product
            testProduct = await Product.create({
                name: 'Test Product',
                slug: 'test-product-get',
                price: 1299,
                category: testCategory._id,
                productCategory: 'Electronics',
                discount_price: 1199,
                status: true,
                stock: true,
                sale: false
            });
        });

        it('should get all products successfully', async () => {
            const res = await request(app).get(endpoint);

            expect(res.statusCode).toBe(200);
            expect(res.body).toHaveProperty('message', 'Products fetched successfully');
            expect(res.body).toHaveProperty('data');
            expect(Array.isArray(res.body.data)).toBe(true);
            expect(res.body.data.length).toBeGreaterThan(0);
        });

        it('should get specific product by ID', async () => {
            const res = await request(app)
                .get(endpoint)
                .query({ id: testProduct._id.toString() });

            expect(res.statusCode).toBe(200);
            expect(res.body).toHaveProperty('message', 'Product fetched successfully');
            expect(res.body).toHaveProperty('data');
            expect(res.body.data).toHaveProperty('name', testProduct.name);
            expect(res.body.data).toHaveProperty('slug', testProduct.slug);
        });

        it('should get product by slug', async () => {
            const res = await request(app)
                .get(endpoint)
                .query({ slug: testProduct.slug });

            expect(res.statusCode).toBe(200);
            expect(res.body).toHaveProperty('message', 'Product fetched successfully');
            expect(res.body.data).toHaveProperty('slug', testProduct.slug);
        });

        it('should get products by category', async () => {
            const res = await request(app)
                .get(endpoint)
                .query({ category: testCategory._id.toString() });

            expect(res.statusCode).toBe(200);
            expect(res.body).toHaveProperty('message', 'Products fetched successfully');
            expect(Array.isArray(res.body.data)).toBe(true);
        });

        it('should return 404 when product with given ID is not found', async () => {
            const nonExistentId = '507f1f77bcf86cd799439011';
            const res = await request(app)
                .get(endpoint)
                .query({ id: nonExistentId });

            expect(res.statusCode).toBe(404);
            expect(res.body).toHaveProperty('message', 'Product not found');
        });

        it('should handle invalid ObjectId gracefully', async () => {
            const res = await request(app)
                .get(endpoint)
                .query({ id: 'invalid-id' });

            expect(res.statusCode).toBe(500);
            expect(res.body).toHaveProperty('message', 'Internal server error');
        });
    });

    describe('PUT /products/update/:id', () => {
        let testProduct;

        beforeEach(async () => {
            testProduct = await Product.create({
                name: 'Original Product',
                slug: 'original-product',
                price: 1500,
                category: testCategory._id,
                productCategory: 'Electronics',
                status: true,
                stock: true
            });
        });

        it('should update product successfully with admin auth', async () => {
            const updateData = {
                name: 'Updated Product',
                slug: 'updated-product',
                price: 1800,
                discount_price: 1600
            };

            const res = await request(app)
                .put(`/products/update/${testProduct._id}`)
                .set('cookie', `token=${adminToken}`)
                .send(updateData);

            expect(res.statusCode).toBe(200);
            expect(res.body).toHaveProperty('message', 'Product updated successfully');
            expect(res.body.data).toHaveProperty('name', updateData.name);
            expect(res.body.data).toHaveProperty('slug', updateData.slug);
            expect(res.body.data).toHaveProperty('price', updateData.price);
        });

        it('should update product with new image', async () => {
            const res = await request(app)
                .put(`/products/update/${testProduct._id}`)
                .set('cookie', `token=${adminToken}`)
                .field('name', 'Updated with Image')
                .attach('image', Buffer.from('new product image data'), 'new-product.jpg');

            expect(res.statusCode).toBe(200);
            expect(res.body).toHaveProperty('message', 'Product updated successfully');
            expect(res.body.data).toHaveProperty('image');
            expect(res.body.data.image).toBe('https://mock-imagekit-url.com/test-product.jpg');
        });

        it('should return 404 when product to update is not found', async () => {
            const nonExistentId = '507f1f77bcf86cd799439011';
            const res = await request(app)
                .put(`/products/update/${nonExistentId}`)
                .set('cookie', `token=${adminToken}`)
                .send({ name: 'Updated Name' });

            expect(res.statusCode).toBe(404);
            expect(res.body).toHaveProperty('message', 'Product not found');
        });

        it('should return 409 when trying to update to existing slug', async () => {
            // Create another product
            const anotherProduct = await Product.create({
                name: 'Another Product',
                slug: 'another-product',
                price: 999,
                category: testCategory._id
            });

            const res = await request(app)
                .put(`/products/update/${testProduct._id}`)
                .set('cookie', `token=${adminToken}`)
                .send({ slug: 'another-product' });

            expect(res.statusCode).toBe(409);
            expect(res.body).toHaveProperty('message', 'Product with this slug already exists');
        });

        it('should return 401 when no authentication token is provided', async () => {
            const res = await request(app)
                .put(`/products/update/${testProduct._id}`)
                .send({ name: 'Updated Name' });

            expect(res.statusCode).toBe(401);
            expect(res.body).toHaveProperty('message', 'Unauthorized');
        });

        it('should return 403 when non-admin user tries to update product', async () => {
            const res = await request(app)
                .put(`/products/update/${testProduct._id}`)
                .set('cookie', `token=${userToken}`)
                .send({ name: 'Updated Name' });

            expect(res.statusCode).toBe(403);
            expect(res.body).toHaveProperty('message', 'Access denied. Admin role required.');
        });
    });

    describe('PATCH /products/update-status', () => {
        const endpoint = '/products/update-status';
        let testProduct;

        beforeEach(async () => {
            testProduct = await Product.create({
                name: 'Status Test Product',
                slug: 'status-test-product',
                price: 999,
                category: testCategory._id,
                status: true
            });
        });

        it('should update product status successfully with admin auth', async () => {
            const res = await request(app)
                .patch(endpoint)
                .set('cookie', `token=${adminToken}`)
                .query({
                    id: testProduct._id.toString(),
                    new_status: 'false'
                });

            expect(res.statusCode).toBe(200);
            expect(res.body).toHaveProperty('message', 'Product status updated successfully');
            expect(res.body.data).toHaveProperty('status', false);
        });

        it('should update status from false to true', async () => {
            // First set status to false
            await Product.findByIdAndUpdate(testProduct._id, { status: false });

            const res = await request(app)
                .patch(endpoint)
                .set('cookie', `token=${adminToken}`)
                .query({
                    id: testProduct._id.toString(),
                    new_status: 'true'
                });

            expect(res.statusCode).toBe(200);
            expect(res.body).toHaveProperty('message', 'Product status updated successfully');
            expect(res.body.data).toHaveProperty('status', true);
        });

        it('should return 400 when required parameters are missing', async () => {
            const res = await request(app)
                .patch(endpoint)
                .set('cookie', `token=${adminToken}`)
                .query({});

            expect(res.statusCode).toBe(400);
            expect(res.body).toHaveProperty('message', 'ID and new_status are required');
        });

        it('should return 404 when product is not found', async () => {
            const nonExistentId = '507f1f77bcf86cd799439011';
            const res = await request(app)
                .patch(endpoint)
                .set('cookie', `token=${adminToken}`)
                .query({
                    id: nonExistentId,
                    new_status: 'false'
                });

            expect(res.statusCode).toBe(404);
            expect(res.body).toHaveProperty('message', 'Product not found');
        });

        it('should return 401 when no authentication token is provided', async () => {
            const res = await request(app)
                .patch(endpoint)
                .query({
                    id: testProduct._id.toString(),
                    new_status: 'false'
                });

            expect(res.statusCode).toBe(401);
            expect(res.body).toHaveProperty('message', 'Unauthorized');
        });

        it('should return 403 when non-admin user tries to update status', async () => {
            const res = await request(app)
                .patch(endpoint)
                .set('cookie', `token=${userToken}`)
                .query({
                    id: testProduct._id.toString(),
                    new_status: 'false'
                });

            expect(res.statusCode).toBe(403);
            expect(res.body).toHaveProperty('message', 'Access denied. Admin role required.');
        });
    });

    describe('DELETE /products/delete', () => {
        const endpoint = '/products/delete';
        let testProduct;

        beforeEach(async () => {
            testProduct = await Product.create({
                name: 'Delete Test Product',
                slug: 'delete-test-product',
                price: 999,
                category: testCategory._id,
                image: 'https://mock-imagekit-url.com/test-product.jpg'
            });
        });

        it('should delete product successfully with admin auth', async () => {
            const res = await request(app)
                .delete(endpoint)
                .set('cookie', `token=${adminToken}`)
                .query({ id: testProduct._id.toString() });

            expect(res.statusCode).toBe(200);
            expect(res.body).toHaveProperty('message', 'Product deleted successfully');

            // Verify product is actually deleted
            const deletedProduct = await Product.findById(testProduct._id);
            expect(deletedProduct).toBeNull();
        });

        it('should return 400 when product ID is not provided', async () => {
            const res = await request(app)
                .delete(endpoint)
                .set('cookie', `token=${adminToken}`)
                .query({});

            expect(res.statusCode).toBe(400);
            expect(res.body).toHaveProperty('message', 'Product ID is required');
        });

        it('should return 404 when product to delete is not found', async () => {
            const nonExistentId = '507f1f77bcf86cd799439011';
            const res = await request(app)
                .delete(endpoint)
                .set('cookie', `token=${adminToken}`)
                .query({ id: nonExistentId });

            expect(res.statusCode).toBe(404);
            expect(res.body).toHaveProperty('message', 'Product not found');
        });

        it('should return 401 when no authentication token is provided', async () => {
            const res = await request(app)
                .delete(endpoint)
                .query({ id: testProduct._id.toString() });

            expect(res.statusCode).toBe(401);
            expect(res.body).toHaveProperty('message', 'Unauthorized');
        });

        it('should return 403 when non-admin user tries to delete product', async () => {
            const res = await request(app)
                .delete(endpoint)
                .set('cookie', `token=${userToken}`)
                .query({ id: testProduct._id.toString() });

            expect(res.statusCode).toBe(403);
            expect(res.body).toHaveProperty('message', 'Access denied. Admin role required.');
        });

        it('should handle invalid ObjectId gracefully', async () => {
            const res = await request(app)
                .delete(endpoint)
                .set('cookie', `token=${adminToken}`)
                .query({ id: 'invalid-id' });

            expect(res.statusCode).toBe(500);
            expect(res.body).toHaveProperty('message', 'Internal server error');
        });
    });

    describe('Product Model Validation Tests', () => {
        it('should create product with valid data', async () => {
            const validProductData = {
                name: 'Valid Product',
                slug: 'valid-product',
                price: 1999,
                category: testCategory._id,
                productCategory: 'Electronics',
                discount_price: 1799,
                status: true,
                stock: true,
                sale: false
            };

            const product = await Product.create(validProductData);
            expect(product).toHaveProperty('_id');
            expect(product.name).toBe(validProductData.name);
            expect(product.slug).toBe(validProductData.slug);
            expect(product.price).toBe(validProductData.price);
            expect(product.status).toBe(true);
            expect(product.stock).toBe(true);
        });

        it('should create product with default values when not provided', async () => {
            const productData = {
                name: 'Default Values Product',
                slug: 'default-values-product',
                price: 999,
                category: testCategory._id
            };

            const product = await Product.create(productData);
            expect(product.status).toBe(true); // Default value
            expect(product.stock).toBe(true); // Default value
            expect(product.sale).toBe(false); // Default value
        });

        it('should respect price minimum constraint', async () => {
            const productData = {
                name: 'Invalid Price Product',
                slug: 'invalid-price-product',
                price: 0, // Below minimum
                category: testCategory._id
            };

            try {
                await Product.create(productData);
                // If we reach here, the validation didn't work as expected
                expect(true).toBe(false);
            } catch (error) {
                expect(error.name).toBe('ValidationError');
            }
        });

        it('should respect maxLength constraints', async () => {
            const longName = 'a'.repeat(31); // Exceeds maxLength of 30
            const longSlug = 'b'.repeat(31); // Exceeds maxLength of 30

            const productData = {
                name: longName,
                slug: longSlug,
                price: 999,
                category: testCategory._id
            };

            try {
                await Product.create(productData);
                // If we reach here, the validation didn't work as expected
                expect(true).toBe(false);
            } catch (error) {
                expect(error.name).toBe('ValidationError');
            }
        });
    });

    describe('Integration Tests', () => {
        it('should handle complete product lifecycle (create -> read -> update -> delete)', async () => {
            // Create
            const createRes = await request(app)
                .post('/products/create')
                .set('cookie', `token=${adminToken}`)
                .send({
                    name: 'Lifecycle Test Product',
                    slug: 'lifecycle-test-product',
                    price: 2999,
                    category: testCategory._id.toString(),
                    productCategory: 'Electronics'
                });

            expect(createRes.statusCode).toBe(201);
            const productId = createRes.body.data._id;

            // Read
            const readRes = await request(app)
                .get('/products/get')
                .query({ id: productId });

            expect(readRes.statusCode).toBe(200);
            expect(readRes.body.data.name).toBe('Lifecycle Test Product');

            // Update
            const updateRes = await request(app)
                .put(`/products/update/${productId}`)
                .set('cookie', `token=${adminToken}`)
                .send({
                    name: 'Updated Lifecycle Test Product',
                    price: 3299
                });

            expect(updateRes.statusCode).toBe(200);
            expect(updateRes.body.data.name).toBe('Updated Lifecycle Test Product');

            // Update Status
            const statusRes = await request(app)
                .patch('/products/update-status')
                .set('cookie', `token=${adminToken}`)
                .query({
                    id: productId,
                    new_status: 'false'
                });

            expect(statusRes.statusCode).toBe(200);
            expect(statusRes.body.data.status).toBe(false);

            // Delete
            const deleteRes = await request(app)
                .delete('/products/delete')
                .set('cookie', `token=${adminToken}`)
                .query({ id: productId });

            expect(deleteRes.statusCode).toBe(200);

            // Verify deletion
            const verifyRes = await request(app)
                .get('/products/get')
                .query({ id: productId });

            expect(verifyRes.statusCode).toBe(404);
        });

        it('should handle multiple products creation and retrieval', async () => {
            const products = [
                { name: 'Product 1', slug: 'product-1', price: 999, category: testCategory._id.toString() },
                { name: 'Product 2', slug: 'product-2', price: 1299, category: testCategory._id.toString() },
                { name: 'Product 3', slug: 'product-3', price: 1599, category: testCategory._id.toString() }
            ];

            // Create multiple products
            for (const product of products) {
                const res = await request(app)
                    .post('/products/create')
                    .set('cookie', `token=${adminToken}`)
                    .send(product);
                expect(res.statusCode).toBe(201);
            }

            // Get all products
            const getAllRes = await request(app).get('/products/get');
            expect(getAllRes.statusCode).toBe(200);
            expect(getAllRes.body.data.length).toBeGreaterThanOrEqual(3);
        });

        it('should filter products by category', async () => {
            // Create another category
            const anotherCategory = await Category.create({
                name: 'Another Category',
                slug: 'another-category'
            });

            // Create products in different categories
            await Product.create({
                name: 'Product in Test Category',
                slug: 'product-test-cat',
                price: 999,
                category: testCategory._id
            });

            await Product.create({
                name: 'Product in Another Category',
                slug: 'product-another-cat',
                price: 1299,
                category: anotherCategory._id
            });

            // Get products by test category
            const res = await request(app)
                .get('/products/get')
                .query({ category: testCategory._id.toString() });

            expect(res.statusCode).toBe(200);
            expect(Array.isArray(res.body.data)).toBe(true);
            
            // All returned products should belong to the test category
            res.body.data.forEach(product => {
                expect(product.category.toString()).toBe(testCategory._id.toString());
            });
        });
    });
});
