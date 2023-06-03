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
                {path: 'users', select: 'name'},
                {path: 'lead', select: 'name'},
                {path: 'status', select: 'name'},
                {path: 'periorty', select: 'name'},
                {path: 'createdBy', select: 'name'},
                {path: 'updatedBy', select: 'name'}
                ];
this.populateList = [
                  {path: 'users', select: 'name'},
                  {path: 'lead', select: 'name'},
                  {path: 'status', select: 'name'},
                  {path: 'periorty', select: 'name'},
                  {path: 'createdBy', select: 'name'},
                  {path: 'updatedBy', select: 'name'}
                ];

exports.getLead= async (req, res, next) => {
  this.dbservice.getObjectById(Lead, this.fields, req.params.id, this.populate, callbackFunc);
  function callbackFunc(error, response) {
    if (error) {
      logger.error(new Error(error));
      res.status(StatusCodes.INTERNAL_SERVER_ERROR).send(getReasonPhrase(StatusCodes.INTERNAL_SERVER_ERROR));
    } else {
      // if(!res.json(response).isEmpty()){
        res.json(response);
      // }else{
      // res.status(StatusCodes.NOT_FOUND).send(getReasonPhrase(StatusCodes.NOT_FOUND));
      // }
    }
  }
};

exports.getLeads = async (req, res, next) => {
  this.securityUserID = req.params.securityUserID;
  let user = await SecurityUser.findById(req.params.securityUserID).populate({path: 'roles', select: 'readAccess'}); 
  if(user?.roles?.readAccess === false){
    this.query.user = this.securityUserID;
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
  this.securityUserID = req.params.securityUserID;
  let user = await SecurityUser.findById(req.params.securityUserID).populate({path: 'roles', select: 'readAccess'}); 
  if(user?.roles?.readAccess === false){
    this.query.user = this.securityUserID;
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


exports.deleteLead= async (req, res, next) => {
  if(req.params.id && req.params.securityUserId) {
    let lead= await Lead.findOne({_id:req.params.id, users:req.params.securityUserId});
    console.log("lead",lead)
    if(lead) {
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
      res.status(StatusCodes.NOT_FOUND).send(getReasonPhrase(StatusCodes.NOT_FOUND));
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
    this.query.users = req.params.securityUserID;
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
  const { users, firstName, lastName, businessName, phone, alternatePhone, email, appoinmentDate, periorty, note,
     status, streetAddress, aptSuite, city, postCode, country, lat, long, isActive, isArchived, loginUser } = req.body;
  let doc = {};
  if (reqType && reqType == "new"){
    doc = new Lead({});
  }
  if (req.params.securityUserId){
    doc.users = req.params.securityUserId;
  }
  if ("users" in req.body){
    doc.users = users;
  }
  if ("firstName" in req.body){
    doc.firstName = firstName;
  }
  if ("lastName" in req.body){
    doc.lastName = lastName;
  }
  if ("businessName" in req.body){
    doc.businessName = businessName;
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
  if("periorty" in req.body){
    doc.periorty = periorty;
  }
  if ("note" in req.body){
    doc.note = note;
  }
  if("status" in req.body){
    doc.status = status;
  }
  if("streetAddress" in req.body){
    doc.streetAddress = streetAddress;
  }
  if("aptSuite" in req.body){
    doc.aptSuite = aptSuite;
  }
  if("city" in req.body){
    doc.city = city;
  }
  if("postCode" in req.body){
    doc.postCode = postCode;
  }
  if("country" in req.body){
    doc.country = country;
  }
  if ("lat" in req.body){
    doc.lat = lat;
  }
  if ("long" in req.body){
    doc.long = long;
  }
  if ("isActive" in req.body){
    doc.isActive = isActive;
  }
  if ("isArchived" in req.body){
    doc.isArchived = isArchived;
  }

  if (reqType == "new" && "loginUser" in req.body ){
    doc.createdBy = loginUser.userId;
    doc.updatedBy = loginUser.userId;
    doc.createdIP = loginUser.userIP;
  } else if ("loginUser" in req.body) {
    doc.updatedBy = loginUser.userId;
    doc.updatedIP = loginUser.userIP;
  } 


  return doc;

}


exports.getDocumentFromReq = getDocumentFromReq;