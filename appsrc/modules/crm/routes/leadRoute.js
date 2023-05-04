const express = require('express');
const { check } = require('express-validator');

const fileUpload = require('../../../middleware/file-upload');
const checkAuth = require('../../../middleware/check-auth');
const { SecurityUser } = require('../../security/models/securityUser');
const checkSecurityUserID = require('../../../middleware/check-parentID')('securityUser', SecurityUser);



const controllers = require('../controllers');
const controller = controllers.leadController;

const router = express.Router();

//  - base route for module
// - /api/1.0.0/crm/Leads

// - /api/1.0.0/crm/Leads/:securityUserID/contacts
const baseRoute = `/lead`;

// router.use(checkAuth);

// - /api/1.0.0/crm/Leads/:securityUserID/contacts/:id
router.get(`${baseRoute}/:id`, checkSecurityUserID,controller.getLead);

// - /api/1.0.0/crm/Leads/:LeadId/contacts/
router.get(`${baseRoute}/`, checkSecurityUserID, controller.getLeads);

// - /api/1.0.0/crm/Leads/:securityUserID/contacts/
router.post(`${baseRoute}/`, checkSecurityUserID,controller.postLead);

// - /api/1.0.0/crm/Leads/:LeadId/contacts/:id
router.patch(`${baseRoute}/:id`, checkSecurityUserID, controller.patchLead);

// - /api/1.0.0/crm/Leads/:securityUserID/contacts/:id
router.delete(`${baseRoute}/:id`, checkSecurityUserID, controller.deleteLead);

// - /api/1.0.0/crm/contacts/search
router.get(`/contacts/search`, controller.searchLeads);


module.exports = router;