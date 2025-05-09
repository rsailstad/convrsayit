/**
 * Mock implementation of Node's URL module
 * Provides basic URL parsing functionality
 */
class URL {
  constructor(url, base) {
    this.href = url;
    this.protocol = '';
    this.host = '';
    this.hostname = '';
    this.port = '';
    this.pathname = '';
    this.search = '';
    this.hash = '';
    this.origin = '';
  }

  toString() {
    return this.href;
  }
}

module.exports = {
  URL,
  parse: (url) => new URL(url),
  format: (url) => url.toString(),
  resolve: (from, to) => to,
}; 