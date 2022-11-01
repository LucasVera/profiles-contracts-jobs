const AdminService = require('../services/AdminService');
const ProfileService = require('../services/ProfileService');

module.exports = {
  async getBestProfession (req, res, next) {
    // 1. query contracts
    // 2. include all paid jobs within time range, grouped by ContractId and summed by price
    // 3. include profiles of contracts that are contractor
    // 4. get jobs of resulting query
    // 5. sort by total price
    // 6. get contract with highest price
    // 7. get profession from contracts array -> profile
    try {
      const { start, end } = req.query;
      const paidContracts = await AdminService.getClientContractsWithPaidJobs(start, end);

      const sortedJobs = AdminService.getSortedJobs(paidContracts);
      const { ContractId: highestPayingContractId } = sortedJobs[0];
      const highestPayingContract = paidContracts.find(contract => contract.id === highestPayingContractId);

      const { profession: highestPayingProfession } = highestPayingContract.Contractor;

      res.send(highestPayingProfession);
    }
    catch (ex) {
      // Errors handled by middleware
      next(ex);
    }
  },

  async getBestClients (req, res, next) {
    // Similar to the "get best profession"
    // 1. query contracts
    // 2. include paid jobs summed by price
    // 3. get jobs of resulting query
    // 4. sort by total price
    // 5. get contract with highest price
    // 6. get clients of that contract, limited to 2
    //
    // (TODO): Requires more testing
    // (TODO): Better way to implement limit and fetch data (probably better to use raw sql query)
    try {
      const { start, end, limit } = req.query;
      const paidContracts = await AdminService.getSummedPaidJobs(start, end);

      const sortedJobs = AdminService.getSortedJobs(paidContracts);

      // console.log('highest paying', sortedJobs);

      const clients = AdminService.getClientsFromSortedJobsContracts(sortedJobs, paidContracts, limit);

      res.json(clients);
    }
    catch (ex) {
      // Errors handled by middleware
      next(ex);
    }
  }
};
