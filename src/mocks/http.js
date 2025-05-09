/**
 * Mock implementation of Node's HTTP module
 * Provides basic HTTP server and client functionality for WebSocket compatibility
 */
const EventEmitter = require('./events');

class Server extends EventEmitter {
  constructor() {
    super();
    this.listeners = [];
  }

  listen() {
    return this;
  }

  on(event, listener) {
    super.on(event, listener);
    return this;
  }
}

class ClientRequest extends EventEmitter {
  constructor() {
    super();
    this.headers = {};
  }

  write() {
    return true;
  }

  end() {
    return this;
  }
}

class IncomingMessage extends EventEmitter {
  constructor() {
    super();
    this.headers = {};
  }
}

module.exports = {
  Server,
  createServer: () => new Server(),
  request: () => new ClientRequest(),
  get: () => new ClientRequest(),
  IncomingMessage,
  ClientRequest,
}; 