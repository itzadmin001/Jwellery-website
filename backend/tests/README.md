# DeenDeyal Backend Testing Documentation

## Overview
This document describes the comprehensive Jest test suite for all API endpoints in the DeenDeyal backend. The tests ensure that all functionality works correctly without affecting the production database.

## Test Setup

### Database Isolation
- Uses **MongoDB Memory Server** for isolated testing
- No data is created in the original/production database
- Each test runs in a clean database environment
- Database is automatically cleaned after each test

### Mocked Dependencies
- **ImageKit**: All image upload/delete operations are mocked
- **Redis**: All caching operations are mocked
- **External APIs**: No real API calls are made during testing

## Complete Test Coverage

### 1. User Authentication & Management (`/auth/*`)
- ✅ User registration with validation
- ✅ User login with JWT token generation
- ✅ User profile retrieval
- ✅ User logout functionality
- ✅ Address management (GET/POST)
- ✅ Authentication middleware testing
- ✅ Password hashing and validation
- ✅ Role-based access control

### 2. Category Management (`/category/*`)
- ✅ Category Creation (`POST /category/create`)
- ✅ Successful category creation with admin authentication
- ✅ Category creation with image upload
- ✅ Validation of required fields (name, slug)
- ✅ Duplicate slug prevention
- ✅ Authentication and authorization checks
- ✅ Non-admin user access denial

- ✅ Category Retrieval (`GET /category/get`)
- ✅ Fetch all categories
- ✅ Fetch specific category by ID
- ✅ Handle non-existent category (404)
- ✅ Handle invalid ObjectId gracefully
- ✅ Public access (no authentication required)

- ✅ Category Update (`PUT /category/update/:id`)
- ✅ Successful category update with admin authentication
- ✅ Update with new image upload
- ✅ Subcategories merging (adds new ones to existing)
- ✅ Slug conflict prevention
- ✅ Handle non-existent category (404)
- ✅ Authentication and authorization checks

- ✅ Category Status Update (`PATCH /category/update-status`)
- ✅ Toggle status from true to false
- ✅ Toggle status from false to true
- ✅ Required parameters validation
- ✅ Handle non-existent category (404)
- ✅ Authentication and authorization checks

- ✅ Category Deletion (`DELETE /category/delete`)
- ✅ Successful category deletion with admin authentication
- ✅ Image cleanup from ImageKit (mocked)
- ✅ Required ID validation
- ✅ Handle non-existent category (404)
- ✅ Authentication and authorization checks
- ✅ Invalid ObjectId handling

### 3. Product Management (`/products/*`)
- ✅ Product Creation (`POST /products/create`)
  - ✅ Successful creation with admin authentication
  - ✅ Product creation with image upload
  - ✅ Required field validation
  - ✅ Duplicate slug prevention
  - ✅ Authentication and authorization checks

- ✅ Product Retrieval (`GET /products/get`)
  - ✅ Fetch all products
  - ✅ Fetch specific product by ID/slug/category
  - ✅ Handle non-existent products
  - ✅ Category-based filtering
  - ✅ Public access verification

- ✅ Product Update (`PUT /products/update/:id`)
  - ✅ Successful updates with admin authentication
  - ✅ Image update functionality
  - ✅ Slug conflict prevention
  - ✅ Error handling for missing products

- ✅ Product Status Update (`PATCH /products/update-status`)
  - ✅ Status toggle functionality
  - ✅ Parameter validation
  - ✅ Authentication requirements

- ✅ Product Deletion (`DELETE /products/delete`)
  - ✅ Successful deletion with cleanup
  - ✅ Image deletion from ImageKit (mocked)
  - ✅ Error handling and validation

### 4. Shopping Cart Operations (`/cart/*`)
- ✅ Cart Item Creation (`POST /cart/create`)
  - ✅ Successful cart item creation
  - ✅ Price calculation (discount vs regular price)
  - ✅ Quantity validation and defaults
  - ✅ Product existence validation

- ✅ Cart Retrieval (`GET /cart/get`)
  - ✅ Fetch all cart items for user
  - ✅ Fetch specific cart item by ID
  - ✅ Handle empty cart scenarios
  - ✅ User-specific cart isolation

- ✅ Cart Update (`PATCH /cart/update/:id`)
  - ✅ Quantity updates with total recalculation
  - ✅ Validation for quantity values
  - ✅ Error handling for invalid updates

- ✅ Cart Deletion (`DELETE /cart/delete`)
  - ✅ Delete specific cart items
  - ✅ Delete all cart items
  - ✅ Error handling for non-existent items

### 5. Order Management (`/orders/*`)
- ✅ Order Creation (`POST /orders/create`)
  - ✅ Successful order creation with authentication
  - ✅ Order item validation
  - ✅ Shipping address validation
  - ✅ Total amount calculation

- ✅ Order Retrieval (`GET /orders/get`)
  - ✅ Fetch all orders for user
  - ✅ Fetch specific order by ID
  - ✅ User-specific order isolation
  - ✅ Admin access to all orders

- ✅ Order Status Update (`PATCH /orders/update-status`)
  - ✅ Status updates with admin authentication
  - ✅ Status enum validation
  - ✅ Order lifecycle management

- ✅ Order Deletion (`DELETE /orders/delete`)
  - ✅ Admin-only order deletion
  - ✅ Error handling for non-existent orders

### 6. Payment Processing (`/payment/*`)
- ✅ Payment Order Creation (`POST /payment/create`)
  - ✅ Razorpay order creation (mocked)
  - ✅ Amount and currency validation
  - ✅ Order association
  - ✅ Authentication requirements

- ✅ Payment Verification (`POST /payment/verify`)
  - ✅ Payment signature verification
  - ✅ Payment status updates
  - ✅ Razorpay integration (mocked)
  - ✅ Error handling for invalid signatures

- ✅ Payment Retrieval (`GET /payment/get`)
  - ✅ Fetch user payments
  - ✅ Fetch specific payment by ID
  - ✅ Admin access to all payments
  - ✅ Payment history tracking

- ✅ Payment Status Update (`PATCH /payment/update-status`)
  - ✅ Admin-only status updates
  - ✅ Status enum validation
  - ✅ Payment lifecycle management

- ✅ Payment Deletion (`DELETE /payment/delete`)
  - ✅ Admin-only payment deletion
  - ✅ Error handling and validation

### 7. Model Validation Tests
- ✅ All model validation tests for each entity
- ✅ Default value testing
- ✅ Required field validation
- ✅ Data type validation
- ✅ Constraint validation (maxLength, min values, enums)

### 8. Integration Tests
- ✅ Complete CRUD lifecycle for all entities
- ✅ Cross-entity relationships testing
- ✅ End-to-end workflow validation
- ✅ Multiple entity handling
- ✅ Complex business logic testing

## Authentication Setup

### Test Users
The test suite creates two types of users:

1. **Admin User**
   - Email: admin@test.com
   - Role: admin
   - Can perform all category operations

2. **Regular User**
   - Email: user@test.com
   - Role: user
   - Cannot perform admin-only operations

### JWT Tokens
- Tokens are generated for testing purposes
- Uses test JWT secret
- Valid for 1 day during tests

## Running the Tests

### Run All Tests
```bash
npm test                    # Run all test files
npm run test:all           # Run with custom test runner (recommended)
```

### Run Specific Test Suites
```bash
npm run test:user          # User authentication tests
npm run test:category      # Category management tests
npm run test:product       # Product management tests
npm run test:cart          # Shopping cart tests
npm run test:order         # Order management tests
npm run test:payment       # Payment processing tests
```

### Run Tests with Coverage
```bash
npm run test:coverage      # Generate coverage report
```

### Run Tests in Watch Mode
```bash
npm run test:watch         # Watch mode for development
```

### Run Tests for CI/CD
```bash
npm run test:ci           # Optimized for CI environments
```

### Custom Test Runner
```bash
node tests/runAllTests.js                    # Run all tests with detailed reporting
node tests/runAllTests.js --help            # Show help and options
node tests/runAllTests.js --list            # List available test suites
node tests/runAllTests.js -s "User Authentication & Management"  # Run specific suite
node tests/runAllTests.js --coverage        # Run with coverage
```

## Test Environment Variables

The following environment variables are set for testing:
- `NODE_ENV=test`
- `JWT_SECRET=testsecret`
- `IMAGEKIT_PUBLIC_KEY=test_public_key`
- `IMAGEKIT_PRIVATE_KEY=test_private_key`
- `IMAGEKIT_URL_ENGPOINT=https://mock-imagekit-url.com`

## Mock Implementations

### ImageKit Mock
```javascript
jest.mock('imagekit', () => {
    return jest.fn().mockImplementation(() => ({
        upload: jest.fn().mockResolvedValue({
            url: 'https://mock-imagekit-url.com/test-image.jpg',
            fileId: 'mock-file-id-123'
        }),
        deleteFile: jest.fn().mockResolvedValue({ success: true }),
        listFiles: jest.fn().mockResolvedValue([...])
    }));
});
```

### Redis Mock
```javascript
jest.mock('../Db/Redis', () => ({
    set: jest.fn().mockResolvedValue('OK'),
    get: jest.fn().mockResolvedValue(null),
    del: jest.fn().mockResolvedValue(1),
    on: jest.fn(),
}));
```

### Razorpay Mock
```javascript
jest.mock('razorpay', () => {
    return jest.fn().mockImplementation(() => ({
        orders: {
            create: jest.fn().mockResolvedValue({
                id: 'order_mock_id',
                amount: 100000,
                currency: 'INR'
            })
        },
        payments: {
            fetch: jest.fn().mockResolvedValue({
                id: 'pay_mock_id',
                status: 'captured'
            })
        }
    }));
});
```

## Test Data Safety

### No Production Data Impact
- All tests use MongoDB Memory Server
- No connections to production database
- All test data is automatically cleaned up
- Mocked external services prevent real API calls
- No real payments or orders are processed
- No real images are uploaded to ImageKit

### Data Cleanup
- Database is dropped after all tests complete
- Collections are cleared after each test
- No persistent test data remains
- Automatic cleanup of test artifacts

## Error Handling Tests

The test suite covers various error scenarios:
- Invalid authentication tokens
- Missing required fields
- Duplicate data conflicts
- Non-existent resource access
- Invalid ObjectId formats
- Server errors and exceptions

## Performance Considerations

- Tests run in parallel where possible
- Memory database for fast execution
- Mocked external dependencies for speed
- Efficient test data setup and teardown

## Maintenance

### Adding New Tests
1. Follow the existing test structure
2. Use the helper functions for user creation
3. Mock any new external dependencies
4. Ensure proper cleanup

### Updating Tests
1. Update tests when API changes
2. Maintain backward compatibility where possible
3. Update documentation accordingly

## Troubleshooting

### Common Issues
1. **MongoDB Memory Server fails to start**
   - Ensure sufficient memory available
   - Check Node.js version compatibility

2. **Tests timeout**
   - Increase Jest timeout in configuration
   - Check for hanging promises

3. **Authentication failures**
   - Verify JWT_SECRET is set correctly
   - Check token generation logic

### Debug Mode
Add `--verbose` flag to see detailed test output:
```bash
npm test -- --verbose tests/Category.testing.js
```
