const oasTools = require('@oas-tools/core')
const app = require('./app');
const oasConfig = require('./config/oas')

init();

async function init () {
  try {
    oasTools.initialize(app, oasConfig).then(() => {
      app.listen(3001, () => {
        console.log('Express App Listening on Port 3001. Documentation on "/docs"');
      });
    }).catch(ex => console.log('err', ex))
  } catch (error) {
    console.error(`An error occurred: ${JSON.stringify(error)}`);
    process.exit(1);
  }
}
