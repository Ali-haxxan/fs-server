//'use strict'

const apiPath = process.env.API_ROOT;
const leadRoute = require('./leadRoute');
const leadStatusRoute = require('./leadStatusRoute');

exports.registerLeadRoutes = (app, apiPath) => {
    const rootPathForModule = `${apiPath}/crm`

    // localhost://api/1.0.0/crm
    app.use(`${rootPathForModule}`, leadRoute);
    app.use(`${rootPathForModule}`, leadStatusRoute);
}