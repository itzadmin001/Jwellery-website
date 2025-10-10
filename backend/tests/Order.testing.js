const request = require('supertest');
const app = require('../src/index');
const Order = require('../src/Models/Order.model');
const Product = require('../src/Models/Product.model');
const Category = require('../src/Models/Category.model');
const User = require('../src/Models/User.model');
const TestHelpers = require('./utils/testHelpers');

// Mock Redis before any tests run
jest.mock('../Db/Redis', () => ({
    set: jest.fn().mockResolvedValue('OK'),
    get: jest.fn().mockResolvedValue(null),
    del: jest.fn().mockResolvedValue(1),
    on: jest.fn()
}));

// Mock ImageKit to prevent real API calls during testing
jest.mock('imagekit', () => {
    return jest.fn().mockImplementation(() => ({
        upload: jest.fn().mockResolvedValue({
            url: 'https://mock-imagekit-url.com/test-image.jpg',
            fileId: 'mock-file-id-123'
        }),
        deleteFile: jest.fn().mockResolvedValue({ success: true }),
        listFiles: jest.fn().mockResolvedValue([
            {
                fileId: 'mock-file-id-123',
                url: 'https://mock-imagekit-url.com/test-image.jpg',
                filePath: '/test/test-image.jpg'
            }
        ])
    }));
});

describe('Order API Tests', () => {
    let adminToken, userToken;
    let testUser, testProduct, testCategory;

    beforeAll(async () => {
        TestHelpers.setupTestEnvironment();

        // Create test users
        const { adminToken: aToken, userToken: uToken, regularUser } = await TestHelpers.createTestUsers();
        adminToken = aToken;
        userToken = uToken;
        testUser = regularUser;

        // Create test category and product
        testCategory = await TestHelpers.createTestCategory();
        testProduct = await TestHelpers.createTestProduct({}, testCategory._id);
    });

    describe('POST /orders/create', () => {
        const endpoint = '/orders/create';

        it('should create order successfully with valid data', async () => {
            const orderData = {
                user: testUser._id.toString(),
                item: [
                    {
                        product: testProduct._id.toString(),
                        quantity: 2,
                        price: testProduct.price
                    }
                ],
                totalAmount: {
                    amount: testProduct.price * 2,
                    currency: 'INR'
                },
                shippingAddress: {
                    street: '123 Test Street',
                    city: 'Test City',
                    state: 'Test State',
                    pincode: 12345
                }
            };

            const res = await request(app)
                .post(endpoint)
                .set('cookie', `token=${userToken}`)
                .send(orderData);

            TestHelpers.commonAssertions.assertCreated(res, 'Order created successfully');
            expect(res.body.data).toHaveProperty('user', testUser._id.toString());
            expect(res.body.data).toHaveProperty('totalAmount');
            expect(res.body.data.totalAmount).toHaveProperty('amount', orderData.totalAmount.amount);
            expect(res.body.data).toHaveProperty('status', 'pending');
        });

        it('should return 400 when required fields are missing', async () => {
            const res = await request(app)
                .post(endpoint)
                .set('cookie', `token=${userToken}`)
                .send({});

            TestHelpers.commonAssertions.assertBadRequest(res);
        });

        it('should return 401 when no authentication token is provided', async () => {
            const orderData = {
                user: testUser._id.toString(),
                item: [{ product: testProduct._id.toString(), quantity: 1, price: testProduct.price }],
                totalAmount: { amount: testProduct.price, currency: 'INR' }
            };

            const res = await request(app)
                .post(endpoint)
                .send(orderData);

            TestHelpers.commonAssertions.assertUnauthorized(res);
        });
    });

    describe('GET /orders/get', () => {
        const endpoint = '/orders/get';
        let testOrder;

        beforeEach(async () => {
            testOrder = await Order.create({
                user: testUser._id,
                item: [
                    {
                        product: testProduct._id,
                        quantity: 1,
                        price: testProduct.price
                    }
                ],
                totalAmount: {
                    amount: testProduct.price,
                    currency: 'INR'
                },
                shippingAddress: {
                    street: '123 Test Street',
                    city: 'Test City',
                    state: 'Test State',
                    pincode: 12345
                },
                status: 'PENDING'
            });
        });

        it('should get all orders for user', async () => {
            const res = await request(app)
                .get(endpoint)
                .set('cookie', `token=${userToken}`);

            TestHelpers.commonAssertions.assertFetched(res, 'Orders fetched successfully');
            expect(Array.isArray(res.body.data)).toBe(true);
            expect(res.body.data.length).toBeGreaterThan(0);
        });

        it('should get specific order by ID', async () => {
            const res = await request(app)
                .get(endpoint)
                .set('cookie', `token=${userToken}`)
                .query({ id: testOrder._id.toString() });

            TestHelpers.commonAssertions.assertFetched(res, 'Order fetched successfully');
            expect(res.body.data).toHaveProperty('_id', testOrder._id.toString());
        });

        it('should return 404 when order is not found', async () => {
            const nonExistentId = '507f1f77bcf86cd799439011';
            const res = await request(app)
                .get(endpoint)
                .set('cookie', `token=${userToken}`)
                .query({ id: nonExistentId });

            TestHelpers.commonAssertions.assertNotFound(res, 'Order');
        });

        it('should return 401 when no authentication token is provided', async () => {
            const res = await request(app).get(endpoint);
            TestHelpers.commonAssertions.assertUnauthorized(res);
        });
    });

    describe('PATCH /orders/update-status', () => {
        const endpoint = '/orders/update-status';
        let testOrder;

        beforeEach(async () => {
            testOrder = await Order.create({
                user: testUser._id,
                products: [{ product: testProduct._id, quantity: 1, price: testProduct.price }],
                total_amount: testProduct.price,
                shipping_address: { street: '123 Test Street', city: 'Test City', state: 'Test State', pincode: 12345 },
                payment_method: 'credit_card',
                status: 'pending'
            });
        });

        it('should update order status successfully with admin auth', async () => {
            const res = await request(app)
                .patch(endpoint)
                .set('cookie', `token=${adminToken}`)
                .query({
                    id: testOrder._id.toString(),
                    new_status: 'confirmed'
                });

            TestHelpers.commonAssertions.assertUpdated(res, 'Order status updated successfully');
            expect(res.body.data).toHaveProperty('status', 'CONFIRED');
        });

        it('should return 400 when required parameters are missing', async () => {
            const res = await request(app)
                .patch(endpoint)
                .set('cookie', `token=${adminToken}`)
                .query({});

            TestHelpers.commonAssertions.assertBadRequest(res);
        });

        it('should return 404 when order is not found', async () => {
            const nonExistentId = '507f1f77bcf86cd799439011';
            const res = await request(app)
                .patch(endpoint)
                .set('cookie', `token=${adminToken}`)
                .query({
                    id: nonExistentId,
                    new_status: 'CONFIRED'
                });

            TestHelpers.commonAssertions.assertNotFound(res, 'Order');
        });

        it('should return 403 when non-admin user tries to update status', async () => {
            const res = await request(app)
                .patch(endpoint)
                .set('cookie', `token=${userToken}`)
                .query({
                    id: testOrder._id.toString(),
                    new_status: 'confirmed'
                });

            TestHelpers.commonAssertions.assertForbidden(res);
        });
    });

    describe('DELETE /orders/delete', () => {
        const endpoint = '/orders/delete';
        let testOrder;

        beforeEach(async () => {
            testOrder = await Order.create({
                user: testUser._id,
                products: [{ product: testProduct._id, quantity: 1, price: testProduct.price }],
                total_amount: testProduct.price,
                shipping_address: { street: '123 Test Street', city: 'Test City', state: 'Test State', pincode: 12345 },
                payment_method: 'credit_card',
                status: 'pending'
            });
        });

        it('should delete order successfully with admin auth', async () => {
            const res = await request(app)
                .delete(endpoint)
                .set('cookie', `token=${adminToken}`)
                .query({ id: testOrder._id.toString() });

            TestHelpers.commonAssertions.assertDeleted(res, 'Order deleted successfully');

            // Verify order is actually deleted
            const deletedOrder = await Order.findById(testOrder._id);
            expect(deletedOrder).toBeNull();
        });

        it('should return 400 when order ID is not provided', async () => {
            const res = await request(app)
                .delete(endpoint)
                .set('cookie', `token=${adminToken}`)
                .query({});

            TestHelpers.commonAssertions.assertBadRequest(res);
        });

        it('should return 404 when order to delete is not found', async () => {
            const nonExistentId = '507f1f77bcf86cd799439011';
            const res = await request(app)
                .delete(endpoint)
                .set('cookie', `token=${adminToken}`)
                .query({ id: nonExistentId });

            TestHelpers.commonAssertions.assertNotFound(res, 'Order');
        });

        it('should return 403 when non-admin user tries to delete order', async () => {
            const res = await request(app)
                .delete(endpoint)
                .set('cookie', `token=${userToken}`)
                .query({ id: testOrder._id.toString() });

            TestHelpers.commonAssertions.assertForbidden(res);
        });
    });

    describe('Order Model Validation Tests', () => {
        it('should create order with valid data', async () => {
            const validOrderData = {
                user: testUser._id,
                item: [
                    {
                        product: testProduct._id,
                        quantity: 2,
                        price: testProduct.price
                    }
                ],
                totalAmount: {
                    amount: testProduct.price * 2,
                    currency: 'INR'
                },
                shippingAddress: {
                    street: '123 Test Street',
                    city: 'Test City',
                    state: 'Test State',
                    pincode: 12345
                }
            };

            const order = await Order.create(validOrderData);
            expect(order).toHaveProperty('_id');
            expect(order.user.toString()).toBe(testUser._id.toString());
            expect(order.totalAmount.amount).toBe(validOrderData.totalAmount.amount);
            expect(order.status).toBe('PENDING'); // Default value
        });

        it('should create order with default status when not provided', async () => {
            const orderData = {
                user: testUser._id,
                item: [{ product: testProduct._id, quantity: 1, price: testProduct.price }],
                totalAmount: { amount: testProduct.price, currency: 'INR' },
                shippingAddress: { street: '123 Test Street', city: 'Test City', state: 'Test State', pincode: 12345 }
            };

            const order = await Order.create(orderData);
            expect(order.status).toBe('PENDING'); // Default value
        });
    });

    describe('Integration Tests', () => {
        it('should handle complete order lifecycle (create -> read -> update -> delete)', async () => {
            // Create
            const createRes = await request(app)
                .post('/orders/create')
                .set('cookie', `token=${userToken}`)
                .send({
                    user: testUser._id.toString(),
                    item: [{ product: testProduct._id.toString(), quantity: 1, price: testProduct.price }],
                    totalAmount: { amount: testProduct.price, currency: 'INR' },
                    shippingAddress: { street: '123 Test Street', city: 'Test City', state: 'Test State', pincode: 12345 }
                });

            expect(createRes.statusCode).toBe(201);
            const orderId = createRes.body.data._id;

            // Read
            const readRes = await request(app)
                .get('/orders/get')
                .set('cookie', `token=${userToken}`)
                .query({ id: orderId });

            expect(readRes.statusCode).toBe(200);

            // Update Status
            const statusRes = await request(app)
                .patch('/orders/update-status')
                .set('cookie', `token=${adminToken}`)
                .query({ id: orderId, new_status: 'CONFIRED' });

            expect(statusRes.statusCode).toBe(200);
            expect(statusRes.body.data.status).toBe('CONFIRED');

            // Delete
            const deleteRes = await request(app)
                .delete('/orders/delete')
                .set('cookie', `token=${adminToken}`)
                .query({ id: orderId });

            expect(deleteRes.statusCode).toBe(200);

            // Verify deletion
            const verifyRes = await request(app)
                .get('/orders/get')
                .set('cookie', `token=${userToken}`)
                .query({ id: orderId });

            expect(verifyRes.statusCode).toBe(404);
        });
    });
});
