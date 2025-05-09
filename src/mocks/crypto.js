/**
 * Mock implementation of Node's Crypto module
 * Provides basic crypto functionality needed for WebSocket handshake
 */
class Hash {
  constructor() {
    this.data = '';
  }

  update(data) {
    this.data += data;
    return this;
  }

  digest(encoding) {
    // Return a mock hash that matches WebSocket's expected format
    return 'dGhlIHNhbXBsZSBub25jZQ==';
  }
}

class Hmac {
  constructor() {
    this.data = '';
  }

  update(data) {
    this.data += data;
    return this;
  }

  digest(encoding) {
    // Return a mock HMAC that matches WebSocket's expected format
    return 's3pPLMBiTxaQ9kYGzzhZRbK+xOo=';
  }
}

module.exports = {
  createHash: () => new Hash(),
  createHmac: () => new Hmac(),
  randomBytes: (size) => Buffer.from('mock-random-bytes'),
  createCipheriv: () => ({
    update: () => Buffer.from(''),
    final: () => Buffer.from(''),
  }),
  createDecipheriv: () => ({
    update: () => Buffer.from(''),
    final: () => Buffer.from(''),
  }),
  // Constants needed for WebSocket
  constants: {
    RSA_PKCS1_OAEP_PADDING: 4,
  },
}; 