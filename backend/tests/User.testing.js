const request = require('supertest');
const app = require('../src/index');
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

describe('/auth/register', () => {
    const endpoint = '/auth/register';
    const validPayload = {
        name: 'John Doe',
        email: 'john@example.com',
        password: 'Password@123',
        phone: 1234567890,
        gender: 'male',
    };

    it('creates user and returns 201 with token cookie', async () => {
        const res = await request(app).post(endpoint).send(validPayload);
        expect(res.statusCode).toBe(201);
        expect(res.body).toHaveProperty('message', 'User created successfully');
        expect(res.body).toHaveProperty('user');
        const setCookie = res.headers['set-cookie'] || [];
        expect(setCookie.join(';')).toMatch(/token=/);
    });

    it('rejects duplicate email with 400', async () => {
        await request(app).post(endpoint).send(validPayload);
        const res = await request(app).post(endpoint).send(validPayload);
        expect(res.statusCode).toBe(400);
        expect(res.body).toHaveProperty('message', 'User already exists');
    });

    it('validates required fields (400)', async () => {
        const res = await request(app).post(endpoint).send({});
        expect(res.statusCode).toBe(400);
        expect(res.body).toHaveProperty('errors');
        const messages = (res.body.errors || []).map(e => e.msg);
        expect(messages).toEqual(
            expect.arrayContaining([
                'Name is required',
                'Email is required',
                'Password is required',
                'Phone is required',
                'Gender is required',
            ])
        );
    });
});

describe('/auth/login', () => {
    const endpoint = '/auth/login';
    const validLoginPayload = {
        email: 'john@example.com',
        password: 'Password@123',
    };
    const validUserData = {
        name: 'John Doe',
        email: 'john@example.com',
        password: 'Password@123',
        phone: 1234567890,
        gender: 'male',
    };

    // Helper function to create a user for testing
    const createTestUser = async (userData = validUserData) => {
        const bcrypt = require('bcrypt');
        const hashedPassword = await bcrypt.hash(userData.password, 10);
        return await User.create({
            ...userData,
            password: hashedPassword
        });
    };

    it('logs in successfully with valid credentials and returns 200 with token cookie', async () => {
        await createTestUser();
        const res = await request(app).post(endpoint).send(validLoginPayload);

        expect(res.statusCode).toBe(200);
        expect(res.body).toHaveProperty('message', 'User logged in successfully');
        expect(res.body).toHaveProperty('user');
        const setCookie = res.headers['set-cookie'] || [];
        expect(setCookie.join(';')).toMatch(/token=/);
    });

    it('returns 400 when user is not found (invalid email)', async () => {
        const res = await request(app).post(endpoint).send({
            email: 'nonexistent@example.com',
            password: 'Password@123'
        });

        expect(res.statusCode).toBe(400);
        expect(res.body).toHaveProperty('message', 'User not found');
    });

    it('returns 400 when password is incorrect', async () => {
        await createTestUser();
        const res = await request(app).post(endpoint).send({
            email: validLoginPayload.email,
            password: 'WrongPassword@123'
        });

        expect(res.statusCode).toBe(400);
        expect(res.body).toHaveProperty('message', 'Invalid password');
    });

    it('validates required fields when both are missing (400)', async () => {
        const res = await request(app).post(endpoint).send({});

        expect(res.statusCode).toBe(400);
        expect(res.body).toHaveProperty('errors');
        const messages = (res.body.errors || []).map(e => e.msg);
        expect(messages).toEqual(
            expect.arrayContaining([
                'Email is required',
                'Password is required'
            ])
        );
    });
});

describe('/auth/me', () => {
    const endpoint = '/auth/me';
    const validUserData = {
        name: 'John Doe',
        email: 'john@example.com',
        password: 'Password@123',
        phone: 1234567890,
        gender: 'male',
    };

    // Helper function to create a user and get token
    const createUserAndGetToken = async (userData = validUserData) => {
        const bcrypt = require('bcrypt');
        const jwt = require('jsonwebtoken');

        const hashedPassword = await bcrypt.hash(userData.password, 10);
        const user = await User.create({
            ...userData,
            password: hashedPassword
        });

        const token = jwt.sign({
            id: user._id,
            role: user.role,
            email: user.email,
        }, process.env.JWT_SECRET, { expiresIn: "1d" });

        return { user, token };
    };

    it('returns user data successfully with valid token via cookie', async () => {
        const { user, token } = await createUserAndGetToken();

        const res = await request(app)
            .get(endpoint)
            .set('cookie', `token=${token}`);

        expect(res.statusCode).toBe(200);
        expect(res.body).toHaveProperty('message', 'User fetched successfully');
        expect(res.body).toHaveProperty('user');
        expect(res.body.user).toHaveProperty('name', user.name);
        expect(res.body.user).toHaveProperty('email', user.email);
        expect(res.body.user).not.toHaveProperty('password');
    });

    it('returns 401 when no token is provided', async () => {
        const res = await request(app).get(endpoint);

        expect(res.statusCode).toBe(401);
        expect(res.body).toHaveProperty('message', 'Unauthorized');
    });

    it('returns 401 when invalid token is provided via cookie', async () => {
        const res = await request(app)
            .get(endpoint)
            .set('cookie', 'token=invalid-token');

        expect(res.statusCode).toBe(401);
        expect(res.body).toHaveProperty('message', 'Unauthorized');
    });
});

describe('/auth/logout', () => {
    const endpoint = '/auth/logout';

    it('successfully logs out user and clears token cookie', async () => {
        const jwt = require('jsonwebtoken');

        // Create a valid token for testing
        const testToken = jwt.sign({
            id: '507f1f77bcf86cd799439011',
            role: 'user',
            email: 'test@example.com',
        }, process.env.JWT_SECRET, { expiresIn: "1d" });

        const res = await request(app)
            .get(endpoint)
            .set('cookie', `token=${testToken}`);

        expect(res.statusCode).toBe(200);
        expect(res.body).toHaveProperty('message', 'Logged out successfully');

        // Verify cookie was cleared
        const setCookie = res.headers['set-cookie'] || [];
        const clearCookie = setCookie.find(cookie => cookie.includes('token='));
        expect(clearCookie).toBeTruthy();
    });

    it('exhibits idempotent behavior - multiple logout calls return same result', async () => {
        const jwt = require('jsonwebtoken');

        // Create a valid token for testing
        const testToken = jwt.sign({
            id: '507f1f77bcf86cd799439011',
            role: 'user',
            email: 'test@example.com',
        }, process.env.JWT_SECRET, { expiresIn: "1d" });

        // First logout call
        const res1 = await request(app)
            .get(endpoint)
            .set('cookie', `token=${testToken}`);

        expect(res1.statusCode).toBe(200);
        expect(res1.body).toHaveProperty('message', 'Logged out successfully');

        // Second logout call (should be idempotent)
        const res2 = await request(app)
            .get(endpoint)
            .set('cookie', `token=${testToken}`);

        expect(res2.statusCode).toBe(200);
        expect(res2.body).toHaveProperty('message', 'Logged out successfully');

        // Both responses should be identical
        expect(res1.body).toEqual(res2.body);
        expect(res1.statusCode).toBe(res2.statusCode);
    });
});

describe('/auth/address', () => {
    const endpoint = '/auth/address';
    const validUserData = {
        name: 'John Doe',
        email: 'john@example.com',
        password: 'Password@123',
        phone: 1234567890,
        gender: 'male',
    };

    // Helper function to create a user and get token
    const createUserAndGetToken = async (userData = validUserData) => {
        const bcrypt = require('bcrypt');
        const jwt = require('jsonwebtoken');

        const hashedPassword = await bcrypt.hash(userData.password, 10);
        const user = await User.create({
            ...userData,
            password: hashedPassword
        });

        const token = jwt.sign({
            id: user._id,
            role: user.role,
            email: user.email,
        }, process.env.JWT_SECRET, { expiresIn: "1d" });

        return { user, token };
    };

    describe('GET /auth/address', () => {
        it('returns user addresses successfully with valid token', async () => {
            const { user, token } = await createUserAndGetToken();

            const res = await request(app)
                .get(endpoint)
                .set('cookie', `token=${token}`);

            expect(res.statusCode).toBe(200);
            expect(res.body).toHaveProperty('message', 'User address fetched successfully');
            expect(res.body).toHaveProperty('address');
            expect(Array.isArray(res.body.address)).toBe(true);
        });

        it('returns 401 when no token is provided', async () => {
            const res = await request(app).get(endpoint);

            expect(res.statusCode).toBe(401);
            expect(res.body).toHaveProperty('message', 'Unauthorized');
        });
    });

    describe('POST /auth/address', () => {
        const validAddressData = {
            street: '123 Main Street',
            city: 'New York',
            pincode: 10001,
            state: 'NY'
        };

        it('adds new address successfully with valid data and token', async () => {
            const { user, token } = await createUserAndGetToken();

            const res = await request(app)
                .post(endpoint)
                .set('cookie', `token=${token}`)
                .send(validAddressData);

            expect(res.statusCode).toBe(200);
            expect(res.body).toHaveProperty('message', 'User address added successfully');
            expect(res.body).toHaveProperty('address');
            expect(Array.isArray(res.body.address)).toBe(true);
            expect(res.body.address.length).toBe(1);
            expect(res.body.address[0]).toMatchObject(validAddressData);
        });

        it('validates required fields when missing', async () => {
            const { user, token } = await createUserAndGetToken();

            const res = await request(app)
                .post(endpoint)
                .set('cookie', `token=${token}`)
                .send({});

            expect(res.statusCode).toBe(400);
            expect(res.body).toHaveProperty('errors');
            const messages = (res.body.errors || []).map(e => e.msg);
            expect(messages).toEqual(
                expect.arrayContaining([
                    'Street is required',
                    'City is required',
                    'Pincode is required',
                    'State is required'
                ])
            );
        });

        it('returns 401 when no token is provided', async () => {
            const res = await request(app)
                .post(endpoint)
                .send(validAddressData);

            expect(res.statusCode).toBe(401);
            expect(res.body).toHaveProperty('message', 'Unauthorized');
        });
    });
});