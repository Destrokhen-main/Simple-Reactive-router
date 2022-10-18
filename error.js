class error extends Error {
  constructor(message) {
    super(message);
    this.name = "sReact-router";
  }
}

const createError = function( message) {
  throw new error(message);
}

export default createError;