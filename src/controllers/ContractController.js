const ContractService = require("../services/ContractService");
const ProfileService = require("../services/ProfileService");

const { ContractErrors } = require("../utils/constants");
const { ValidationError } = require("../utils/errorHelper");

module.exports = {
  async getContractDetails (req, res, next) {
    try {
      const { id } = req.params;
      const profile = ProfileService.getProfileFromRequest(req);

      const contract = await ContractService.getContractById(id);

      const isForProfile = ContractService.isContractForProfile(contract, profile);
      if (!isForProfile) throw new ValidationError(
        ContractErrors.CONTRACT_NOT_FOR_PROFILE,
        403,
        { id }
      );

      res.json(contract);
    }
    catch (ex) {
      // Errors handled by middleware
      next(ex);
    }
  },

  async getContractList (req, res, next) {
    try {
      const profile = ProfileService.getProfileFromRequest(req);
      const contracts = await ContractService.getNonTerminatedContracts(profile.id);

      res.json(contracts);
    }
    catch (ex) {
      // Errors handled by middleware
      next(ex);
    }
  }
};
