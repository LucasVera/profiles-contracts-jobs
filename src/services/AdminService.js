const { Op } = require('sequelize');
const { Job, Contract, Profile, sequelize } = require('../model');

const getSortedJobs = (paidContractsWithJobs) => {
  const jobs = [];
  paidContractsWithJobs.forEach(contract => jobs.push(...contract.Jobs));

  const sortedJobs = jobs.sort((jobA, jobB) => jobB.dataValues.total - jobA.dataValues.total);


  return sortedJobs;
};

const getSummedPaidJobs = (start, end, limit = 2) => {
  return Contract.findAll({
    group: ['Contract.id'],
    include: [
      {
        model: Job,
        where: {
          paid: 1,
          paymentDate: {
            [Op.between]: [
              start, end
            ]
          },
        },
        attributes: [
          'ContractId',
          [sequelize.fn('sum', sequelize.col('price')), 'total']
        ],
        // raw: true,
      },
      {
        model: Profile,
        as: 'Client',
        where: { type: 'client' }, // (TODO): put enum in constants file
        // limit,
      }
    ],
  });
};

const getClientsFromSortedJobsContracts = (sortedJobs, paidContracts, limit) => {
  const clients = [];
  for (let i = 0; i < sortedJobs.length; i++) {
    const job = sortedJobs[i];
    const { Client: client } = paidContracts.find(cont => cont.dataValues.id === job.ContractId) || [];
    if (clients.length < limit) clients.push(client);
    else return clients;
  }

  return clients;
};

const getClientContractsWithPaidJobs = (start, end) => {
  // (TODO): can be made re-usable along with "getSummedPaidJobs". Repeated code
  return Contract.findAll({
    group: ['Contract.id'],
    include: [
      {
        model: Profile,
        as: 'Contractor',
        where: { type: 'contractor' }
      },
      {
        model: Job,
        where: {
          paid: 1,
          paymentDate: {
            [Op.between]: [
              start, end
            ]
          },
        },
        attributes: [
          'ContractId',
          [sequelize.fn('sum', sequelize.col('price')), 'total']
        ],
        // raw: true,
      }
    ],
  });

  // return Profile.findAll({
  //   where: { type: 'client' },
  //   // raw: true,
  //   include: [{
  //     model: Contract,
  //     as: 'Client',
  //     // on: {}
  //     // where: {  }, // (TODO): seems that filtering through contract status is irrelevant
  //     include: [{
  //       model: Job,
  //       where: {
  //         paid: 1,
  //         paymentDate: {
  //           [Op.between]: [
  //             start, end
  //           ]
  //         }
  //       }
  //     }]
  //   }]
  // });

  // return Job.findAll({
  //   where: {
  //     paid: 1,
  //     paymentDate: {
  //       [Op.between]: [
  //         start, end
  //       ]
  //     }
  //   },
  //   include: [{
  //     model: Contract,
  //     // as: 'Client',
  //     // where: {  }, // (TODO): seems that filtering through contract status is irrelevant
  //     include: [{
  //       model: Profile,
  //       where: { type: 'client' }
  //     }]
  //   }]
  // });

};

module.exports = {
  getSortedJobs,
  getSummedPaidJobs,
  getClientContractsWithPaidJobs,
  getClientsFromSortedJobsContracts,
};
