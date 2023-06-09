//'use strict'

const apiPath = process.env.API_ROOT;
const leadRoute = require('./leadRoute');
const leadHistoryRoute = require('./leadHistoryRoute');
const leadStatusRoute = require('./leadStatusRoute');
const priorityRoute = require('./priorityRoute');
const reportRoute = require('./reportRoute');


exports.registerLeadRoutes = (app, apiPath) => {
    const rootPathForModule = `${apiPath}/crm`

    // localhost://api/1.0.0/crm
    app.use(`${rootPathForModule}`, leadRoute);
    app.use(`${rootPathForModule}`, leadHistoryRoute);
    app.use(`${rootPathForModule}`, leadStatusRoute);
    app.use(`${rootPathForModule}`, priorityRoute);
    app.use(`${rootPathForModule}`, reportRoute);
}