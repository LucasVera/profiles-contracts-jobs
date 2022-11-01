const { getStatusCodeAndMsg } = require("../utils/errorHelper");
const { logMessage } = require("../utils/logger");

/**
 * Handler for errors within the application
 * @param {Error instance} error - Instance of error
 * @param {Request} _req - Request
 * @param {Response} res - Response
 * @param {Function} next - Next function
 * @returns error without alterations
 */
const errorHandler = (error, _req, res, next) => {

  logMessage(error);

  if (res.headersSent) return next();

  const { errorMsg, statusCode } = getStatusCodeAndMsg(error);

  res.status(statusCode).send(errorMsg);

  res.end();

  return error;
};

module.exports = errorHandler;
