/**
 * Mock implementation of Node's Assert module
 * Provides basic assertion functionality
 */
function assert(value, message) {
  if (!value) {
    throw new Error(message || 'Assertion failed');
  }
}

assert.equal = (actual, expected, message) => {
  if (actual != expected) {
    throw new Error(message || `Expected ${actual} to equal ${expected}`);
  }
};

assert.strictEqual = (actual, expected, message) => {
  if (actual !== expected) {
    throw new Error(message || `Expected ${actual} to strictly equal ${expected}`);
  }
};

assert.deepEqual = (actual, expected, message) => {
  if (JSON.stringify(actual) !== JSON.stringify(expected)) {
    throw new Error(message || `Expected ${actual} to deeply equal ${expected}`);
  }
};

assert.ok = (value, message) => {
  if (!value) {
    throw new Error(message || 'Expected value to be truthy');
  }
};

module.exports = assert; 