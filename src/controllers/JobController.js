const ProfileService = require("../services/ProfileService");
const JobService = require('../services/JobService');
const ContractService = require('../services/ContractService');
const { ValidationError } = require("../utils/errorHelper");
const { ProfileErrors, JobErrors, ContractErrors } = require("../utils/constants");
const { sequelize } = require("../model");

module.exports = {
  async getUnpaidJobs (req, res, next) {
    try {
      const profile = ProfileService.getProfileFromRequest(req);

      const jobs = await JobService.getUnpaidJobs(profile.id);

      res.json(jobs);
    }
    catch (ex) {
      // Errors handled by middleware
      next(ex);
    }
  },

  async payForJob (req, res, next) {
    // 1. validate profile is client
    // 2. get job along with contract
    // 3. validate client has enough balance for payment
    // 4. validate client and job's contract match
    // 5. substract amount from client's balance
    // 6. add amount to contractor's balance
    // 7. update job as paid
    const transaction = await sequelize.transaction();
    try {
      const clientProfile = ProfileService.getProfileFromRequest(req);
      const { job_id: jobId } = req.params;

      if (clientProfile.type !== 'client') throw new ValidationError(ProfileErrors.NOT_CLIENT, 400, { type: clientProfile.type });

      const job = await JobService.getJobById(jobId, true);
      if (!JobService.hasEnoughBalanceToPayJob(clientProfile, job)) throw new ValidationError(JobErrors.NOT_ENOUGH_BALANCE, 400, { jobId });

      const amountToPay = job.price;
      const clientId = job.Contract.ClientId;
      const contractorId = job.Contract.ContractorId;

      if (clientId !== clientProfile.id) throw new ValidationError(ContractErrors.CONTRACT_NOT_FOR_PROFILE, 403, { clientId });

      const contractorProfile = await ProfileService.getProfileById(contractorId);

      await ProfileService.transferAmount(clientProfile, contractorProfile, amountToPay, transaction);
      await JobService.setJobAsPaid(job.id, transaction);

      await transaction.commit();
      res.json({ success: true });
    }
    catch (ex) {
      await transaction.rollback();
      // Errors handled by middleware
      next(ex);
    }
  }
};
