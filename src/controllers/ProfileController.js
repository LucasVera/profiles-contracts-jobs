const ProfileService = require('../services/ProfileService');
const JobService = require('../services/JobService');
const { getTotal } = require('../utils/array');
const { ValidationError } = require('../utils/errorHelper');
const { ProfileErrors } = require('../utils/constants');

module.exports = {
  async depositBalance (req, res, next) {
    try {
      const { userId: clientProfileId } = req.params;
      const { amount } = req.body;

      // get unpaid jobs but don't include contractor profiles in the query
      const unpaidJobs = await JobService.getUnpaidJobs(clientProfileId, false);

      const totalUnpaidByClient = getTotal(unpaidJobs, 'price');
      const maxAllowedToDeposit = totalUnpaidByClient * 0.25; // 25% of total unpaid
      if (amount >= maxAllowedToDeposit) throw new ValidationError(ProfileErrors.MAX_DEPOSIT_AMOUNT_EXCEEDED, 400, { amount });

      const clientProfile = await ProfileService.getProfileById(clientProfileId);

      await ProfileService.addBalance(clientProfile, amount);

      res.json({ success: true });
    }
    catch (ex) {
      // Errors handled by middleware
      next(ex);
    }
  },
};
