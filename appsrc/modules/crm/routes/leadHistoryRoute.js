const express = require('express');
const { check } = require('express-validator');

const fileUpload = require('../../../middleware/file-upload');
const checkAuth = require('../../../middleware/check-auth');
const { SecurityUser } = require('../../security/models');
const checkSecurityUserID = require('../../../middleware/check-parentID')('securityUser', SecurityUser);



const controllers = require('../controllers');
const controller = controllers.leadHistoryController;

const router = express.Router();

//  - base route for module
// - /api/1.0.0/crm/Leads

// - /api/1.0.0/crm/Leads/:securityUserId/contacts
const baseRoute = `/history`;

router.use(checkAuth);

// - /api/1.0.0/crm/Leads/:securityUserId/lead/:id
router.get(`${baseRoute}/:id`,  controller.getLeadHistory);

// - /api/1.0.0/crm/Leads/:securityUserId/lead/
router.get(`${baseRoute}/`, controller.getLeadsHistory);

// - /api/1.0.0/crm/leads/search
router.get(`/search`, controller.searchLeadsHistory);


module.exports = router;