const { Profile, Contract, sequelize } = require('../model');
const { ProfileErrors } = require('../utils/constants');
const { ValidationError } = require('../utils/errorHelper');

const getProfileFromRequest = (req) => req.profile;

const getProfileById = async (id) => {
  const profile = await Profile.findOne({ where: { id } });
  if (!profile || !profile.id) throw new ValidationError(ProfileErrors.NOT_FOUND, 404, { id });

  return profile;
};

const getClientsByContractId = (contractId, limit = 2) => {
  return Profile.findAll({
    where: { type: 'client' }, // (TODO): put enum in constants file
    include: [{
      model: Contract,
      as: 'Client',
      where: { id: contractId },
      attributes: ['id'],
    }],
    limit,
    raw: true,
  });
};

const updateBalanceById = (id, balance, transaction) => {
  const queryObj = {
    where: { id, },
  };

  if (transaction) queryObj.transaction = transaction;

  return Profile.update({ balance }, queryObj);
};

const addBalance = (profile, amount, transaction) => {
  const newBalance = profile.balance + amount;
  return updateBalanceById(profile.id, newBalance, transaction);
};

const substractBalance = (profile, amount, transaction) => {
  const newBalance = profile.balance - amount;
  return updateBalanceById(profile.id, newBalance, transaction);
};

const transferAmount = async (fromProfile, toProfile, amount, transaction = null) => {
  await Promise.all([
    substractBalance(fromProfile, amount, transaction),
    addBalance(toProfile, amount, transaction)
  ]);
};

module.exports = {
  transferAmount,
  addBalance,
  getProfileById,
  getProfileFromRequest,
  getClientsByContractId,
};
