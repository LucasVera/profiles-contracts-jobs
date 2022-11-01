const { Op } = require('sequelize');
const { Contract } = require('../model');
const { ContractErrors } = require('../utils/constants');
const { ValidationError } = require('../utils/errorHelper');

const getContractById = async (id) => {
  const contract = await Contract.findOne({ where: { id } });
  if (!contract || !contract.id) throw new ValidationError(ContractErrors.NOT_FOUND, 404, { id });

  return contract;
};

const getNonTerminatedContracts = async (profileId) => {
  const contracts = await Contract.findAll({
    where: {
      [Op.or]: [
        { ContractorId: profileId },
        { ClientId: profileId },
      ]
    },
  });

  if (!Array.isArray(contracts) || contracts.length <= 0) return [];

  return contracts;
};

const isContractForProfile = (contract, profile) => {
  try {
    const {
      ContractorId: contractorId,
      ClientId: clientId,
    } = contract;

    const {
      id: profileId
    } = profile;

    return (profileId === contractorId || clientId === profileId);

  } catch (error) {
    console.log('hi');
    throw error;
  }
};

module.exports = {
  getContractById,
  isContractForProfile,
  getNonTerminatedContracts,
};
