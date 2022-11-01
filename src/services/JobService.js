const { Op } = require('sequelize');
const { Job, Contract } = require('../model');
const { ContractStatuses, JobErrors } = require('../utils/constants');
const { ValidationError } = require('../utils/errorHelper');

const getJobById = async (id, includeContract = false) => {
  const queryObj = {
    where: { id },
  };

  if (includeContract) queryObj.include = [{ model: Contract }];

  const job = await Job.findOne(queryObj);

  if (!job || !job.id) throw new ValidationError(JobErrors.NOT_FOUND, 404, { id });

  return job;
};

const hasEnoughBalanceToPayJob = (profile, job) => profile.balance >= job.price;

const getUnpaidJobs = async (profileId, includeContractor = true) => {
  const queryOR = [
    { ClientId: profileId },
  ];

  if (includeContractor) queryOR.push({ ContractorId: profileId });

  const jobs = await Job.findAll({
    where: { paid: { [Op.is]: null } },
    include: [{
      model: Contract,
      where: {
        status: ContractStatuses.IN_PROGRESS,
        [Op.or]: queryOR,
      },
      attributes: [],
    }],
    raw: true,
  });

  return jobs;
};

const setJobAsPaid = (jobId, transaction = null) => {
  const queryObj = {
    where: { id: jobId }
  };

  if (transaction) queryObj.transaction = transaction;

  return Job.update({
    paid: 1,
    paymentDate: new Date()
  }, queryObj);
};

module.exports = {
  getJobById,
  setJobAsPaid,
  getUnpaidJobs,
  hasEnoughBalanceToPayJob,
};
