const request = require('supertest');
const app = require('../src/index');
const Payment = require('../src/Models/Payment.model');
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

// Mock Razorpay to prevent real API calls during testing
jest.mock('razorpay', () => {
    return jest.fn().mockImplementation(() => ({
        orders: {
            create: jest.fn().mockResolvedValue({
                id: 'order_mock_razorpay_id',
                amount: 100000,
                currency: 'INR',
                status: 'created'
            })
        },
        payments: {
            fetch: jest.fn().mockResolvedValue({
                id: 'pay_mock_payment_id',
                order_id: 'order_mock_razorpay_id',
                status: 'captured',
                amount: 100000
            })
        }
    }));
});

describe('Payment API Tests', () => {
    let adminToken, userToken;
    let testUser, testOrder, testProduct, testCategory;

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

        // Create test order
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

    describe('POST /payment/create', () => {
        const endpoint = '/payment/create';

        it('should create payment order successfully with valid data', async () => {
            const paymentData = {
                amount: 100000, // Amount in paise (1000 INR)
                currency: 'INR',
                order_id: testOrder._id.toString()
            };

            const res = await request(app)
                .post(endpoint)
                .set('cookie', `token=${userToken}`)
                .send(paymentData);

            TestHelpers.commonAssertions.assertCreated(res, 'Payment order created successfully');
            expect(res.body.data).toHaveProperty('razorpay_order_id');
            expect(res.body.data).toHaveProperty('amount', paymentData.amount);
            expect(res.body.data).toHaveProperty('currency', paymentData.currency);
        });

        it('should return 400 when required fields are missing', async () => {
            const res = await request(app)
                .post(endpoint)
                .set('cookie', `token=${userToken}`)
                .send({});

            TestHelpers.commonAssertions.assertBadRequest(res);
        });

        it('should return 401 when no authentication token is provided', async () => {
            const paymentData = {
                amount: 100000,
                currency: 'INR',
                order_id: testOrder._id.toString()
            };

            const res = await request(app)
                .post(endpoint)
                .send(paymentData);

            TestHelpers.commonAssertions.assertUnauthorized(res);
        });

        it('should handle invalid amount gracefully', async () => {
            const paymentData = {
                amount: -1000, // Invalid negative amount
                currency: 'INR',
                order_id: testOrder._id.toString()
            };

            const res = await request(app)
                .post(endpoint)
                .set('cookie', `token=${userToken}`)
                .send(paymentData);

            TestHelpers.commonAssertions.assertBadRequest(res);
        });
    });

    describe('POST /payment/verify', () => {
        const endpoint = '/payment/verify';
        let testPayment;

        beforeEach(async () => {
            // Create a test payment
            testPayment = await Payment.create({
                order: testOrder._id,
                user: testUser._id,
                razorpay_orderId: 'order_mock_razorpay_id',
                price: {
                    amount: 100000,
                    currency: 'INR'
                },
                status: 'PENDING'
            });
        });

        it('should verify payment successfully with valid signature', async () => {
            const verificationData = {
                razorpay_order_id: 'order_mock_razorpay_id',
                razorpay_payment_id: 'pay_mock_payment_id',
                razorpay_signature: 'mock_signature_hash'
            };

            const res = await request(app)
                .post(endpoint)
                .set('cookie', `token=${userToken}`)
                .send(verificationData);

            TestHelpers.commonAssertions.assertUpdated(res, 'Payment verified successfully');
            expect(res.body.data).toHaveProperty('status', 'COMPETED');
            expect(res.body.data).toHaveProperty('paymentId', verificationData.razorpay_payment_id);
        });

        it('should return 400 when required verification fields are missing', async () => {
            const res = await request(app)
                .post(endpoint)
                .set('cookie', `token=${userToken}`)
                .send({});

            TestHelpers.commonAssertions.assertBadRequest(res);
        });

        it('should return 401 when no authentication token is provided', async () => {
            const verificationData = {
                razorpay_order_id: 'order_mock_razorpay_id',
                razorpay_payment_id: 'pay_mock_payment_id',
                razorpay_signature: 'mock_signature_hash'
            };

            const res = await request(app)
                .post(endpoint)
                .send(verificationData);

            TestHelpers.commonAssertions.assertUnauthorized(res);
        });

        it('should handle invalid signature gracefully', async () => {
            const verificationData = {
                razorpay_order_id: 'order_mock_razorpay_id',
                razorpay_payment_id: 'pay_mock_payment_id',
                razorpay_signature: 'invalid_signature'
            };

            const res = await request(app)
                .post(endpoint)
                .set('cookie', `token=${userToken}`)
                .send(verificationData);

            expect(res.statusCode).toBe(400);
            expect(res.body).toHaveProperty('message');
            expect(res.body.message.toLowerCase()).toContain('invalid');
        });
    });

    describe('GET /payment/get', () => {
        const endpoint = '/payment/get';
        let testPayment;

        beforeEach(async () => {
            testPayment = await Payment.create({
                order: testOrder._id,
                user: testUser._id,
                paymentId: 'pay_mock_payment_id',
                razorpay_orderId: 'order_mock_razorpay_id',
                price: {
                    amount: 100000,
                    currency: 'INR'
                },
                signature: 'mock_signature_hash',
                status: 'COMPETED'
            });
        });

        it('should get all payments for user', async () => {
            const res = await request(app)
                .get(endpoint)
                .set('cookie', `token=${userToken}`);

            TestHelpers.commonAssertions.assertFetched(res, 'Payments fetched successfully');
            expect(Array.isArray(res.body.data)).toBe(true);
            expect(res.body.data.length).toBeGreaterThan(0);
        });

        it('should get specific payment by ID', async () => {
            const res = await request(app)
                .get(endpoint)
                .set('cookie', `token=${userToken}`)
                .query({ id: testPayment._id.toString() });

            TestHelpers.commonAssertions.assertFetched(res, 'Payment fetched successfully');
            expect(res.body.data).toHaveProperty('_id', testPayment._id.toString());
            expect(res.body.data).toHaveProperty('paymentId', 'pay_mock_payment_id');
        });

        it('should return 404 when payment is not found', async () => {
            const nonExistentId = '507f1f77bcf86cd799439011';
            const res = await request(app)
                .get(endpoint)
                .set('cookie', `token=${userToken}`)
                .query({ id: nonExistentId });

            TestHelpers.commonAssertions.assertNotFound(res, 'Payment');
        });

        it('should return 401 when no authentication token is provided', async () => {
            const res = await request(app).get(endpoint);
            TestHelpers.commonAssertions.assertUnauthorized(res);
        });

        it('should allow admin to get all payments', async () => {
            const res = await request(app)
                .get(endpoint)
                .set('cookie', `token=${adminToken}`);

            TestHelpers.commonAssertions.assertFetched(res, 'Payments fetched successfully');
            expect(Array.isArray(res.body.data)).toBe(true);
        });
    });

    describe('PATCH /payment/update-status', () => {
        const endpoint = '/payment/update-status';
        let testPayment;

        beforeEach(async () => {
            testPayment = await Payment.create({
                order: testOrder._id,
                user: testUser._id,
                paymentId: 'pay_mock_payment_id',
                razorpay_orderId: 'order_mock_razorpay_id',
                price: {
                    amount: 100000,
                    currency: 'INR'
                },
                status: 'PENDING'
            });
        });

        it('should update payment status successfully with admin auth', async () => {
            const res = await request(app)
                .patch(endpoint)
                .set('cookie', `token=${adminToken}`)
                .query({
                    id: testPayment._id.toString(),
                    new_status: 'FAILED'
                });

            TestHelpers.commonAssertions.assertUpdated(res, 'Payment status updated successfully');
            expect(res.body.data).toHaveProperty('status', 'FAILED');
        });

        it('should return 400 when required parameters are missing', async () => {
            const res = await request(app)
                .patch(endpoint)
                .set('cookie', `token=${adminToken}`)
                .query({});

            TestHelpers.commonAssertions.assertBadRequest(res);
        });

        it('should return 404 when payment is not found', async () => {
            const nonExistentId = '507f1f77bcf86cd799439011';
            const res = await request(app)
                .patch(endpoint)
                .set('cookie', `token=${adminToken}`)
                .query({
                    id: nonExistentId,
                    new_status: 'FAILED'
                });

            TestHelpers.commonAssertions.assertNotFound(res, 'Payment');
        });

        it('should return 403 when non-admin user tries to update status', async () => {
            const res = await request(app)
                .patch(endpoint)
                .set('cookie', `token=${userToken}`)
                .query({
                    id: testPayment._id.toString(),
                    new_status: 'FAILED'
                });

            TestHelpers.commonAssertions.assertForbidden(res);
        });

        it('should validate status enum values', async () => {
            const res = await request(app)
                .patch(endpoint)
                .set('cookie', `token=${adminToken}`)
                .query({
                    id: testPayment._id.toString(),
                    new_status: 'INVALID_STATUS'
                });

            TestHelpers.commonAssertions.assertBadRequest(res);
        });
    });

    describe('DELETE /payment/delete', () => {
        const endpoint = '/payment/delete';
        let testPayment;

        beforeEach(async () => {
            testPayment = await Payment.create({
                order: testOrder._id,
                user: testUser._id,
                paymentId: 'pay_mock_payment_id',
                razorpay_orderId: 'order_mock_razorpay_id',
                price: {
                    amount: 100000,
                    currency: 'INR'
                },
                status: 'PENDING'
            });
        });

        it('should delete payment successfully with admin auth', async () => {
            const res = await request(app)
                .delete(endpoint)
                .set('cookie', `token=${adminToken}`)
                .query({ id: testPayment._id.toString() });

            TestHelpers.commonAssertions.assertDeleted(res, 'Payment deleted successfully');

            // Verify payment is actually deleted
            const deletedPayment = await Payment.findById(testPayment._id);
            expect(deletedPayment).toBeNull();
        });

        it('should return 400 when payment ID is not provided', async () => {
            const res = await request(app)
                .delete(endpoint)
                .set('cookie', `token=${adminToken}`)
                .query({});

            TestHelpers.commonAssertions.assertBadRequest(res);
        });

        it('should return 404 when payment to delete is not found', async () => {
            const nonExistentId = '507f1f77bcf86cd799439011';
            const res = await request(app)
                .delete(endpoint)
                .set('cookie', `token=${adminToken}`)
                .query({ id: nonExistentId });

            TestHelpers.commonAssertions.assertNotFound(res, 'Payment');
        });

        it('should return 403 when non-admin user tries to delete payment', async () => {
            const res = await request(app)
                .delete(endpoint)
                .set('cookie', `token=${userToken}`)
                .query({ id: testPayment._id.toString() });

            TestHelpers.commonAssertions.assertForbidden(res);
        });
    });

    describe('Payment Model Validation Tests', () => {
        it('should create payment with valid data', async () => {
            const validPaymentData = {
                order: testOrder._id,
                user: testUser._id,
                paymentId: 'pay_test_payment_id',
                razorpay_orderId: 'order_test_razorpay_id',
                price: {
                    amount: 150000,
                    currency: 'INR'
                },
                signature: 'test_signature_hash',
                status: 'COMPETED'
            };

            const payment = await Payment.create(validPaymentData);
            expect(payment).toHaveProperty('_id');
            expect(payment.user.toString()).toBe(testUser._id.toString());
            expect(payment.order.toString()).toBe(testOrder._id.toString());
            expect(payment.price.amount).toBe(validPaymentData.price.amount);
            expect(payment.status).toBe('COMPETED');
        });

        it('should create payment with default values when not provided', async () => {
            const paymentData = {
                user: testUser._id,
                price: {
                    amount: 100000
                }
            };

            const payment = await Payment.create(paymentData);
            expect(payment.status).toBe('PENDING'); // Default value
            expect(payment.price.currency).toBe('INR'); // Default value
        });

        it('should require user field', async () => {
            const invalidPaymentData = {
                order: testOrder._id,
                price: {
                    amount: 100000,
                    currency: 'INR'
                }
            };

            try {
                await Payment.create(invalidPaymentData);
                // If we reach here, the validation didn't work as expected
                expect(true).toBe(false);
            } catch (error) {
                expect(error.name).toBe('ValidationError');
            }
        });

        it('should validate status enum values', async () => {
            const paymentData = {
                user: testUser._id,
                order: testOrder._id,
                price: {
                    amount: 100000,
                    currency: 'INR'
                },
                status: 'INVALID_STATUS'
            };

            try {
                await Payment.create(paymentData);
                // If we reach here, the validation didn't work as expected
                expect(true).toBe(false);
            } catch (error) {
                expect(error.name).toBe('ValidationError');
            }
        });
    });

    describe('Integration Tests', () => {
        it('should handle complete payment lifecycle (create -> verify -> update -> delete)', async () => {
            // Create Payment Order
            const createRes = await request(app)
                .post('/payment/create')
                .set('cookie', `token=${userToken}`)
                .send({
                    amount: 200000,
                    currency: 'INR',
                    order_id: testOrder._id.toString()
                });

            expect(createRes.statusCode).toBe(201);
            const paymentOrderId = createRes.body.data.razorpay_order_id;

            // Verify Payment
            const verifyRes = await request(app)
                .post('/payment/verify')
                .set('cookie', `token=${userToken}`)
                .send({
                    razorpay_order_id: paymentOrderId,
                    razorpay_payment_id: 'pay_integration_test_id',
                    razorpay_signature: 'integration_test_signature'
                });

            expect(verifyRes.statusCode).toBe(200);
            const paymentId = verifyRes.body.data._id;

            // Get Payment
            const getRes = await request(app)
                .get('/payment/get')
                .set('cookie', `token=${userToken}`)
                .query({ id: paymentId });

            expect(getRes.statusCode).toBe(200);
            expect(getRes.body.data.status).toBe('COMPETED');

            // Update Status (Admin only)
            const statusRes = await request(app)
                .patch('/payment/update-status')
                .set('cookie', `token=${adminToken}`)
                .query({ id: paymentId, new_status: 'FAILED' });

            expect(statusRes.statusCode).toBe(200);
            expect(statusRes.body.data.status).toBe('FAILED');

            // Delete Payment (Admin only)
            const deleteRes = await request(app)
                .delete('/payment/delete')
                .set('cookie', `token=${adminToken}`)
                .query({ id: paymentId });

            expect(deleteRes.statusCode).toBe(200);

            // Verify deletion
            const verifyDeleteRes = await request(app)
                .get('/payment/get')
                .set('cookie', `token=${userToken}`)
                .query({ id: paymentId });

            expect(verifyDeleteRes.statusCode).toBe(404);
        });

        it('should handle payment failure scenarios', async () => {
            // Create payment that will fail verification
            const createRes = await request(app)
                .post('/payment/create')
                .set('cookie', `token=${userToken}`)
                .send({
                    amount: 100000,
                    currency: 'INR',
                    order_id: testOrder._id.toString()
                });

            expect(createRes.statusCode).toBe(201);

            // Try to verify with invalid signature
            const verifyRes = await request(app)
                .post('/payment/verify')
                .set('cookie', `token=${userToken}`)
                .send({
                    razorpay_order_id: createRes.body.data.razorpay_order_id,
                    razorpay_payment_id: 'pay_failed_test_id',
                    razorpay_signature: 'invalid_signature'
                });

            expect(verifyRes.statusCode).toBe(400);
            expect(verifyRes.body.message.toLowerCase()).toContain('invalid');
        });

        it('should handle multiple payments for same order', async () => {
            // Create multiple payment attempts for same order
            const payment1Res = await request(app)
                .post('/payment/create')
                .set('cookie', `token=${userToken}`)
                .send({
                    amount: 100000,
                    currency: 'INR',
                    order_id: testOrder._id.toString()
                });

            const payment2Res = await request(app)
                .post('/payment/create')
                .set('cookie', `token=${userToken}`)
                .send({
                    amount: 100000,
                    currency: 'INR',
                    order_id: testOrder._id.toString()
                });

            expect(payment1Res.statusCode).toBe(201);
            expect(payment2Res.statusCode).toBe(201);

            // Both should have different razorpay order IDs
            expect(payment1Res.body.data.razorpay_order_id).not.toBe(payment2Res.body.data.razorpay_order_id);
        });
    });
});
