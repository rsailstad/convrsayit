/**
 * Mock implementation of Node's Buffer module
 * Provides basic buffer functionality needed for WebSocket
 */
class Buffer {
  constructor(data) {
    this.data = data || '';
  }

  static from(data) {
    return new Buffer(data);
  }

  toString(encoding) {
    return this.data.toString();
  }

  static alloc(size) {
    return new Buffer('');
  }

  static isBuffer(obj) {
    return obj instanceof Buffer;
  }
}

module.exports = Buffer; 