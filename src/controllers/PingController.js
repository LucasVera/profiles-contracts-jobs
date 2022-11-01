const { ValidationError } = require("../utils/errorHelper");

module.exports = {
  ping (_req, res) {
    throw new ValidationError('test msg', 400, { ok: 0 });
  }
};
