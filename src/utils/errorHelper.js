const { inspect } = require('util');

class CustomError extends Error {
  errorType = 'Unknown';
  statusCode = 500;
  data = {};

  constructor (message, statusCode, data = {}) {
    super(message);
    this.name = this.constructor.name;
    this.message = message;
    this.statusCode = statusCode;
    this.data = data;

    // Fix so error shows appropriate call stack
    Error.captureStackTrace(this, this.constructor);
  }

  maskStackTrace = () => this.stack = '';
  maskData = () => this.data = {};

  toString = () => inspect({
    errorType: this.errorType,
    name: this.name,
    message: this.message,
    statusCode: this.statusCode,
    data: this.data,
  }, false, 4);
}

class ValidationError extends CustomError {
  errorType = 'Validation error';
}

class UnauthError extends CustomError {
  errorType = 'Unauth error';
}

const getStatusCodeAndMsg = (error) => {
  let errorMsg = '';
  let statusCode = 500;

  if (error instanceof CustomError) {
    // Avoid leaking server info to clients
    errorMsg = error.toString();
    statusCode = error.statusCode;
  }
  else if (error instanceof Error) {
    errorMsg = error.message;
  }
  else {
    errorMsg = `Unknown error occurred. ${inspect(error)}`;
  }
  console.log({ errorMsg, statusCode, msg: error.toString && error.toString(), inst: error instanceof CustomError });
  return { errorMsg, statusCode };
};

module.exports = {
  UnauthError,
  ValidationError,

  getStatusCodeAndMsg,
};
