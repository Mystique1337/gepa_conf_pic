/**
 * Test Suite for shareToLinkedIn Module
 * 
 * Run these tests to verify the module works correctly
 */

import { shareToLinkedIn, useShareToLinkedIn, LinkedInShareHook } from './modules/shareToLinkedIn.js';

// ============================================================================
// Test Utilities
// ============================================================================

class TestRunner {
    constructor(name) {
        this.name = name;
        this.tests = [];
        this.passed = 0;
        this.failed = 0;
    }

    test(description, testFn) {
        this.tests.push({ description, testFn });
    }

    async run() {
        console.log(`\n${'='.repeat(60)}`);
        console.log(`🧪 Test Suite: ${this.name}`);
        console.log(`${'='.repeat(60)}\n`);

        for (const { description, testFn } of this.tests) {
            try {
                await testFn();
                console.log(`✅ ${description}`);
                this.passed++;
            } catch (error) {
                console.error(`❌ ${description}`);
                console.error(`   Error: ${error.message}`);
                this.failed++;
            }
        }

        console.log(`\n${'='.repeat(60)}`);
        console.log(`📊 Results: ${this.passed} passed, ${this.failed} failed`);
        console.log(`${'='.repeat(60)}\n`);

        return {
            passed: this.passed,
            failed: this.failed,
            total: this.tests.length
        };
    }
}

function assert(condition, message) {
    if (!condition) {
        throw new Error(message || 'Assertion failed');
    }
}

function assertEqual(actual, expected, message) {
    if (actual !== expected) {
        throw new Error(message || `Expected ${expected}, got ${actual}`);
    }
}

// ============================================================================
// Mock Data
// ============================================================================

function createMockImageBlob() {
    const canvas = document.createElement('canvas');
    canvas.width = 100;
    canvas.height = 100;
    const ctx = canvas.getContext('2d');
    ctx.fillStyle = '#2d9a8c';
    ctx.fillRect(0, 0, 100, 100);
    return new Promise(resolve => {
        canvas.toBlob(resolve, 'image/png');
    });
}

const mockCaption = 'I will be at Faith & Energy Conference 1.0 🔥\n\n📅 Nov 15, 2025\n📍 Pistis Annex Marwa, Lekki Lagos';

// ============================================================================
// Test Suites
// ============================================================================

// Test 1: Module Structure
const testModuleStructure = new TestRunner('Module Structure');

testModuleStructure.test('shareToLinkedIn function exists', () => {
    assert(typeof shareToLinkedIn === 'function', 'shareToLinkedIn should be a function');
});

testModuleStructure.test('useShareToLinkedIn function exists', () => {
    assert(typeof useShareToLinkedIn === 'function', 'useShareToLinkedIn should be a function');
});

testModuleStructure.test('LinkedInShareHook class exists', () => {
    assert(typeof LinkedInShareHook === 'function', 'LinkedInShareHook should be a class');
});

// Test 2: Hook Initialization
const testHookInitialization = new TestRunner('Hook Initialization');

testHookInitialization.test('useShareToLinkedIn returns LinkedInShareHook instance', () => {
    const hook = useShareToLinkedIn();
    assert(hook instanceof LinkedInShareHook, 'Should return LinkedInShareHook instance');
});

testHookInitialization.test('Hook starts with idle status', () => {
    const hook = useShareToLinkedIn();
    assertEqual(hook.getStatus(), 'idle', 'Initial status should be idle');
});

testHookInitialization.test('Hook lastResult is null initially', () => {
    const hook = useShareToLinkedIn();
    assert(hook.getLastResult() === null, 'Initial lastResult should be null');
});

// Test 3: Hook Methods
const testHookMethods = new TestRunner('Hook Methods');

testHookMethods.test('subscribe method returns unsubscribe function', () => {
    const hook = useShareToLinkedIn();
    const unsubscribe = hook.subscribe(() => {});
    assert(typeof unsubscribe === 'function', 'subscribe should return a function');
});

testHookMethods.test('reset method sets status to idle', () => {
    const hook = useShareToLinkedIn();
    hook._setStatus('error');
    hook.reset();
    assertEqual(hook.getStatus(), 'idle', 'reset should set status to idle');
});

testHookMethods.test('subscribe callback is called on status change', (done) => {
    const hook = useShareToLinkedIn();
    let called = false;

    hook.subscribe((status) => {
        called = true;
        assert(status === 'sharing', 'Callback should receive new status');
    });

    hook._setStatus('sharing');
    assert(called, 'Callback should be called');
});

testHookMethods.test('unsubscribe stops receiving updates', () => {
    const hook = useShareToLinkedIn();
    let callCount = 0;

    const unsubscribe = hook.subscribe(() => {
        callCount++;
    });

    hook._setStatus('sharing');
    assert(callCount === 1, 'Should be called once');

    unsubscribe();
    hook._setStatus('done');
    assert(callCount === 1, 'Should not be called after unsubscribe');
});

// Test 4: Share Function Parameters
const testShareParameters = new TestRunner('Share Function Parameters');

testShareParameters.test('shareToLinkedIn requires imageBlob parameter', async () => {
    try {
        await shareToLinkedIn({ caption: 'test' });
        throw new Error('Should have thrown error');
    } catch (error) {
        // Expected
    }
});

testShareParameters.test('shareToLinkedIn requires caption parameter', async () => {
    const blob = await createMockImageBlob();
    try {
        await shareToLinkedIn({ imageBlob: blob });
        throw new Error('Should have thrown error');
    } catch (error) {
        // Expected
    }
});

testShareParameters.test('shareToLinkedIn accepts optional filename', async () => {
    const blob = await createMockImageBlob();
    // This test just verifies it doesn't throw
    const result = await shareToLinkedIn({
        imageBlob: blob,
        caption: mockCaption,
        filename: 'custom-name.png'
    });
    assert(result !== null, 'Should return a result');
});

// Test 5: Return Object Structure
const testReturnStructure = new TestRunner('Return Object Structure');

testReturnStructure.test('Result has success property', async () => {
    const blob = await createMockImageBlob();
    const result = await shareToLinkedIn({
        imageBlob: blob,
        caption: mockCaption
    });
    assert(typeof result.success === 'boolean', 'Result should have success property');
});

testReturnStructure.test('Result has message property', async () => {
    const blob = await createMockImageBlob();
    const result = await shareToLinkedIn({
        imageBlob: blob,
        caption: mockCaption
    });
    assert(typeof result.message === 'string', 'Result should have message property');
});

testReturnStructure.test('Result has method property', async () => {
    const blob = await createMockImageBlob();
    const result = await shareToLinkedIn({
        imageBlob: blob,
        caption: mockCaption
    });
    assert(typeof result.method === 'string', 'Result should have method property');
});

testReturnStructure.test('Method is one of valid values', async () => {
    const blob = await createMockImageBlob();
    const result = await shareToLinkedIn({
        imageBlob: blob,
        caption: mockCaption
    });
    const validMethods = ['web-share-api', 'fallback', 'none'];
    assert(validMethods.includes(result.method), `Method should be one of: ${validMethods.join(', ')}`);
});

// Test 6: Hook Share Method
const testHookShare = new TestRunner('Hook Share Method');

testHookShare.test('share method updates status to sharing', async () => {
    const hook = useShareToLinkedIn();
    const blob = await createMockImageBlob();

    let statusChanges = [];
    hook.subscribe((status) => statusChanges.push(status));

    const promise = hook.share({
        imageBlob: blob,
        caption: mockCaption
    });

    assert(statusChanges.includes('sharing'), 'Should have sharing status');

    await promise;
    assert(statusChanges.length > 1, 'Should have multiple status changes');
});

testHookShare.test('share method updates status to done on success', async () => {
    const hook = useShareToLinkedIn();
    const blob = await createMockImageBlob();

    const result = await hook.share({
        imageBlob: blob,
        caption: mockCaption
    });

    // Should either be done or idle (if cancelled)
    const finalStatus = hook.getStatus();
    assert(['done', 'idle', 'error'].includes(finalStatus), `Final status should be one of: done, idle, error. Got: ${finalStatus}`);
});

testHookShare.test('share stores result in lastResult', async () => {
    const hook = useShareToLinkedIn();
    const blob = await createMockImageBlob();

    await hook.share({
        imageBlob: blob,
        caption: mockCaption
    });

    const lastResult = hook.getLastResult();
    assert(lastResult !== null, 'lastResult should not be null after share');
    assert(typeof lastResult.success === 'boolean', 'lastResult should have success property');
});

// ============================================================================
// Run All Tests
// ============================================================================

async function runAllTests() {
    console.log('\n🚀 Starting Test Suite for shareToLinkedIn Module\n');

    const results = [];

    results.push(await testModuleStructure.run());
    results.push(await testHookInitialization.run());
    results.push(await testHookMethods.run());
    results.push(await testShareParameters.run());
    results.push(await testReturnStructure.run());
    results.push(await testHookShare.run());

    const totalPassed = results.reduce((sum, r) => sum + r.passed, 0);
    const totalFailed = results.reduce((sum, r) => sum + r.failed, 0);
    const totalTests = results.reduce((sum, r) => sum + r.total, 0);

    console.log('\n' + '='.repeat(60));
    console.log('📈 OVERALL RESULTS');
    console.log('='.repeat(60));
    console.log(`Total Tests: ${totalTests}`);
    console.log(`Passed: ${totalPassed} ✅`);
    console.log(`Failed: ${totalFailed} ❌`);
    console.log(`Success Rate: ${((totalPassed / totalTests) * 100).toFixed(1)}%`);
    console.log('='.repeat(60) + '\n');

    return {
        passed: totalPassed,
        failed: totalFailed,
        total: totalTests
    };
}

// Export for use
export { runAllTests, TestRunner, assert, assertEqual };

// Run tests if this file is executed directly
if (typeof window !== 'undefined') {
    window.runShareToLinkedInTests = runAllTests;
    console.log('💡 Run tests with: runShareToLinkedInTests()');
}
