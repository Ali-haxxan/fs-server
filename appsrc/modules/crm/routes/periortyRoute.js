const express = require('express');
const { check } = require('express-validator');

const fileUpload = require('../../../middleware/file-upload');
const checkAuth = require('../../../middleware/check-auth');
const { SecurityUser } = require('../../security/models/securityUser');
const checkSecurityUserID = require('../../../middleware/check-parentID')('securityUser', SecurityUser);



const controllers = require('../controllers');
const controller = controllers.periortyController;

const router = express.Router();

//  - base route for module
// - /api/1.0.0/crm/Leads

// - /api/1.0.0/crm/Leads/:securityUserID/contacts
const baseRoute = `/periorty`;

// router.use(checkAuth);

// - /api/1.0.0/crm/Periorty/:securityUserID/lead/:id
router.get(`${baseRoute}/:id`, controller.getPeriorty);

// - /api/1.0.0/crm/Periorty/:securityUserID/lead/
router.get(`${baseRoute}/`,  controller.getPeriorties);

// - /api/1.0.0/crm/Periorty/:securityUserID/lead/
router.post(`${baseRoute}/`, controller.postPeriorty);

// - /api/1.0.0/crm/Periorty/:LeadId/:securityUserID/:id
router.patch(`${baseRoute}/:id`,  controller.patchPeriorty);

// - /api/1.0.0/crm/Leads/:securityUserID/:securityUserID/:id   checkSecurityUserID,
router.delete(`${baseRoute}/:id`,  controller.deletePeriorty);



module.exports = router;