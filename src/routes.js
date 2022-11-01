const PingController = require("./controllers/PingController");
const ContractController = require("./controllers/ContractController");
const JobController = require("./controllers/JobController");
const ProfileController = require("./controllers/ProfileController");
const AdminController = require("./controllers/AdminController");
const profileAuthMiddleware = require('./middleware/getProfile').getProfile;

const setApiRoutes = (app) => {
  // -------- General --------------
  app.get('/', PingController.ping);



  // -------- Contracts --------------
  app.get('/contracts/:id', profileAuthMiddleware, ContractController.getContractDetails);
  app.get('/contracts', profileAuthMiddleware, ContractController.getContractList);



  // -------- Jobs --------------
  app.get('/jobs/unpaid', profileAuthMiddleware, JobController.getUnpaidJobs);
  app.post('/jobs/:job_id/pay', profileAuthMiddleware, JobController.payForJob);



  // -------- Profile --------------
  app.post('/balances/deposit/:userId', ProfileController.depositBalance); // No auth for this?



  // -------- Admin --------------
  app.get('/admin/best-profession', AdminController.getBestProfession); // No auth for this?
  app.get('/admin/best-clients', AdminController.getBestClients); // No auth for this?
};

module.exports = {
  setApiRoutes
};
