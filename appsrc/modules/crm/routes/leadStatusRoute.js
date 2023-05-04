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
// router.use(checkAuth);

// - /api/1.0.0/crm/Leads/:securityUserID/lead/:id
router.get(`${baseRoute}/:id`, checkSecurityUserID, controller.getLeadStatus);

// - /api/1.0.0/crm/Leads/:LeadId/lead/
router.get(`${baseRoute}/`, checkSecurityUserID, controller.getLeadStatuses);

// - /api/1.0.0/crm/Leads/:securityUserID/lead/
router.post(`${baseRoute}/`, controller.postLeadStatus);

// - /api/1.0.0/crm/Leads/:LeadId/lead/:id
router.patch(`${baseRoute}/:id`, checkSecurityUserID, controller.patchLeadStatus);

// - /api/1.0.0/crm/Leads/:securityUserID/lead/:id
router.delete(`${baseRoute}/:id`, checkSecurityUserID, controller.deleteLeadStatus);

// - /api/1.0.0/crm/leads/search
router.get(`/leads/search`, controller.searchLeadStatus);

module.exports = router;