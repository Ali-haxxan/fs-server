const { body, validationResult } = require('express-validator');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const mongoose = require('mongoose');
const { ReasonPhrases, StatusCodes, getReasonPhrase, getStatusCode } = require('http-status-codes');
const { SecurityUser } = require('../../security/models');
const checkSecurityUserID = require('../../../middleware/check-parentID')('securityUser', SecurityUser);
const _ = require('lodash');
const HttpError = require('../../config/models/http-error');
const logger = require('../../config/logger');
let rtnMsg = require('../../config/static/static')
const isEqual = require('lodash/isEqual');
const { ObjectId } = require('mongodb');

let LeadDBService = require('../service/leadDBService')
this.dbservice = new LeadDBService();
const { LeadHistory } = require('../models');

this.debug = process.env.LOG_TO_CONSOLE != null && process.env.LOG_TO_CONSOLE != undefined ? process.env.LOG_TO_CONSOLE : false;

this.fields = {};
this.query = {};
this.orderBy = { createdAt: -1 };  
this.populate = [
                {path: 'users', select: 'name'},
                {path: 'lead', select: 'name'},
                {path: 'status', select: 'name'},
                {path: 'lead', select: 'firstName lastName businessName'},
                {path: 'periorty', select: 'name'},
                {path: 'updatedBy', select: 'name'}
                ];
this.populateList = [
                {path: 'users', select: 'name'},
                {path: 'lead', select: 'name'},
                {path: 'status', select: 'name'},
                {path: 'lead', select: 'firstName lastName businessName'},
                {path: 'periorty', select: 'name'},
                {path: 'updatedBy', select: 'name'}
                ];

exports.getLeadHistory= async (req, res, next) => {
  this.dbservice.getObjectById(LeadHistory, this.fields, req.params.id, this.populate, callbackFunc);
  function callbackFunc(error, response) {
    if (error) {
      logger.error(new Error(error));
      res.status(StatusCodes.INTERNAL_SERVER_ERROR).send(getReasonPhrase(StatusCodes.INTERNAL_SERVER_ERROR));
    } else {
        res.json(response);
    }
  }
};

exports.getLeadsHistory = async (req, res, next) => {
  this.securityUserID = req.body.loginUser.userId;
  this.query = req.body.params ? req.body.params : {}; 
  let user = await SecurityUser.findById(this.securityUserID).populate({path: 'role', select: 'readAccess'}); 
  if(user.role.readAccess === false){
    this.query.users = this.securityUserID;
  }
  this.dbservice.getObjectList(LeadHistory, this.fields, this.query, this.orderBy, this.populate, callbackFunc);
  function callbackFunc(error, response) {
    if (error) {
      logger.error(new Error(error));
      res.status(StatusCodes.INTERNAL_SERVER_ERROR).send(getReasonPhrase(StatusCodes.INTERNAL_SERVER_ERROR));
    } else {
      res.json(response);
    }
  }
};

exports.searchLeadsHistory = async (req, res, next) => {
  this.securityUserID = req.body.loginUser.userId;
  let user = await SecurityUser.findById(this.securityUserID).populate({path: 'role', select: 'readAccess'}); 
  if(user?.roles?.readAccess === false){
    this.query.user = this.securityUserID;
  }
  this.dbservice.getObjectList(LeadHistory, this.fields, this.query, this.orderBy, this.populate, callbackFunc);
  function callbackFunc(error, response) {
    if (error) {
      logger.error(new Error(error));
      res.status(StatusCodes.INTERNAL_SERVER_ERROR).send(getReasonPhrase(StatusCodes.INTERNAL_SERVER_ERROR));
    } else {
      res.json(response);
    }
  }
};

