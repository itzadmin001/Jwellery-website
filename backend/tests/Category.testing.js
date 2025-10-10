const request = require('supertest');
const app = require('../src/index');
const Category = require('../src/Models/Category.model');
const User = require('../src/Models/User.model');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');

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
                filePath: '/category/test-image.jpg'
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

describe('Category API Tests', () => {
    let adminToken;
    let userToken;
    let adminUser;
    let regularUser;

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

    // Set up test users before all tests
    beforeAll(async () => {
        // Set environment variables for ImageKit (mocked)
        process.env.IMAGEKIT_PUBLIC_KEY = 'test_public_key';
        process.env.IMAGEKIT_PRIVATE_KEY = 'test_private_key';
        process.env.IMAGEKIT_URL_ENGPOINT = 'https://mock-imagekit-url.com';

        // Ensure JWT_SECRET is set
        if (!process.env.JWT_SECRET) {
            process.env.JWT_SECRET = 'testsecret';
        }
    });

    // Create fresh users before each test to avoid database cleanup issues
    beforeEach(async () => {
        // Create admin user
        const adminData = {
            name: 'Admin User',
            email: `admin-${Date.now()}@test.com`, // Unique email to avoid conflicts
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
            email: `user-${Date.now()}@test.com`, // Unique email to avoid conflicts
            password: 'UserPass@123',
            phone: 1234567890,
            gender: 'female',
        };
        const userResult = await createUserAndGetToken(userData, 'user');
        regularUser = userResult.user;
        userToken = userResult.token;
    });

    describe('POST /category/create', () => {
        const endpoint = '/category/create';
        const validCategoryData = {
            name: 'Electronics',
            slug: 'electronics',
            subcategories: ['Mobile', 'Laptop', 'TV']
        };

        it('should create category successfully with admin auth and valid data', async () => {
            const res = await request(app)
                .post(endpoint)
                .set('Cookie', `token=${adminToken}`)
                .send(validCategoryData);

            expect(res.statusCode).toBe(201);
            expect(res.body).toHaveProperty('message', 'Category created successfully');
            expect(res.body).toHaveProperty('data');
            expect(res.body.data).toHaveProperty('name', validCategoryData.name);
            expect(res.body.data).toHaveProperty('slug', validCategoryData.slug);
            expect(res.body.data).toHaveProperty('subcategories');
            expect(res.body.data.subcategories).toEqual(validCategoryData.subcategories);
        });

        it('should create category with image upload', async () => {
            const categoryWithImage = {
                name: 'Fashion',
                slug: 'fashion',
                subcategories: ['Clothing', 'Shoes']
            };

            const res = await request(app)
                .post(endpoint)
                .set('Cookie', `token=${adminToken}`)
                .field('name', categoryWithImage.name)
                .field('slug', categoryWithImage.slug)
                .field('subcategories[0]', categoryWithImage.subcategories[0])
                .field('subcategories[1]', categoryWithImage.subcategories[1])
                .attach('image', Buffer.from('fake image data'), 'test-image.jpg');

            expect(res.statusCode).toBe(201);
            expect(res.body).toHaveProperty('message', 'Category created successfully');
            expect(res.body.data).toHaveProperty('image');
            expect(res.body.data.image).toBe('https://mock-imagekit-url.com/test-image.jpg');
        });

        it('should return 400 when required fields are missing', async () => {
            const res = await request(app)
                .post(endpoint)
                .set('Cookie', `token=${adminToken}`)
                .send({});

            expect(res.statusCode).toBe(400);
            expect(res.body).toHaveProperty('message', 'Name and slug are required fields');
        });

        it('should return 409 when category with same slug already exists', async () => {
            // Create first category
            await request(app)
                .post(endpoint)
                .set('Cookie', `token=${adminToken}`)
                .send(validCategoryData);

            // Try to create another category with same slug
            const duplicateCategory = {
                name: 'Different Name',
                slug: validCategoryData.slug
            };

            const res = await request(app)
                .post(endpoint)
                .set('Cookie', `token=${adminToken}`)
                .send(duplicateCategory);

            expect(res.statusCode).toBe(409);
            expect(res.body).toHaveProperty('message', 'Category with this slug already exists');
        });

        it('should return 401 when no authentication token is provided', async () => {
            const res = await request(app)
                .post(endpoint)
                .send(validCategoryData);

            expect(res.statusCode).toBe(401);
            expect(res.body).toHaveProperty('message', 'Unauthorized');
        });

        it('should return 403 when non-admin user tries to create category', async () => {
            const res = await request(app)
                .post(endpoint)
                .set('Cookie', `token=${userToken}`)
                .send(validCategoryData);

            expect(res.statusCode).toBe(403);
            expect(res.body).toHaveProperty('message', 'Access denied. Admin role required.');
        });
    });

    describe('GET /category/get', () => {
        const endpoint = '/category/get';
        let testCategory;

        beforeEach(async () => {
            // Create a test category
            testCategory = await Category.create({
                name: 'Test Category',
                slug: 'test-category',
                subcategories: ['Sub1', 'Sub2'],
                image: 'https://test-image.com/test.jpg',
                status: true
            });
        });

        it('should get all categories successfully', async () => {
            const res = await request(app).get(endpoint);

            expect(res.statusCode).toBe(200);
            expect(res.body).toHaveProperty('message', 'Categories fetched successfully');
            expect(res.body).toHaveProperty('data');
            expect(res.body).toHaveProperty('count');
            expect(Array.isArray(res.body.data)).toBe(true);
            expect(res.body.count).toBeGreaterThan(0);
        });

        it('should get specific category by ID', async () => {
            const res = await request(app)
                .get(endpoint)
                .query({ id: testCategory._id.toString() });

            expect(res.statusCode).toBe(200);
            expect(res.body).toHaveProperty('message', 'Category fetched successfully');
            expect(res.body).toHaveProperty('data');
            expect(res.body.data).toHaveProperty('name', testCategory.name);
            expect(res.body.data).toHaveProperty('slug', testCategory.slug);
        });

        it('should return 404 when category with given ID is not found', async () => {
            const nonExistentId = '507f1f77bcf86cd799439011';
            const res = await request(app)
                .get(endpoint)
                .query({ id: nonExistentId });

            expect(res.statusCode).toBe(404);
            expect(res.body).toHaveProperty('message', 'Category not found');
        });

        it('should handle invalid ObjectId gracefully', async () => {
            const res = await request(app)
                .get(endpoint)
                .query({ id: 'invalid-id' });

            expect(res.statusCode).toBe(500);
            expect(res.body).toHaveProperty('message', 'Internal server error');
        });
    });

    describe('PUT /category/update/:id', () => {
        let testCategory;

        beforeEach(async () => {
            testCategory = await Category.create({
                name: 'Original Category',
                slug: 'original-category',
                subcategories: ['Original Sub'],
                status: true
            });
        });

        it('should update category successfully with admin auth', async () => {
            const updateData = {
                name: 'Updated Category',
                slug: 'updated-category',
                subcategories: ['Updated Sub1', 'Updated Sub2']
            };

            const res = await request(app)
                .put(`/category/update/${testCategory._id}`)
                .set('Cookie', `token=${adminToken}`)
                .send(updateData);

            expect(res.statusCode).toBe(200);
            expect(res.body).toHaveProperty('message', 'Category updated successfully');
            expect(res.body.data).toHaveProperty('name', updateData.name);
            expect(res.body.data).toHaveProperty('slug', updateData.slug);
            expect(res.body.data.subcategories).toEqual(['Original Sub', 'Updated Sub1', 'Updated Sub2']);
        });

        it('should update category with new image', async () => {
            const res = await request(app)
                .put(`/category/update/${testCategory._id}`)
                .set('Cookie', `token=${adminToken}`)
                .field('name', 'Updated with Image')
                .attach('image', Buffer.from('new image data'), 'new-image.jpg');

            expect(res.statusCode).toBe(200);
            expect(res.body).toHaveProperty('message', 'Category updated successfully');
            expect(res.body.data).toHaveProperty('image');
            expect(res.body.data.image).toBe('https://mock-imagekit-url.com/test-image.jpg');
        });

        it('should return 404 when category to update is not found', async () => {
            const nonExistentId = '507f1f77bcf86cd799439011';
            const res = await request(app)
                .put(`/category/update/${nonExistentId}`)
                .set('Cookie', `token=${adminToken}`)
                .send({ name: 'Updated Name' });

            expect(res.statusCode).toBe(404);
            expect(res.body).toHaveProperty('message', 'Category not found');
        });

        it('should return 409 when trying to update to existing slug', async () => {
            // Create another category
            const anotherCategory = await Category.create({
                name: 'Another Category',
                slug: 'another-category'
            });

            const res = await request(app)
                .put(`/category/update/${testCategory._id}`)
                .set('Cookie', `token=${adminToken}`)
                .send({ slug: 'another-category' });

            expect(res.statusCode).toBe(409);
            expect(res.body).toHaveProperty('message', 'Category with this slug already exists');
        });

        it('should return 401 when no authentication token is provided', async () => {
            const res = await request(app)
                .put(`/category/update/${testCategory._id}`)
                .send({ name: 'Updated Name' });

            expect(res.statusCode).toBe(401);
            expect(res.body).toHaveProperty('message', 'Unauthorized');
        });

        it('should return 403 when non-admin user tries to update category', async () => {
            const res = await request(app)
                .put(`/category/update/${testCategory._id}`)
                .set('Cookie', `token=${userToken}`)
                .send({ name: 'Updated Name' });

            expect(res.statusCode).toBe(403);
            expect(res.body).toHaveProperty('message', 'Access denied. Admin role required.');
        });
    });

    describe('PATCH /category/update-status', () => {
        const endpoint = '/category/update-status';
        let testCategory;

        beforeEach(async () => {
            testCategory = await Category.create({
                name: 'Status Test Category',
                slug: 'status-test-category',
                status: true
            });
        });

        it('should update category status successfully with admin auth', async () => {
            const res = await request(app)
                .patch(endpoint)
                .set('Cookie', `token=${adminToken}`)
                .query({
                    id: testCategory._id.toString(),
                    new_status: 'false'
                });

            expect(res.statusCode).toBe(200);
            expect(res.body).toHaveProperty('message', 'Category status updated successfully');
            expect(res.body.data).toHaveProperty('status', false);
        });

        it('should update status from false to true', async () => {
            // First set status to false
            await Category.findByIdAndUpdate(testCategory._id, { status: false });

            const res = await request(app)
                .patch(endpoint)
                .set('Cookie', `token=${adminToken}`)
                .query({
                    id: testCategory._id.toString(),
                    new_status: 'true'
                });

            expect(res.statusCode).toBe(200);
            expect(res.body).toHaveProperty('message', 'Category status updated successfully');
            expect(res.body.data).toHaveProperty('status', true);
        });

        it('should return 400 when required parameters are missing', async () => {
            const res = await request(app)
                .patch(endpoint)
                .set('Cookie', `token=${adminToken}`)
                .query({});

            expect(res.statusCode).toBe(400);
            expect(res.body).toHaveProperty('message', 'ID and new_status are required');
        });

        it('should return 404 when category is not found', async () => {
            const nonExistentId = '507f1f77bcf86cd799439011';
            const res = await request(app)
                .patch(endpoint)
                .set('Cookie', `token=${adminToken}`)
                .query({
                    id: nonExistentId,
                    new_status: 'false'
                });

            expect(res.statusCode).toBe(404);
            expect(res.body).toHaveProperty('message', 'Category not found');
        });

        it('should return 401 when no authentication token is provided', async () => {
            const res = await request(app)
                .patch(endpoint)
                .query({
                    id: testCategory._id.toString(),
                    new_status: 'false'
                });

            expect(res.statusCode).toBe(401);
            expect(res.body).toHaveProperty('message', 'Unauthorized');
        });

        it('should return 403 when non-admin user tries to update status', async () => {
            const res = await request(app)
                .patch(endpoint)
                .set('Cookie', `token=${userToken}`)
                .query({
                    id: testCategory._id.toString(),
                    new_status: 'false'
                });

            expect(res.statusCode).toBe(403);
            expect(res.body).toHaveProperty('message', 'Access denied. Admin role required.');
        });
    });

    describe('DELETE /category/delete', () => {
        const endpoint = '/category/delete';
        let testCategory;

        beforeEach(async () => {
            testCategory = await Category.create({
                name: 'Delete Test Category',
                slug: 'delete-test-category',
                image: 'https://mock-imagekit-url.com/test-image.jpg'
            });
        });

        it('should delete category successfully with admin auth', async () => {
            const res = await request(app)
                .delete(endpoint)
                .set('Cookie', `token=${adminToken}`)
                .query({ id: testCategory._id.toString() });

            expect(res.statusCode).toBe(200);
            expect(res.body).toHaveProperty('message', 'Category deleted successfully');

            // Verify category is actually deleted
            const deletedCategory = await Category.findById(testCategory._id);
            expect(deletedCategory).toBeNull();
        });

        it('should return 400 when category ID is not provided', async () => {
            const res = await request(app)
                .delete(endpoint)
                .set('Cookie', `token=${adminToken}`)
                .query({});

            expect(res.statusCode).toBe(400);
            expect(res.body).toHaveProperty('message', 'Category ID is required');
        });

        it('should return 404 when category to delete is not found', async () => {
            const nonExistentId = '507f1f77bcf86cd799439011';
            const res = await request(app)
                .delete(endpoint)
                .set('Cookie', `token=${adminToken}`)
                .query({ id: nonExistentId });

            expect(res.statusCode).toBe(404);
            expect(res.body).toHaveProperty('message', 'Category not found');
        });

        it('should return 401 when no authentication token is provided', async () => {
            const res = await request(app)
                .delete(endpoint)
                .query({ id: testCategory._id.toString() });

            expect(res.statusCode).toBe(401);
            expect(res.body).toHaveProperty('message', 'Unauthorized');
        });

        it('should return 403 when non-admin user tries to delete category', async () => {
            const res = await request(app)
                .delete(endpoint)
                .set('Cookie', `token=${userToken}`)
                .query({ id: testCategory._id.toString() });

            expect(res.statusCode).toBe(403);
            expect(res.body).toHaveProperty('message', 'Access denied. Admin role required.');
        });

        it('should handle invalid ObjectId gracefully', async () => {
            const res = await request(app)
                .delete(endpoint)
                .set('Cookie', `token=${adminToken}`)
                .query({ id: 'invalid-id' });

            expect(res.statusCode).toBe(500);
            expect(res.body).toHaveProperty('message', 'Internal server error');
        });
    });

    describe('Category Model Validation Tests', () => {
        it('should create category with valid data', async () => {
            const validCategoryData = {
                name: 'Valid Category',
                slug: 'valid-category',
                subcategories: ['Sub1', 'Sub2'],
                image: 'https://example.com/image.jpg',
                status: true
            };

            const category = await Category.create(validCategoryData);
            expect(category).toHaveProperty('_id');
            expect(category.name).toBe(validCategoryData.name);
            expect(category.slug).toBe(validCategoryData.slug);
            expect(category.subcategories).toEqual(validCategoryData.subcategories);
            expect(category.status).toBe(true);
        });

        it('should create category with default status when not provided', async () => {
            const categoryData = {
                name: 'Default Status Category',
                slug: 'default-status-category'
            };

            const category = await Category.create(categoryData);
            expect(category.status).toBe(true); // Default value
        });

        it('should handle empty subcategories array', async () => {
            const categoryData = {
                name: 'No Subcategories',
                slug: 'no-subcategories',
                subcategories: []
            };

            const category = await Category.create(categoryData);
            expect(category.subcategories).toEqual([]);
        });

        it('should respect maxLength constraints', async () => {
            const longName = 'a'.repeat(31); // Exceeds maxLength of 30
            const longSlug = 'b'.repeat(31); // Exceeds maxLength of 30
            const longImage = 'c'.repeat(101); // Exceeds maxLength of 100

            const categoryData = {
                name: longName,
                slug: longSlug,
                image: longImage
            };

            try {
                await Category.create(categoryData);
                // If we reach here, the validation didn't work as expected
                expect(true).toBe(false);
            } catch (error) {
                expect(error.name).toBe('ValidationError');
            }
        });
    });

    describe('Integration Tests', () => {
        it('should handle complete category lifecycle (create -> read -> update -> delete)', async () => {
            // Create
            const createRes = await request(app)
                .post('/category/create')
                .set('Cookie', `token=${adminToken}`)
                .send({
                    name: 'Lifecycle Test',
                    slug: 'lifecycle-test',
                    subcategories: ['Initial Sub']
                });

            expect(createRes.statusCode).toBe(201);
            const categoryId = createRes.body.data._id;

            // Read
            const readRes = await request(app)
                .get('/category/get')
                .query({ id: categoryId });

            expect(readRes.statusCode).toBe(200);
            expect(readRes.body.data.name).toBe('Lifecycle Test');

            // Update
            const updateRes = await request(app)
                .put(`/category/update/${categoryId}`)
                .set('Cookie', `token=${adminToken}`)
                .send({
                    name: 'Updated Lifecycle Test',
                    subcategories: ['Updated Sub']
                });

            expect(updateRes.statusCode).toBe(200);
            expect(updateRes.body.data.name).toBe('Updated Lifecycle Test');

            // Update Status
            const statusRes = await request(app)
                .patch('/category/update-status')
                .set('Cookie', `token=${adminToken}`)
                .query({
                    id: categoryId,
                    new_status: 'false'
                });

            expect(statusRes.statusCode).toBe(200);
            expect(statusRes.body.data.status).toBe(false);

            // Delete
            const deleteRes = await request(app)
                .delete('/category/delete')
                .set('Cookie', `token=${adminToken}`)
                .query({ id: categoryId });

            expect(deleteRes.statusCode).toBe(200);

            // Verify deletion
            const verifyRes = await request(app)
                .get('/category/get')
                .query({ id: categoryId });

            expect(verifyRes.statusCode).toBe(404);
        });

        it('should handle multiple categories creation and retrieval', async () => {
            const categories = [
                { name: 'Category 1', slug: 'category-1' },
                { name: 'Category 2', slug: 'category-2' },
                { name: 'Category 3', slug: 'category-3' }
            ];

            // Create multiple categories
            for (const category of categories) {
                const res = await request(app)
                    .post('/category/create')
                    .set('Cookie', `token=${adminToken}`)
                    .send(category);
                expect(res.statusCode).toBe(201);
            }

            // Get all categories
            const getAllRes = await request(app).get('/category/get');
            expect(getAllRes.statusCode).toBe(200);
            expect(getAllRes.body.count).toBeGreaterThanOrEqual(3);
        });
    });
});
