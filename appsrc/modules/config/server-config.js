const apiPath = process.env.API_ROOT;

const fs         = require('fs');
const path       = require('path');
const http = require('http');
const socketIO = require('socket.io');
const express = require('express');
const bodyParser = require('body-parser');
var cors = require('cors')

// MIDDLEWARE
const setHeaders = require('../../middleware/set-header');
const errorHandler = require('../../middleware/error-handler');

// ROUTES
const securityRoutes  = require ('../security/routes');
const leadRoutes  = require ('../crm/routes');
const dashboardRoute  = require ('../dashboard/routes');

const swaggerUi = require('swagger-ui-express');
const swaggerDocument = require('../../../openapi.json');

const morgan = require('morgan');

/**
 * This class is the main App entry point.
 *
 * It sets up
 *  - DB connection to Mongo
 *  - Express middleware
 */
class App {
  /**
   * - Assigns Express app object to this
   *
   * @param  app An ExpressJS app object
   */
  constructor() {
    this.app = express();
    this.server = http.createServer(this.app);
    this.io = socketIO(this.server);
    this.MORGAN_FORMAT = process.env.MORGAN_FORMAT != undefined && process.env.MORGAN_FORMAT != null && process.env.MORGAN_FORMAT.length > 0 ? process.env.MORGAN_FORMAT : 'common' ;
    this.app.use(morgan(this.MORGAN_FORMAT));  
    this.app.use(bodyParser.json());
    this.app.use('/uploads/images', express.static(path.join('uploads', 'images')));
    this.app.use(setHeaders);
    this.registerRoutes();
    this.app.use(cors({
        origin: '*'
      }
    ));
    // this.app.options('*', cors());
    this.app.use(
      '/api-docs',
      swaggerUi.serve,
      swaggerUi.setup(swaggerDocument)
    );
    this.app.use(errorHandler);
  }

  registerRoutes(){
    // this.app.use(`${ apiPath }/users`, usersRoutes);
    // this.app.use(`${ apiPath }/assets`, assetsRoutes);
    
    leadRoutes.registerLeadRoutes(this.app, apiPath);
    securityRoutes.registerSecurityRoutes(this.app, apiPath);
    dashboardRoute.registerDashboardRoutes(this.app, apiPath);
  }

  start(){
        try {
          this.app.listen({port: process.env.PORT || 3001}, () => {
            console.log(`Listening at  http://${process.env.HOST_NAME}:${process.env.PORT}/`)
          })
        } catch (error) {
          console.log(error);
        }    
  }
}

module.exports = App;
