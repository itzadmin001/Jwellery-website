const request = require('supertest');
const app = require('../src/index');
const Cart = require('../src/Models/Cart.mode');
const Product = require('../src/Models/Product.model');
const Category = require('../src/Models/Category.model');
const User = require('../src/Models/User.model');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');

// Mock Redis before any tests run
jest.mock('../Db/Redis', () => ({
    set: jest.fn().mockResolvedValue('OK'),
    get: jest.fn().mockResolvedValue(null),
    del: jest.fn().mockResolvedValue(1),
    on: jest.fn(),
}));

// Mock ImageKit to prevent real API calls during testing
jest.mock('imagekit', () => {
    return jest.fn().mockImplementation(() => ({
        upload: jest.fn().mockResolvedValue({
            url: 'https://mock-imagekit-url.com/test-image.jpg',
            fileId: 'mock-file-id-123'
        }),
        deleteFile: jest.fn().mockResolvedValue({ success: true }),
        listFiles: jest.fn().mockResolvedValue([])
    }));
});

describe('Cart API Tests', () => {
    let userToken;
    let adminToken;
    let testUser;
    let testProduct;
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

    // Set up test data before all tests
    beforeAll(async () => {
        // Create test user
        const userData = {
            name: 'Test User',
            email: 'testuser@test.com',
            password: 'TestPass@123',
            phone: 1234567890,
            gender: 'male',
        };
        const userResult = await createUserAndGetToken(userData, 'user');
        testUser = userResult.user;
        userToken = userResult.token;

        // Create admin user
        const adminData = {
            name: 'Admin User',
            email: 'admin@test.com',
            password: 'AdminPass@123',
            phone: 9876543210,
            gender: 'female',
        };
        const adminResult = await createUserAndGetToken(adminData, 'admin');
        adminToken = adminResult.token;

        // Create test category
        testCategory = await Category.create({
            name: 'Test Category',
            slug: 'test-category'
        });

        // Create test product
        testProduct = await Product.create({
            name: 'Test Product',
            slug: 'test-product',
            price: 1000,
            discount_price: 900,
            category: testCategory._id,
            productCategory: 'Electronics',
            status: true,
            stock: true
        });
    });

    describe('POST /cart/create', () => {
        const endpoint = '/cart/create';

        it('should create cart item successfully with valid data', async () => {
            const cartData = {
                product_id: testProduct._id.toString(),
                qty: 2,
                user: testUser._id.toString()
            };

            const res = await request(app)
                .post(endpoint)
                .send(cartData);

            expect(res.statusCode).toBe(201);
            expect(res.body).toHaveProperty('message', 'Cart created successfully');
            expect(res.body).toHaveProperty('data');
            expect(res.body.data).toHaveProperty('product', testProduct._id.toString());
            expect(res.body.data).toHaveProperty('qty', 2);
            expect(res.body.data).toHaveProperty('total', 1800); // 900 * 2
        });

        it('should create cart item with default quantity when qty not provided', async () => {
            const cartData = {
                product_id: testProduct._id.toString(),
                user: testUser._id.toString()
            };

            const res = await request(app)
                .post(endpoint)
                .send(cartData);

            expect(res.statusCode).toBe(201);
            expect(res.body).toHaveProperty('message', 'Cart created successfully');
            expect(res.body.data).toHaveProperty('qty', 1);
            expect(res.body.data).toHaveProperty('total', 900); // 900 * 1
        });

        it('should use regular price when discount_price is not available', async () => {
            // Create product without discount price
            const productWithoutDiscount = await Product.create({
                name: 'Product No Discount',
                slug: 'product-no-discount',
                price: 1500,
                category: testCategory._id,
                productCategory: 'Electronics'
            });

            const cartData = {
                product_id: productWithoutDiscount._id.toString(),
                qty: 1,
                user: testUser._id.toString()
            };

            const res = await request(app)
                .post(endpoint)
                .send(cartData);

            expect(res.statusCode).toBe(201);
            expect(res.body.data).toHaveProperty('total', 1500); // regular price
        });

        it('should return 400 when product_id is missing', async () => {
            const cartData = {
                qty: 2,
                user: testUser._id.toString()
            };

            const res = await request(app)
                .post(endpoint)
                .send(cartData);

            expect(res.statusCode).toBe(400);
            expect(res.body).toHaveProperty('message', 'product_id is required');
        });

        it('should return 404 when product is not found', async () => {
            const cartData = {
                product_id: '507f1f77bcf86cd799439011', // Non-existent product ID
                qty: 1,
                user: testUser._id.toString()
            };

            const res = await request(app)
                .post(endpoint)
                .send(cartData);

            expect(res.statusCode).toBe(404);
            expect(res.body).toHaveProperty('message', 'Product not found');
        });

        it('should handle invalid product_id gracefully', async () => {
            const cartData = {
                product_id: 'invalid-id',
                qty: 1,
                user: testUser._id.toString()
            };

            const res = await request(app)
                .post(endpoint)
                .send(cartData);

            expect(res.statusCode).toBe(500);
            expect(res.body).toHaveProperty('message');
        });

        it('should handle negative quantity by using default', async () => {
            const cartData = {
                product_id: testProduct._id.toString(),
                qty: -5, // Negative quantity
                user: testUser._id.toString()
            };

            const res = await request(app)
                .post(endpoint)
                .send(cartData);

            expect(res.statusCode).toBe(201);
            expect(res.body.data).toHaveProperty('qty', 1); // Should use default
        });
    });

    describe('GET /cart/get', () => {
        const endpoint = '/cart/get';
        let testCartItem;

        beforeEach(async () => {
            // Create a test cart item
            testCartItem = await Cart.create({
                user: testUser._id,
                product: testProduct._id,
                qty: 2,
                total: 1800
            });
        });

        it('should get all cart items for user', async () => {
            const res = await request(app)
                .get(endpoint)
                .set('cookie', `token=${userToken}`);

            expect(res.statusCode).toBe(200);
            expect(res.body).toHaveProperty('message', 'Cart fetched successfully');
            expect(res.body).toHaveProperty('data');
            expect(Array.isArray(res.body.data)).toBe(true);
        });

        it('should get specific cart item by ID', async () => {
            const res = await request(app)
                .get(endpoint)
                .set('cookie', `token=${userToken}`)
                .query({ id: testCartItem._id.toString() });

            expect(res.statusCode).toBe(200);
            expect(res.body).toHaveProperty('message', 'Cart fetched successfully');
            expect(res.body).toHaveProperty('data');
            expect(res.body.data).toHaveProperty('_id', testCartItem._id.toString());
        });

        it('should return 404 when cart item is not found', async () => {
            const nonExistentId = '507f1f77bcf86cd799439011';
            const res = await request(app)
                .get(endpoint)
                .set('cookie', `token=${userToken}`)
                .query({ id: nonExistentId });

            expect(res.statusCode).toBe(404);
            expect(res.body).toHaveProperty('message', 'Cart not found');
        });

        it('should return empty array when user has no cart items', async () => {
            // Create a new user with no cart items
            const newUserData = {
                name: 'New User',
                email: 'newuser@test.com',
                password: 'NewPass@123',
                phone: 9999999999,
                gender: 'female',
            };
            const { token: newUserToken } = await createUserAndGetToken(newUserData);

            const res = await request(app)
                .get(endpoint)
                .set('cookie', `token=${newUserToken}`);

            expect(res.statusCode).toBe(200);
            expect(res.body).toHaveProperty('data');
            expect(Array.isArray(res.body.data)).toBe(true);
            expect(res.body.data.length).toBe(0);
        });
    });

    describe('PATCH /cart/update/:id', () => {
        let testCartItem;

        beforeEach(async () => {
            testCartItem = await Cart.create({
                user: testUser._id,
                product: testProduct._id,
                qty: 2,
                total: 1800
            });
        });

        it('should update cart item quantity and recalculate total', async () => {
            const updateData = {
                qty: 3
            };

            const res = await request(app)
                .patch(`/cart/update/${testCartItem._id}`)
                .send(updateData);

            expect(res.statusCode).toBe(200);
            expect(res.body).toHaveProperty('message', 'Cart updated successfully');
            expect(res.body.data).toHaveProperty('qty', 3);
            expect(res.body.data).toHaveProperty('total', 2700); // 900 * 3
        });

        it('should return 400 when quantity is not provided', async () => {
            const res = await request(app)
                .patch(`/cart/update/${testCartItem._id}`)
                .send({});

            expect(res.statusCode).toBe(400);
            expect(res.body).toHaveProperty('message', 'Quantity is required');
        });

        it('should return 400 when quantity is invalid', async () => {
            const updateData = {
                qty: 0 // Invalid quantity
            };

            const res = await request(app)
                .patch(`/cart/update/${testCartItem._id}`)
                .send(updateData);

            expect(res.statusCode).toBe(400);
            expect(res.body).toHaveProperty('message', 'Quantity must be greater than 0');
        });

        it('should return 404 when cart item is not found', async () => {
            const nonExistentId = '507f1f77bcf86cd799439011';
            const updateData = {
                qty: 3
            };

            const res = await request(app)
                .patch(`/cart/update/${nonExistentId}`)
                .send(updateData);

            expect(res.statusCode).toBe(404);
            expect(res.body).toHaveProperty('message', 'Cart not found');
        });

        it('should handle invalid cart ID gracefully', async () => {
            const updateData = {
                qty: 3
            };

            const res = await request(app)
                .patch('/cart/update/invalid-id')
                .send(updateData);

            expect(res.statusCode).toBe(500);
            expect(res.body).toHaveProperty('message');
        });
    });

    describe('DELETE /cart/delete', () => {
        const endpoint = '/cart/delete';
        let testCartItem1, testCartItem2;

        beforeEach(async () => {
            // Create multiple test cart items
            testCartItem1 = await Cart.create({
                user: testUser._id,
                product: testProduct._id,
                qty: 1,
                total: 900
            });

            testCartItem2 = await Cart.create({
                user: testUser._id,
                product: testProduct._id,
                qty: 2,
                total: 1800
            });
        });

        it('should delete specific cart item by ID', async () => {
            const res = await request(app)
                .delete(endpoint)
                .query({ id: testCartItem1._id.toString() });

            expect(res.statusCode).toBe(200);
            expect(res.body).toHaveProperty('message', 'Cart deleted successfully');

            // Verify item is deleted
            const deletedItem = await Cart.findById(testCartItem1._id);
            expect(deletedItem).toBeNull();

            // Verify other item still exists
            const remainingItem = await Cart.findById(testCartItem2._id);
            expect(remainingItem).not.toBeNull();
        });

        it('should delete all cart items when no ID is provided', async () => {
            const res = await request(app)
                .delete(endpoint);

            expect(res.statusCode).toBe(200);
            expect(res.body).toHaveProperty('message', 'All cart items deleted successfully');

            // Verify all items are deleted
            const remainingItems = await Cart.find({});
            expect(remainingItems.length).toBe(0);
        });

        it('should return 404 when cart item to delete is not found', async () => {
            const nonExistentId = '507f1f77bcf86cd799439011';
            const res = await request(app)
                .delete(endpoint)
                .query({ id: nonExistentId });

            expect(res.statusCode).toBe(404);
            expect(res.body).toHaveProperty('message', 'Cart not found');
        });

        it('should handle invalid cart ID gracefully', async () => {
            const res = await request(app)
                .delete(endpoint)
                .query({ id: 'invalid-id' });

            expect(res.statusCode).toBe(500);
            expect(res.body).toHaveProperty('message');
        });

        it('should return success when deleting all items from empty cart', async () => {
            // First delete all items
            await Cart.deleteMany({});

            const res = await request(app)
                .delete(endpoint);

            expect(res.statusCode).toBe(200);
            expect(res.body).toHaveProperty('message', 'All cart items deleted successfully');
        });
    });

    describe('Cart Model Validation Tests', () => {
        it('should create cart with valid data', async () => {
            const validCartData = {
                user: testUser._id,
                product: testProduct._id,
                qty: 3,
                total: 2700
            };

            const cart = await Cart.create(validCartData);
            expect(cart).toHaveProperty('_id');
            expect(cart.user.toString()).toBe(testUser._id.toString());
            expect(cart.product.toString()).toBe(testProduct._id.toString());
            expect(cart.qty).toBe(3);
            expect(cart.total).toBe(2700);
        });

        it('should create cart with default values when not provided', async () => {
            const cartData = {
                user: testUser._id,
                product: testProduct._id
            };

            const cart = await Cart.create(cartData);
            expect(cart.qty).toBe(1); // Default value
            expect(cart.total).toBe(0); // Default value
        });

        it('should require user and product fields', async () => {
            const invalidCartData = {
                qty: 2,
                total: 1800
            };

            try {
                await Cart.create(invalidCartData);
                // If we reach here, the validation didn't work as expected
                expect(true).toBe(false);
            } catch (error) {
                expect(error.name).toBe('ValidationError');
            }
        });
    });

    describe('Integration Tests', () => {
        it('should handle complete cart lifecycle (create -> read -> update -> delete)', async () => {
            // Create
            const createRes = await request(app)
                .post('/cart/create')
                .send({
                    product_id: testProduct._id.toString(),
                    qty: 2,
                    user: testUser._id.toString()
                });

            expect(createRes.statusCode).toBe(201);
            const cartItemId = createRes.body.data._id;

            // Read
            const readRes = await request(app)
                .get('/cart/get')
                .set('cookie', `token=${userToken}`)
                .query({ id: cartItemId });

            expect(readRes.statusCode).toBe(200);
            expect(readRes.body.data.qty).toBe(2);

            // Update
            const updateRes = await request(app)
                .patch(`/cart/update/${cartItemId}`)
                .send({ qty: 4 });

            expect(updateRes.statusCode).toBe(200);
            expect(updateRes.body.data.qty).toBe(4);
            expect(updateRes.body.data.total).toBe(3600); // 900 * 4

            // Delete
            const deleteRes = await request(app)
                .delete('/cart/delete')
                .query({ id: cartItemId });

            expect(deleteRes.statusCode).toBe(200);

            // Verify deletion
            const verifyRes = await request(app)
                .get('/cart/get')
                .set('cookie', `token=${userToken}`)
                .query({ id: cartItemId });

            expect(verifyRes.statusCode).toBe(404);
        });

        it('should handle multiple cart items for same user', async () => {
            // Create another product
            const anotherProduct = await Product.create({
                name: 'Another Product',
                slug: 'another-product',
                price: 1500,
                discount_price: 1200,
                category: testCategory._id,
                productCategory: 'Electronics'
            });

            // Add multiple items to cart
            const item1Res = await request(app)
                .post('/cart/create')
                .send({
                    product_id: testProduct._id.toString(),
                    qty: 2,
                    user: testUser._id.toString()
                });

            const item2Res = await request(app)
                .post('/cart/create')
                .send({
                    product_id: anotherProduct._id.toString(),
                    qty: 1,
                    user: testUser._id.toString()
                });

            expect(item1Res.statusCode).toBe(201);
            expect(item2Res.statusCode).toBe(201);

            // Get all cart items
            const getAllRes = await request(app)
                .get('/cart/get')
                .set('cookie', `token=${userToken}`);

            expect(getAllRes.statusCode).toBe(200);
            expect(getAllRes.body.data.length).toBeGreaterThanOrEqual(2);
        });

        it('should calculate total correctly for different price scenarios', async () => {
            // Test with discount price
            const cartWithDiscount = await request(app)
                .post('/cart/create')
                .send({
                    product_id: testProduct._id.toString(),
                    qty: 3,
                    user: testUser._id.toString()
                });

            expect(cartWithDiscount.statusCode).toBe(201);
            expect(cartWithDiscount.body.data.total).toBe(2700); // 900 * 3

            // Test with regular price (no discount)
            const productNoDiscount = await Product.create({
                name: 'No Discount Product',
                slug: 'no-discount-product',
                price: 2000,
                category: testCategory._id
            });

            const cartNoDiscount = await request(app)
                .post('/cart/create')
                .send({
                    product_id: productNoDiscount._id.toString(),
                    qty: 2,
                    user: testUser._id.toString()
                });

            expect(cartNoDiscount.statusCode).toBe(201);
            expect(cartNoDiscount.body.data.total).toBe(4000); // 2000 * 2
        });
    });
});
