const express = require('express');
const { check } = require('express-validator');

const fileUpload = require('../../../middleware/file-upload');
const checkAuth = require('../../../middleware/check-auth');
const { SecurityUser } = require('../models');
const checkSecurityUserID = require('../../../middleware/check-parentID')('securityUser', SecurityUser);

const controllers = require('../controllers');
const controller = controllers.securitySignInLogController;

const router = express.Router();

//  - base route for module
// - /api/1.0.0/users/signinlogs/

// - /api/1.0.0/users/signinlogs/
const baseRoute = `/signinLogs/`;

router.use(checkAuth);



// - /api/1.0.0/users/signinlogs/:id
router.get(`${baseRoute}/:securityUserId`,checkSecurityUserID , controller.getSecuritySignInLog);

// - /api/1.0.0/users/signinlogs/
router.get(`${baseRoute}`, controller.getSecuritySignInLogs);

// - /api/1.0.0/users/signinlogs/
router.post(`${baseRoute}/`, controller.postSignInLog);

// - /api/1.0.0/users/signinlogs/:id
router.patch(`${baseRoute}/:id`,  controller.patchSignInLog);

// - /api/1.0.0/users/signinlogs/:id
router.delete(`${baseRoute}/:id`,  controller.deleteSignInLog);


module.exports = router;