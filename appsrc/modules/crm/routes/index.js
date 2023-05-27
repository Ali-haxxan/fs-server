//'use strict'

const apiPath = process.env.API_ROOT;
const leadRoute = require('./leadRoute');
const leadStatusRoute = require('./leadStatusRoute');
const periortyRoute = require('./periortyRoute');
const reportRoute = require('./reportRoute');


exports.registerLeadRoutes = (app, apiPath) => {
    const rootPathForModule = `${apiPath}/crm`

    // localhost://api/1.0.0/crm
    app.use(`${rootPathForModule}`, leadRoute);
    app.use(`${rootPathForModule}`, leadStatusRoute);
    app.use(`${rootPathForModule}`, periortyRoute);
    app.use(`${rootPathForModule}`, reportRoute);

}