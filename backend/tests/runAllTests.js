#!/usr/bin/env node

/**
 * Comprehensive Test Runner for DeenDeyal Backend
 * 
 * This script runs all test suites and provides detailed reporting
 * Usage: node tests/runAllTests.js [options]
 */

const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

// ANSI color codes for console output
const colors = {
    reset: '\x1b[0m',
    bright: '\x1b[1m',
    red: '\x1b[31m',
    green: '\x1b[32m',
    yellow: '\x1b[33m',
    blue: '\x1b[34m',
    magenta: '\x1b[35m',
    cyan: '\x1b[36m'
};

// Test configuration
const testConfig = {
    testFiles: [
        'tests/User.testing.js',
        'tests/Category.testing.js',
        'tests/Product.testing.js',
        'tests/Cart.testing.js',
        'tests/Order.testing.js',
        'tests/Payment.testing.js'
    ],
    testSuites: {
        'User Authentication & Management': 'tests/User.testing.js',
        'Category Management': 'tests/Category.testing.js',
        'Product Management': 'tests/Product.testing.js',
        'Shopping Cart Operations': 'tests/Cart.testing.js',
        'Order Management': 'tests/Order.testing.js',
        'Payment Processing': 'tests/Payment.testing.js'
    }
};

class TestRunner {
    constructor() {
        this.results = {
            total: 0,
            passed: 0,
            failed: 0,
            suites: {}
        };
        this.startTime = Date.now();
    }

    log(message, color = 'reset') {
        console.log(`${colors[color]}${message}${colors.reset}`);
    }

    logHeader(message) {
        const border = '='.repeat(60);
        this.log(border, 'cyan');
        this.log(`  ${message}`, 'cyan');
        this.log(border, 'cyan');
    }

    logSubHeader(message) {
        this.log(`\n${'-'.repeat(40)}`, 'blue');
        this.log(`  ${message}`, 'blue');
        this.log(`${'-'.repeat(40)}`, 'blue');
    }

    checkPrerequisites() {
        this.logSubHeader('Checking Prerequisites');

        // Check if test files exist
        const missingFiles = testConfig.testFiles.filter(file => !fs.existsSync(file));
        if (missingFiles.length > 0) {
            this.log(`❌ Missing test files:`, 'red');
            missingFiles.forEach(file => this.log(`   - ${file}`, 'red'));
            return false;
        }

        // Check if package.json has required dependencies
        const packageJson = JSON.parse(fs.readFileSync('package.json', 'utf8'));
        const requiredDeps = ['jest', 'supertest', 'mongodb-memory-server'];
        const missingDeps = requiredDeps.filter(dep =>
            !packageJson.devDependencies?.[dep] && !packageJson.dependencies?.[dep]
        );

        if (missingDeps.length > 0) {
            this.log(`❌ Missing dependencies:`, 'red');
            missingDeps.forEach(dep => this.log(`   - ${dep}`, 'red'));
            return false;
        }

        this.log('✅ All prerequisites met', 'green');
        return true;
    }

    runSingleTest(testFile, suiteName) {
        try {
            this.log(`\n🧪 Running: ${suiteName}`, 'yellow');
            this.log(`   File: ${testFile}`, 'yellow');

            const startTime = Date.now();
            const result = execSync(`npm test ${testFile}`, {
                encoding: 'utf8',
                env: { ...process.env, NODE_ENV: 'test' }
            });

            const duration = Date.now() - startTime;

            // Parse Jest output to extract test results
            const lines = result.split('\n');
            const testResults = this.parseJestOutput(lines);

            this.results.suites[suiteName] = {
                status: 'passed',
                duration: duration,
                tests: testResults.tests,
                passed: testResults.passed,
                failed: testResults.failed
            };

            this.results.total += testResults.tests;
            this.results.passed += testResults.passed;
            this.results.failed += testResults.failed;

            this.log(`✅ ${suiteName} - PASSED (${duration}ms)`, 'green');
            this.log(`   Tests: ${testResults.tests} | Passed: ${testResults.passed} | Failed: ${testResults.failed}`, 'green');

            return true;
        } catch (error) {
            const duration = Date.now() - Date.now();

            this.results.suites[suiteName] = {
                status: 'failed',
                duration: duration,
                error: error.message,
                tests: 0,
                passed: 0,
                failed: 1
            };

            this.results.total += 1;
            this.results.failed += 1;

            this.log(`❌ ${suiteName} - FAILED`, 'red');
            this.log(`   Error: ${error.message.split('\n')[0]}`, 'red');

            return false;
        }
    }

    parseJestOutput(lines) {
        let tests = 0, passed = 0, failed = 0;

        for (const line of lines) {
            // Look for Jest summary lines
            if (line.includes('Tests:')) {
                const match = line.match(/(\d+) passed.*?(\d+) total/);
                if (match) {
                    passed = parseInt(match[1]);
                    tests = parseInt(match[2]);
                    failed = tests - passed;
                }
            }
        }

        return { tests, passed, failed };
    }

    runAllTests() {
        this.logHeader('DeenDeyal Backend Test Suite');

        if (!this.checkPrerequisites()) {
            process.exit(1);
        }

        this.logSubHeader('Running Test Suites');

        let allPassed = true;

        for (const [suiteName, testFile] of Object.entries(testConfig.testSuites)) {
            const success = this.runSingleTest(testFile, suiteName);
            if (!success) {
                allPassed = false;
            }
        }

        this.generateReport();

        if (allPassed) {
            this.log('\n🎉 All tests passed!', 'green');
            process.exit(0);
        } else {
            this.log('\n💥 Some tests failed!', 'red');
            process.exit(1);
        }
    }

    runSpecificTest(testName) {
        this.logHeader(`Running Specific Test: ${testName}`);

        const testFile = testConfig.testSuites[testName];
        if (!testFile) {
            this.log(`❌ Test suite "${testName}" not found`, 'red');
            this.log('Available test suites:', 'yellow');
            Object.keys(testConfig.testSuites).forEach(name =>
                this.log(`  - ${name}`, 'yellow')
            );
            process.exit(1);
        }

        const success = this.runSingleTest(testFile, testName);
        this.generateReport();

        process.exit(success ? 0 : 1);
    }

    generateReport() {
        const duration = Date.now() - this.startTime;

        this.logSubHeader('Test Results Summary');

        // Overall statistics
        this.log(`Total Duration: ${duration}ms`, 'cyan');
        this.log(`Total Tests: ${this.results.total}`, 'cyan');
        this.log(`Passed: ${this.results.passed}`, 'green');
        this.log(`Failed: ${this.results.failed}`, this.results.failed > 0 ? 'red' : 'green');
        this.log(`Success Rate: ${((this.results.passed / this.results.total) * 100).toFixed(1)}%`,
            this.results.failed > 0 ? 'yellow' : 'green');

        // Individual suite results
        this.log('\nDetailed Results:', 'cyan');
        for (const [suiteName, result] of Object.entries(this.results.suites)) {
            const status = result.status === 'passed' ? '✅' : '❌';
            const color = result.status === 'passed' ? 'green' : 'red';

            this.log(`${status} ${suiteName} (${result.duration}ms)`, color);
            if (result.status === 'passed') {
                this.log(`   Tests: ${result.tests} | Passed: ${result.passed} | Failed: ${result.failed}`, color);
            } else {
                this.log(`   Error: ${result.error}`, color);
            }
        }

        // Generate JSON report
        this.generateJSONReport();
    }

    generateJSONReport() {
        const report = {
            timestamp: new Date().toISOString(),
            duration: Date.now() - this.startTime,
            summary: {
                total: this.results.total,
                passed: this.results.passed,
                failed: this.results.failed,
                successRate: ((this.results.passed / this.results.total) * 100).toFixed(1)
            },
            suites: this.results.suites
        };

        const reportPath = path.join(__dirname, 'test-report.json');
        fs.writeFileSync(reportPath, JSON.stringify(report, null, 2));
        this.log(`\n📊 Detailed report saved to: ${reportPath}`, 'cyan');
    }

    showHelp() {
        this.logHeader('DeenDeyal Backend Test Runner');

        this.log('Usage:', 'cyan');
        this.log('  node tests/runAllTests.js [options]', 'yellow');

        this.log('\nOptions:', 'cyan');
        this.log('  --help, -h              Show this help message', 'yellow');
        this.log('  --list, -l              List available test suites', 'yellow');
        this.log('  --suite <name>, -s      Run specific test suite', 'yellow');
        this.log('  --coverage, -c          Run tests with coverage report', 'yellow');

        this.log('\nExamples:', 'cyan');
        this.log('  node tests/runAllTests.js                    # Run all tests', 'yellow');
        this.log('  node tests/runAllTests.js -s "User Authentication & Management"  # Run specific suite', 'yellow');
        this.log('  node tests/runAllTests.js --coverage         # Run with coverage', 'yellow');
    }

    listTestSuites() {
        this.logHeader('Available Test Suites');

        Object.entries(testConfig.testSuites).forEach(([name, file], index) => {
            this.log(`${index + 1}. ${name}`, 'yellow');
            this.log(`   File: ${file}`, 'cyan');
        });
    }

    runWithCoverage() {
        this.logHeader('Running Tests with Coverage');

        try {
            const result = execSync('npm test -- --coverage', {
                encoding: 'utf8',
                env: { ...process.env, NODE_ENV: 'test' }
            });

            this.log('✅ Coverage report generated successfully', 'green');
            this.log('📊 Check coverage/ directory for detailed report', 'cyan');

        } catch (error) {
            this.log('❌ Coverage report generation failed', 'red');
            this.log(`Error: ${error.message}`, 'red');
            process.exit(1);
        }
    }
}

// Main execution
function main() {
    const args = process.argv.slice(2);
    const runner = new TestRunner();

    if (args.includes('--help') || args.includes('-h')) {
        runner.showHelp();
        return;
    }

    if (args.includes('--list') || args.includes('-l')) {
        runner.listTestSuites();
        return;
    }

    if (args.includes('--coverage') || args.includes('-c')) {
        runner.runWithCoverage();
        return;
    }

    const suiteIndex = args.findIndex(arg => arg === '--suite' || arg === '-s');
    if (suiteIndex !== -1 && args[suiteIndex + 1]) {
        const suiteName = args[suiteIndex + 1];
        runner.runSpecificTest(suiteName);
        return;
    }

    // Default: run all tests
    runner.runAllTests();
}

// Handle uncaught exceptions
process.on('uncaughtException', (error) => {
    console.error(`${colors.red}❌ Uncaught Exception: ${error.message}${colors.reset}`);
    process.exit(1);
});

process.on('unhandledRejection', (reason, promise) => {
    console.error(`${colors.red}❌ Unhandled Rejection at:${colors.reset}`, promise, `${colors.red}reason:${colors.reset}`, reason);
    process.exit(1);
});

if (require.main === module) {
    main();
}

module.exports = TestRunner;
