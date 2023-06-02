const express = require('express');
const { check } = require('express-validator');

const fileUpload = require('../../../middleware/file-upload');
const checkAuth = require('../../../middleware/check-auth');
const { SecurityUser } = require('../../security/models/securityUser');
const checkSecurityUserID = require('../../../middleware/check-parentID')('securityUserId', SecurityUser);



const controllers = require('../controllers');
const controller = controllers.leadStatusController;

const router = express.Router();

//  - base route for module
// - /api/1.0.0/crm/Leads

// - /api/1.0.0/crm/Leads/lead
const baseRoute = `/leadStatus`;
router.use(checkAuth);

// - /api/1.0.0/crm/leadStatus/:securityUserID/lead/:id
router.get(`${baseRoute}/:id`,  controller.getLeadStatus);

// - /api/1.0.0/crm/leadStatus/:securityUserID/lead/
router.get(`${baseRoute}/`,  controller.getLeadStatuses);

// - /api/1.0.0/crm/leadStatus/:securityUserID/lead/
router.post(`${baseRoute}/`, controller.postLeadStatus);

// - /api/1.0.0/crm/leadStatus/:securityUserID/lead/:id
router.patch(`${baseRoute}/:id`,  controller.patchLeadStatus);

// - /api/1.0.0/crm/leadStatus/:securityUserID/lead/:id  checkSecurityUserID,
router.delete(`${baseRoute}/:id`,  controller.deleteLeadStatus);

// - /api/1.0.0/crm/leadStatus/search
router.get(`/leads/search`, controller.searchLeadStatus);

module.exports = router;