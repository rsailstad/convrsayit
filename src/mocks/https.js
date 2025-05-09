/**
 * Mock implementation of Node's HTTPS module
 * Extends HTTP functionality with SSL/TLS support
 */
const http = require('./http');

module.exports = {
  ...http,
  createServer: (options, requestListener) => {
    const server = http.createServer(requestListener);
    return server;
  },
  request: (options, callback) => {
    return http.request(options, callback);
  },
  get: (options, callback) => {
    return http.get(options, callback);
  },
}; 