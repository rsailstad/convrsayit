// Mock Net module
module.exports = {
  connect: () => ({
    on: () => {},
    write: () => {},
    end: () => {},
  }),
  createServer: () => ({
    listen: () => {},
    on: () => {},
  }),
}; 