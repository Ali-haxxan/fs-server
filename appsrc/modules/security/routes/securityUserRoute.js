const express = require('express');
const { check } = require('express-validator');

const fileUpload = require('../../../middleware/file-upload');
const checkAuth = require('../../../middleware/check-auth');
const { SecurityUser } = require('../models');
const checkSecurityUserID = require('../../../middleware/check-parentID')('id', SecurityUser);

const controllers = require('../controllers');
const controller = controllers.securityUserController;

const router = express.Router();

//  - base route for module
// - /api/1.0.0/security/users/

// - /api/1.0.0/security/users/:id
const baseRoute = `/users`;

// router.use(checkAuth);

// - /api/1.0.0/security/users/:id
router.get(`${baseRoute}/:id`,  controller.getSecurityUser);

// - /api/1.0.0/security/users
router.get(`${baseRoute}/`,  controller.getSecurityUsers);

// - /api/1.0.0/security/users
router.post(`${baseRoute}/`,  controller.postSecurityUser);

// - /api/1.0.0/security/users/:id
router.patch(`${baseRoute}/:id`,  controller.patchSecurityUser);

// - /api/1.0.0/security/users/password
router.patch(`${baseRoute}/updatePassword/:id`,  controller.patchSecurityUserPassword);

// - /api/1.0.0/security/users/passwordUpdateByAdmin
router.post(`${baseRoute}/passwordUpdateByAdmin`,  controller.patchPasswordByAdmin);

// - /api/1.0.0/security/users/:id
router.delete(`${baseRoute}/:id`,  controller.deleteSecurityUser);



module.exports = router;