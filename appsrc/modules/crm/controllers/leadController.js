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

let LeadDBService = require('../service/leadDBService')
this.dbservice = new LeadDBService();
const { Lead} = require('../models');

this.debug = process.env.LOG_TO_CONSOLE != null && process.env.LOG_TO_CONSOLE != undefined ? process.env.LOG_TO_CONSOLE : false;

this.fields = {};
this.query = {};
this.orderBy = { createdAt: -1 };  
this.populate = [
                {path: 'user', select: 'name'},
                {path: 'lead', select: 'name'},
                {path: 'createdBy', select: 'name'},
                {path: 'updatedBy', select: 'name'}
                ];
this.populateList = [
                  {path: 'roles', select: 'name'},
                ];

exports.getLead= async (req, res, next) => {
  this.dbservice.getObjectById(Lead, this.fields, req.params.id, this.populate, callbackFunc);
  function callbackFunc(error, response) {
    if (error) {
      logger.error(new Error(error));
      res.status(StatusCodes.INTERNAL_SERVER_ERROR).send(getReasonPhrase(StatusCodes.INTERNAL_SERVER_ERROR));
    } else {
      res.json(response);
    }
  }
};

exports.getLeads = async (req, res, next) => {
  // this.query = req.query != "undefined" ? req.query : {};  
  // this.securityUserID = req.params.securityUserID;
  let user = await SecurityUser.findById(req.params.securityUserID).populate({path: 'roles', select: 'readAccess'}); 
  // let user = this.dbservice.getObjectById(SecurityUser, this.fields, req.params.securityUserID, this.populateList, callbackFunc);
  console.log("user : ", user);

  // this.dbservice.getObjectById(Lead, this.fields, req.params.securityUserID, this.populate, callbackFunc);
  if(user?.roles?.readAccess === false){
    this.query.user = req.params.securityUserID;
  }
  this.dbservice.getObjectList(Lead, this.fields, this.query, this.orderBy, this.populate, callbackFunc);
  function callbackFunc(error, response) {
    if (error) {
      logger.error(new Error(error));
      res.status(StatusCodes.INTERNAL_SERVER_ERROR).send(getReasonPhrase(StatusCodes.INTERNAL_SERVER_ERROR));
    } else {
      res.json(response);
    }
  }
};

exports.searchLeads = async (req, res, next) => {
  this.query = req.query != "undefined" ? req.query : {};
  this.dbservice.getObjectList(Lead, this.fields, this.query, this.orderBy, this.populate, callbackFunc);
  function callbackFunc(error, response) {
    if (error) {
      logger.error(new Error(error));
      res.status(StatusCodes.INTERNAL_SERVER_ERROR).send(getReasonPhrase(StatusCodes.INTERNAL_SERVER_ERROR));
    } else {
      res.json(response);
    }
  }
};


exports.deleteLead= async (req, res, next) => {
  let id = req.params.id;
  if(req.params.id && req.params.securityUserID) {
    let Lead= await Lead.findOne({_id:req.params.id, user:req.params.securityUserID});
    if(Lead) {
      this.dbservice.deleteObject(Lead, req.params.id, callbackFunc);
      function callbackFunc(error, result) {
        if (error) {
          logger.error(new Error(error));
          res.status(StatusCodes.INTERNAL_SERVER_ERROR).send(getReasonPhrase(StatusCodes.INTERNAL_SERVER_ERROR));
        } else {
          res.status(StatusCodes.OK).send(rtnMsg.recordDelMessage(StatusCodes.OK, result));
        }
      }
    }
    else {
      res.status(StatusCodes.BAD_REQUEST).send(getReasonPhrase(StatusCodes.BAD_REQUEST));
    }
  }
  else {
    res.status(StatusCodes.BAD_REQUEST).send(getReasonPhrase(StatusCodes.BAD_REQUEST));
  }
};

exports.postLead= async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    res.status(StatusCodes.BAD_REQUEST).send(getReasonPhrase(StatusCodes.BAD_REQUEST));
  } else {
    this.dbservice.postObject(getDocumentFromReq(req, 'new'), callbackFunc);
    function callbackFunc(error, response) {
      if (error) {
        logger.error(new Error(error));
        res.status(StatusCodes.INTERNAL_SERVER_ERROR).send(error);
      } else {
        res.status(StatusCodes.CREATED).json({ lead: response });
      }
    }
  }
};

exports.patchLead= async (req, res, next) => {
  await body('email')
  .isEmail().withMessage('Invalid email format')
  .run(req);
  
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    res.status(StatusCodes.BAD_REQUEST).send(getReasonPhrase(StatusCodes.BAD_REQUEST));
  } else {
    var _this = this;
    this.query = req.query != "undefined" ? req.query : {}; 
    this.query.user = req.params.securityUserID;
    this.query._id = req.params.id;
    this.dbservice.getObject(Lead, this.query, this.populate, getObjectCallback);
    async function getObjectCallback(error, response) {
      if (error) {
        logger.error(new Error(error));
        res.status(StatusCodes.INTERNAL_SERVER_ERROR).send(getReasonPhrase(StatusCodes.INTERNAL_SERVER_ERROR));
      } else { 
        if(!(_.isEmpty(response))){
          _this.dbservice.patchObject(Lead, req.params.id, getDocumentFromReq(req), callbackFunc);
          function callbackFunc(error, result) {
            if (error) {
              logger.error(new Error(error));
              res.status(StatusCodes.INTERNAL_SERVER_ERROR).send(
                error
                //getReasonPhrase(StatusCodes.INTERNAL_SERVER_ERROR)
                );
            } else {
              res.status(StatusCodes.ACCEPTED).send(rtnMsg.recordUpdateMessage(StatusCodes.ACCEPTED, result));
            }
          }
        }else{
          res.status(StatusCodes.BAD_REQUEST).send(rtnMsg.recordCustomMessage(StatusCodes.BAD_REQUEST, "Security User ID Mismatch!"));
        }
      }
    }  
  }
};

function getDocumentFromReq(req, reqType){
  const { lead, businessName, firstName, lastName, phone, alternatePhone, email, appoinmentDate, lat, long, note, address,
    isActive, isArchived, loginUser } = req.body;
  let doc = {};
  if (reqType && reqType == "new"){
    doc = new Lead({});
  }
  if (req.params.securityUserID){
    doc.user = req.params.securityUserID;
  }
  if ("lead" in req.body){
    doc.lead = lead;
  }
  if ("businessName" in req.body){
    doc.businessName = businessName;
  }
  if ("firstName" in req.body){
    doc.firstName = firstName;
  }
  if ("lastName" in req.body){
    doc.lastName = lastName;
  }
  if ("phone" in req.body){
    doc.phone = phone;
  }
  if ("alternatePhone" in req.body){
    doc.alternatePhone = alternatePhone;
  }
  if ("email" in req.body){
    doc.email = email;
  }
  if ("appoinmentDate" in req.body){
    doc.appoinmentDate = appoinmentDate;
  }
  if ("isActive" in req.body){
    doc.isActive = isActive;
  }
  if ("isArchived" in req.body){
    doc.isArchived = isArchived;
  }
  if ("lat" in req.body){
    doc.lat = lat;
  }
  if ("long" in req.body){
    doc.long = long;
  }
  if ("note" in req.body){
    doc.note = note;
  }

  if (reqType == "new" && "loginUser" in req.body ){
    doc.createdBy = req.params.securityUserID;
    doc.updatedBy = req.params.securityUserID;
    doc.createdIP = loginUser.userIP;
  } else if ("loginUser" in req.body) {
    doc.updatedBy = req.params.securityUserID;
    doc.updatedIP = loginUser.userIP;
  } 


  return doc;

}


exports.getDocumentFromReq = getDocumentFromReq;