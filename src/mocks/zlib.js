/**
 * Mock implementation of Node's Zlib module
 * Provides basic compression functionality needed for WebSocket
 */
const EventEmitter = require('./events');

class Zlib extends EventEmitter {
  constructor() {
    super();
    this.data = Buffer.from('');
  }

  write(data) {
    this.data = data;
    return true;
  }

  end() {
    this.emit('end');
    return this;
  }

  flush() {
    return this;
  }
}

module.exports = {
  createDeflate: () => new Zlib(),
  createInflate: () => new Zlib(),
  createDeflateRaw: () => new Zlib(),
  createInflateRaw: () => new Zlib(),
  createGzip: () => new Zlib(),
  createGunzip: () => new Zlib(),
  createBrotliCompress: () => new Zlib(),
  createBrotliDecompress: () => new Zlib(),
  // Constants
  Z_NO_FLUSH: 0,
  Z_PARTIAL_FLUSH: 1,
  Z_SYNC_FLUSH: 2,
  Z_FULL_FLUSH: 3,
  Z_FINISH: 4,
  Z_BLOCK: 5,
  Z_OK: 0,
  Z_STREAM_END: 1,
  Z_NEED_DICT: 2,
  Z_ERRNO: -1,
  Z_STREAM_ERROR: -2,
  Z_DATA_ERROR: -3,
  Z_MEM_ERROR: -4,
  Z_BUF_ERROR: -5,
  Z_VERSION_ERROR: -6,
}; 