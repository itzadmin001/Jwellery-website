// Simple verification script to test if our setup is working
const { execSync } = require('child_process');

console.log('🔍 Verifying test setup...\n');

try {
    // Test 1: Check if uuid is working
    console.log('✅ Testing UUID import...');
    const { v4: uuidv4 } = require('uuid');
    const testUuid = uuidv4();
    console.log(`   Generated UUID: ${testUuid}\n`);

    // Test 2: Check if Category model can be imported
    console.log('✅ Testing Category model import...');
    require('./src/Models/Category.model');
    console.log('   Category model imported successfully\n');

    // Test 3: Check if Category controller can be imported
    console.log('✅ Testing Category controller import...');
    require('./src/Controllars/Category.controllar');
    console.log('   Category controller imported successfully\n');

    // Test 4: Check if test setup file works
    console.log('✅ Testing jest setup file...');
    require('./tests/jest.setup');
    console.log('   Jest setup file loaded successfully\n');

    console.log('🎉 All imports are working correctly!');
    console.log('📝 You can now run your tests with:');
    console.log('   npm test tests/Category.testing.js');
    console.log('   or');
    console.log('   npm run test:category');

} catch (error) {
    console.error('❌ Error during verification:');
    console.error(error.message);
    console.error('\n🔧 Please check the error above and fix any issues.');
    process.exit(1);
}
