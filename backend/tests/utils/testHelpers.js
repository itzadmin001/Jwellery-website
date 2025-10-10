const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const User = require('../../src/Models/User.model');
const Category = require('../../src/Models/Category.model');
const Product = require('../../src/Models/Product.model');

/**
 * Test Helper Utilities
 * Shared functions for all test files to reduce code duplication
 */

class TestHelpers {
    /**
     * Create a user and return user object with JWT token
     * @param {Object} userData - User data object
     * @param {string} role - User role ('user' or 'admin')
     * @returns {Object} { user, token }
     */
    static async createUserAndGetToken(userData, role = 'user') {
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
    }

    /**
     * Create a test category
     * @param {Object} categoryData - Category data (optional)
     * @returns {Object} Created category
     */
    static async createTestCategory(categoryData = {}) {
        const defaultData = {
            name: 'Test Category',
            slug: 'test-category',
            subcategories: ['Sub1', 'Sub2'],
            status: true
        };

        return await Category.create({ ...defaultData, ...categoryData });
    }

    /**
     * Create a test product
     * @param {Object} productData - Product data (optional)
     * @param {string} categoryId - Category ID (optional)
     * @returns {Object} Created product
     */
    static async createTestProduct(productData = {}, categoryId = null) {
        let category = categoryId;
        if (!category) {
            const testCategory = await this.createTestCategory();
            category = testCategory._id;
        }

        const defaultData = {
            name: 'Test Product',
            slug: 'test-product',
            price: 1000,
            discount_price: 900,
            category: category,
            productCategory: 'Electronics',
            status: true,
            stock: true,
            sale: false
        };

        return await Product.create({ ...defaultData, ...productData });
    }

    /**
     * Generate valid user data for testing
     * @param {Object} overrides - Data to override defaults
     * @returns {Object} User data object
     */
    static generateUserData(overrides = {}) {
        const defaultData = {
            name: 'Test User',
            email: 'testuser@example.com',
            password: 'TestPass@123',
            phone: 1234567890,
            gender: 'male'
        };

        return { ...defaultData, ...overrides };
    }

    /**
     * Generate valid category data for testing
     * @param {Object} overrides - Data to override defaults
     * @returns {Object} Category data object
     */
    static generateCategoryData(overrides = {}) {
        const defaultData = {
            name: 'Test Category',
            slug: 'test-category',
            subcategories: ['Subcategory 1', 'Subcategory 2'],
            status: true
        };

        return { ...defaultData, ...overrides };
    }

    /**
     * Generate valid product data for testing
     * @param {Object} overrides - Data to override defaults
     * @param {string} categoryId - Category ID
     * @returns {Object} Product data object
     */
    static generateProductData(overrides = {}, categoryId = null) {
        const defaultData = {
            name: 'Test Product',
            slug: 'test-product',
            price: 1000,
            discount_price: 900,
            category: categoryId,
            productCategory: 'Electronics',
            status: true,
            stock: true,
            sale: false
        };

        return { ...defaultData, ...overrides };
    }

    /**
     * Generate valid cart data for testing
     * @param {Object} overrides - Data to override defaults
     * @param {string} userId - User ID
     * @param {string} productId - Product ID
     * @returns {Object} Cart data object
     */
    static generateCartData(overrides = {}, userId = null, productId = null) {
        const defaultData = {
            user: userId,
            product: productId,
            qty: 1,
            total: 900
        };

        return { ...defaultData, ...overrides };
    }

    /**
     * Create admin and regular user for tests
     * @returns {Object} { adminUser, adminToken, regularUser, userToken }
     */
    static async createTestUsers() {
        // Create admin user
        const adminData = this.generateUserData({
            name: 'Admin User',
            email: 'admin@test.com',
            password: 'AdminPass@123',
            phone: 9876543210,
            gender: 'male'
        });
        const adminResult = await this.createUserAndGetToken(adminData, 'admin');

        // Create regular user
        const userData = this.generateUserData({
            name: 'Regular User',
            email: 'user@test.com',
            password: 'UserPass@123',
            phone: 1234567890,
            gender: 'female'
        });
        const userResult = await this.createUserAndGetToken(userData, 'user');

        return {
            adminUser: adminResult.user,
            adminToken: adminResult.token,
            regularUser: userResult.user,
            userToken: userResult.token
        };
    }

    /**
     * Setup environment variables for testing
     */
    static setupTestEnvironment() {
        process.env.IMAGEKIT_PUBLIC_KEY = 'test_public_key';
        process.env.IMAGEKIT_PRIVATE_KEY = 'test_private_key';
        process.env.IMAGEKIT_URL_ENGPOINT = 'https://mock-imagekit-url.com';
        process.env.NODE_ENV = 'test';

        if (!process.env.JWT_SECRET) {
            process.env.JWT_SECRET = 'testsecret';
        }
    }

    /**
     * Common assertions for API responses
     */
    static commonAssertions = {
        /**
         * Assert successful creation response
         * @param {Object} response - Supertest response
         * @param {string} message - Expected success message
         */
        assertCreated(response, message = 'created successfully') {
            expect(response.statusCode).toBe(201);
            expect(response.body).toHaveProperty('message');
            expect(response.body.message.toLowerCase()).toContain(message.toLowerCase());
            expect(response.body).toHaveProperty('data');
        },

        /**
         * Assert successful fetch response
         * @param {Object} response - Supertest response
         * @param {string} message - Expected success message
         */
        assertFetched(response, message = 'fetched successfully') {
            expect(response.statusCode).toBe(200);
            expect(response.body).toHaveProperty('message');
            expect(response.body.message.toLowerCase()).toContain(message.toLowerCase());
            expect(response.body).toHaveProperty('data');
        },

        /**
         * Assert successful update response
         * @param {Object} response - Supertest response
         * @param {string} message - Expected success message
         */
        assertUpdated(response, message = 'updated successfully') {
            expect(response.statusCode).toBe(200);
            expect(response.body).toHaveProperty('message');
            expect(response.body.message.toLowerCase()).toContain(message.toLowerCase());
            expect(response.body).toHaveProperty('data');
        },

        /**
         * Assert successful deletion response
         * @param {Object} response - Supertest response
         * @param {string} message - Expected success message
         */
        assertDeleted(response, message = 'deleted successfully') {
            expect(response.statusCode).toBe(200);
            expect(response.body).toHaveProperty('message');
            expect(response.body.message.toLowerCase()).toContain(message.toLowerCase());
        },

        /**
         * Assert unauthorized response
         * @param {Object} response - Supertest response
         */
        assertUnauthorized(response) {
            expect(response.statusCode).toBe(401);
            expect(response.body).toHaveProperty('message', 'Unauthorized');
        },

        /**
         * Assert forbidden response
         * @param {Object} response - Supertest response
         */
        assertForbidden(response) {
            expect(response.statusCode).toBe(403);
            expect(response.body).toHaveProperty('message', 'Access denied. Admin role required.');
        },

        /**
         * Assert not found response
         * @param {Object} response - Supertest response
         * @param {string} resource - Resource name (e.g., 'User', 'Product')
         */
        assertNotFound(response, resource = 'Resource') {
            expect(response.statusCode).toBe(404);
            expect(response.body).toHaveProperty('message');
            expect(response.body.message.toLowerCase()).toContain('not found');
        },

        /**
         * Assert bad request response
         * @param {Object} response - Supertest response
         */
        assertBadRequest(response) {
            expect(response.statusCode).toBe(400);
            expect(response.body).toHaveProperty('message');
        },

        /**
         * Assert conflict response
         * @param {Object} response - Supertest response
         * @param {string} message - Expected conflict message
         */
        assertConflict(response, message = 'already exists') {
            expect(response.statusCode).toBe(409);
            expect(response.body).toHaveProperty('message');
            expect(response.body.message.toLowerCase()).toContain(message.toLowerCase());
        },

        /**
         * Assert server error response
         * @param {Object} response - Supertest response
         */
        assertServerError(response) {
            expect(response.statusCode).toBe(500);
            expect(response.body).toHaveProperty('message');
        },

        /**
         * Assert validation error response
         * @param {Object} response - Supertest response
         * @param {Array} expectedFields - Array of expected error field names
         */
        assertValidationError(response, expectedFields = []) {
            expect(response.statusCode).toBe(400);
            expect(response.body).toHaveProperty('errors');

            if (expectedFields.length > 0) {
                const messages = (response.body.errors || []).map(e => e.msg);
                expectedFields.forEach(field => {
                    expect(messages).toEqual(
                        expect.arrayContaining([
                            expect.stringContaining(field)
                        ])
                    );
                });
            }
        }
    };

    /**
     * Mock implementations for external services
     */
    static mocks = {
        /**
         * ImageKit mock implementation
         */
        imageKit: {
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
        },

        /**
         * Redis mock implementation
         */
        redis: {
            set: jest.fn().mockResolvedValue('OK'),
            get: jest.fn().mockResolvedValue(null),
            del: jest.fn().mockResolvedValue(1),
            on: jest.fn()
        }
    };

    /**
     * Generate unique identifiers for test data
     * @param {string} prefix - Prefix for the identifier
     * @returns {string} Unique identifier
     */
    static generateUniqueId(prefix = 'test') {
        const timestamp = Date.now();
        const random = Math.random().toString(36).substring(2, 8);
        return `${prefix}-${timestamp}-${random}`;
    }

    /**
     * Wait for a specified amount of time (useful for async operations)
     * @param {number} ms - Milliseconds to wait
     * @returns {Promise} Promise that resolves after the specified time
     */
    static async wait(ms = 100) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }

    /**
     * Clean up test data (useful for cleanup in afterEach hooks)
     * @param {Array} models - Array of Mongoose models to clean
     */
    static async cleanupTestData(models = []) {
        for (const model of models) {
            try {
                await model.deleteMany({});
            } catch (error) {
                console.warn(`Failed to cleanup ${model.modelName}:`, error.message);
            }
        }
    }
}

module.exports = TestHelpers;
