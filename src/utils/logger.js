const { inspect } = require('util');

/**
 * Logs a message. Can be expanded in the future for better observability
 * @param {string} msg - Message to log
 */
const logMessage = (msg) => {
  const msgToLog = typeof msg === 'string' ? msg : inspect(msg);
  console.log(new Date().toISOString(), msg);
};

module.exports = {
  logMessage
};
