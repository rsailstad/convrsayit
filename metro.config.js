const { getDefaultConfig } = require('expo/metro-config');
const path = require('path');

const config = getDefaultConfig(__dirname);

// Mock Node.js modules
config.resolver.extraNodeModules = {
  ...config.resolver.extraNodeModules,
  net: path.resolve(__dirname, 'src/mocks/net.js'),
  tls: path.resolve(__dirname, 'src/mocks/tls.js'),
  fs: path.resolve(__dirname, 'src/mocks/fs.js'),
  stream: path.resolve(__dirname, 'src/mocks/stream.js'),
  crypto: path.resolve(__dirname, 'src/mocks/crypto.js'),
  http: path.resolve(__dirname, 'src/mocks/http.js'),
  https: path.resolve(__dirname, 'src/mocks/https.js'),
  os: path.resolve(__dirname, 'src/mocks/os.js'),
  url: path.resolve(__dirname, 'src/mocks/url.js'),
  path: path.resolve(__dirname, 'src/mocks/path.js'),
  zlib: path.resolve(__dirname, 'src/mocks/zlib.js'),
  events: path.resolve(__dirname, 'src/mocks/events.js'),
  buffer: path.resolve(__dirname, 'src/mocks/buffer.js'),
  util: path.resolve(__dirname, 'src/mocks/util.js'),
  assert: path.resolve(__dirname, 'src/mocks/assert.js'),
  child_process: path.resolve(__dirname, 'src/mocks/child_process.js'),
};

// Add additional module resolution
config.resolver.sourceExts = [...config.resolver.sourceExts, 'mjs', 'cjs'];

module.exports = config; 