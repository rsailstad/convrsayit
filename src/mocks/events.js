/**
 * Mock implementation of Node's EventEmitter
 * Provides basic event handling functionality for other mocks
 */
class EventEmitter {
  constructor() {
    this.events = {};
  }

  /**
   * Register an event listener
   * @param {string} event - The event name
   * @param {Function} listener - The callback function
   * @returns {EventEmitter} - Returns this for chaining
   */
  on(event, listener) {
    if (!this.events[event]) {
      this.events[event] = [];
    }
    this.events[event].push(listener);
    return this;
  }

  /**
   * Emit an event
   * @param {string} event - The event name
   * @param {...any} args - Arguments to pass to listeners
   * @returns {EventEmitter} - Returns this for chaining
   */
  emit(event, ...args) {
    if (this.events[event]) {
      this.events[event].forEach(listener => listener(...args));
    }
    return this;
  }
}

module.exports = EventEmitter; 