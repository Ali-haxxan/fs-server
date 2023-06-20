const express = require('express');
const { check } = require('express-validator');

const fileUpload = require('../../../middleware/file-upload');
const checkAuth = require('../../../middleware/check-auth');
const { SecurityUser } = require('../../security/models');
const checkSecurityUserID = require('../../../middleware/check-parentID')('securityUser', SecurityUser);

const controllers = require('../controllers');
const controller = controllers.reportController;

const router = express.Router();

//  - base route for module
// - /api/1.0.0/crm/

router.use(checkAuth);

// - /api/1.0.0/crm/Leads/report
const baseRoute = `/report`;


// - /api/1.0.0/crm/Periorty/:securityUserID/lead/
router.get(`${baseRoute}/`, controller.getReport);
router.get(`${baseRoute}/count/`, controller.getCountReport);




module.exports = router;