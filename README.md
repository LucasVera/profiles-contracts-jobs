# Nodejs-express-sequelize API

This backend api involves building a Node.js/Express.js app that will serve a REST API. It's an excersice to manage Profiles-Contracts-Jobs.

## Data Models

> **All models are defined in src/model.js**

### Profile
A profile can be either a `client` or a `contractor`. 
clients create contracts with contractors. contractor does jobs for clients and get paid.
Each profile has a balance property.

### Contract
A contract between and client and a contractor.
Contracts have 3 statuses, `new`, `in_progress`, `terminated`. contracts are considered active only when in status `in_progress`
Contracts group jobs within them.

### Job
contractor get paid for jobs by clients under a certain contract.

## Getting Set Up

Install Node.js  

- Start by cloning this repository.
- In the repo root directory, run `npm install` to gather all dependencies.
- Next, `npm run seed` will seed the local SQLite database. **Warning: This will drop the database if it exists**. The database lives in a local file `database.sqlite3`.
- Then run `npm start` which should start both the server and the React client.
- In a web browser, access swagger docs by going to http://localhost:3001/docs

## Technical Notes

- The server is running with [nodemon](https://nodemon.io/) which will automatically restart for you when you modify and save a file.

- The database provider is SQLite, which will store data in a file local to your repository called `database.sqlite3`. The ORM [Sequelize](http://docs.sequelizejs.com/) is on top of it. You should only have to interact with Sequelize - **please spend some time reading sequelize documentation before starting the exercise.**

- To authenticate users use the `getProfile` middleware that is located under src/middleware/getProfile.js. users are authenticated by passing `profile_id` in the request header. after a user is authenticated his profile will be available under `req.profile`. make sure only users that are on the contract can access their contracts.
- The server is running on port 3001.

### Additional implementations
- Organized files and functionalities using a simple controller-services architecture
- Added Open API 3.0 spec along with a server that makes it easy to test the api. Simply start the server and access the documentation on http://localhost:3001/docs

## Missing nice-to-haves
Due to time constraints, the following are nice-to-haves that the project is missing (but a nice project should have)
- Unit/integration tests
- CI/CD/Deployments
- Make some code reusable and better structured
- Improve requirements and clarify
- Some data may be prepared beforehand to improve some heavy queries

## APIs Implemented

Below is a list of the available endpoints. Also located in the swagger spec (after running the api, go to http://localhost:3001/docs in a web browser)

1. ***GET*** `/` - Healthcheck

2. ***GET*** `/contracts/:id` - returns the contract only if it belongs to the profile calling

3. ***GET*** `/contracts` - Returns a list of contracts belonging to a user (client or contractor), the list should only contain non terminated contracts.

4. ***GET*** `/jobs/unpaid` -  Get all unpaid jobs for a user (***either*** a client or contractor), for ***active contracts only***.

5. ***POST*** `/jobs/:job_id/pay` - Pay for a job, a client can only pay if his balance >= the amount to pay. The amount should be moved from the client's balance to the contractor balance.

6. ***POST*** `/balances/deposit/:userId` - Deposits money into the the the balance of a client, a client can't deposit more than 25% his total of jobs to pay. (at the deposit moment)

7. ***GET*** `/admin/best-profession?start=<date>&end=<date>` - Returns the profession that earned the most money (sum of jobs paid) for any contactor that worked in the query time range.

8. ***GET*** `/admin/best-clients?start=<date>&end=<date>&limit=<integer>` - returns the clients the paid the most for jobs in the query time period. limit query parameter should be applied, default limit is 2.
```
 [
    {
        "id": 1,
        "fullName": "Reece Moyer",
        "paid" : 100.3
    },
    {
        "id": 200,
        "fullName": "Debora Martin",
        "paid" : 99
    },
    {
        "id": 22,
        "fullName": "Debora Martin",
        "paid" : 21
    }
]
```
