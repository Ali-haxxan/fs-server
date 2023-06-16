const express = require('express');
const { check } = require('express-validator');

const fileUpload = require('../../../middleware/file-upload');
const checkAuth = require('../../../middleware/check-auth');
const { SecurityUser } = require('../../security/models/securityUser');
const checkSecurityUserID = require('../../../middleware/check-parentID')('securityUser', SecurityUser);



const controllers = require('../controllers');
const controller = controllers.priorityController;

const router = express.Router();

//  - base route for module
// - /api/1.0.0/crm/Leads

// - /api/1.0.0/crm/
const baseRoute = `/priority`;

router.use(checkAuth);

// - /api/1.0.0/crm/Periorty/:securityUserID/lead/:id
router.get(`${baseRoute}/:id`, controller.getPriority);

// - /api/1.0.0/crm/Periorty/:securityUserID/lead/
router.get(`${baseRoute}/`,  controller.getPriorities);

// - /api/1.0.0/crm/Periorty/:securityUserID/lead/
router.post(`${baseRoute}/`, controller.postPriority);

// - /api/1.0.0/crm/Periorty/:LeadId/:securityUserID/:id
router.patch(`${baseRoute}/:id`,  controller.patchPriority);

// - /api/1.0.0/crm/Leads/:securityUserID/:securityUserID/:id   checkSecurityUserID,
router.delete(`${baseRoute}/:id`,  controller.deletePriority);



module.exports = router;