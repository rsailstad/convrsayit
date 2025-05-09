/**
 * Mock implementation of Node's Stream module
 * Provides basic stream functionality for WebSocket compatibility
 */
const EventEmitter = require('./events');

/**
 * Base Stream class that extends EventEmitter
 */
class Stream extends EventEmitter {
  /**
   * Mock pipe method
   * @returns {Stream} Returns this for chaining
   */
  pipe() {
    return this;
  }
}

module.exports = {
  Stream,
  Readable: Stream,
  Writable: Stream,
  Duplex: Stream,
  Transform: Stream,
  PassThrough: Stream,
}; 