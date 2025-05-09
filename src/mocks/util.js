/**
 * Mock implementation of Node's Util module
 * Provides common utility functions needed for WebSocket
 */
module.exports = {
  inherits: (ctor, superCtor) => {
    ctor.super_ = superCtor;
    ctor.prototype = Object.create(superCtor.prototype, {
      constructor: {
        value: ctor,
        enumerable: false,
        writable: true,
        configurable: true
      }
    });
  },
  deprecate: (fn, msg) => fn,
  format: (fmt, ...args) => {
    return fmt.replace(/%s/g, () => args.shift());
  },
  debuglog: () => () => {},
  inspect: (obj) => JSON.stringify(obj),
  isArray: Array.isArray,
  isBoolean: (val) => typeof val === 'boolean',
  isNull: (val) => val === null,
  isNullOrUndefined: (val) => val === null || val === undefined,
  isNumber: (val) => typeof val === 'number',
  isString: (val) => typeof val === 'string',
  isSymbol: (val) => typeof val === 'symbol',
  isUndefined: (val) => val === undefined,
  isRegExp: (val) => val instanceof RegExp,
  isObject: (val) => val !== null && typeof val === 'object',
  isDate: (val) => val instanceof Date,
  isError: (val) => val instanceof Error,
  isFunction: (val) => typeof val === 'function',
  isPrimitive: (val) => {
    return val === null ||
           typeof val === 'boolean' ||
           typeof val === 'number' ||
           typeof val === 'string' ||
           typeof val === 'symbol' ||
           typeof val === 'undefined';
  },
}; 