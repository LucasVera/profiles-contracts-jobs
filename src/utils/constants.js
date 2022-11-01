const ContractErrors = Object.freeze({
  NOT_FOUND: 'Contract not found.',
  CONTRACT_NOT_FOR_PROFILE: 'Contract is not for your profile.',
});
const ContractStatuses = Object.freeze({
  TERMINATED: 'terminated',
  IN_PROGRESS: 'in_progress',
  NEW: 'new',
});


const ProfileErrors = Object.freeze({
  NOT_CLIENT: 'Profile is not a client.',
  NOT_FOUND: 'Profile not found.',
  MAX_DEPOSIT_AMOUNT_EXCEEDED: 'Max deposit amount has been exceeded.',
});


const JobErrors = Object.freeze({
  NOT_FOUND: 'Job not found.',
  NOT_ENOUGH_BALANCE: 'Not enough balance to pay for job.',
});

module.exports = {
  JobErrors,
  ProfileErrors,
  ContractErrors,
  ContractStatuses,
};
