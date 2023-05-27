const express = require('express');
const { check } = require('express-validator');

const fileUpload = require('../../../middleware/file-upload');
const checkAuth = require('../../../middleware/check-auth');
const { SecurityUser } = require('../../security/models/securityUser');
const checkSecurityUserID = require('../../../middleware/check-parentID')('securityUser', SecurityUser);



const controllers = require('../controllers');
const controller = controllers.reportController;

const router = express.Router();

//  - base route for module
// - /api/1.0.0/crm/Leads

// router.use(checkAuth);

// - /api/1.0.0/crm/Leads/:securityUserId/report
const baseRoute = `/:securityUserId/report`;


// - /api/1.0.0/crm/Periorty/:securityUserID/lead/
router.get(`${baseRoute}/`, checkSecurityUserID, controller.getReport);




module.exports = router;