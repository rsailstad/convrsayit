# Node.js Module Mocks

This directory contains mock implementations of Node.js core modules for React Native compatibility.

## Purpose

These mocks provide the minimum required functionality to support Node.js modules in React Native, particularly for the WebSocket implementation used by Expo's tunnel feature.

## Structure

- `events.js` - Event emitter implementation used by other mocks
- `net.js` - Mock for Node's net module
- `tls.js` - Mock for Node's tls module
- `stream.js` - Mock for Node's stream module
- `fs.js` - Mock for Node's filesystem module
- `http.js` - Mock for Node's HTTP module
- `https.js` - Mock for Node's HTTPS module (extends HTTP)
- `url.js` - Mock for Node's URL module

## Usage

These mocks are automatically used through Metro's module resolution system, configured in `metro.config.js`. They provide no-op implementations of Node.js core modules that aren't available in React Native.

## Dependencies

- `events.js` is used as a base for other mocks
- `http.js` is used by `https.js`
- Other mocks are independent unless explicitly documented

## Adding New Mocks

When adding new mocks:
1. Create a new file in this directory
2. Implement the minimum required functionality
3. Add the mock to `metro.config.js`
4. Document the mock in this README
5. Add JSDoc comments for better documentation

## Implementation Details

Each mock provides the minimum required functionality to support WebSocket operations in React Native. They are designed to be lightweight and maintainable, with proper error handling and event emission support where needed. 