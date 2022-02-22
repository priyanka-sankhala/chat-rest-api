class ApiError extends Error {
  constructor(statusCode, message, isOperational = true, stack = '') {
    super(message);
    console.log("here in log "+this);
    this.statusCode = statusCode;
    this.isOperational = isOperational;
    if (stack) {
      this.stack = stack;
    } else {
      console.log("ApiError.js here");
      Error.captureStackTrace(this, this.constructor);
    }
  }
}

module.exports = ApiError;
