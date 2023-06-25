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
const { Lead} = require('../models');
const { LeadHistory } = require('../models');

this.debug = process.env.LOG_TO_CONSOLE != null && process.env.LOG_TO_CONSOLE != undefined ? process.env.LOG_TO_CONSOLE : false;

this.fields = {};
this.query = {};
this.orderBy = { createdAt: -1 };  
this.populate = [
                {path: 'users', select: 'name'},
                {path: 'lead', select: 'name'},
                {path: 'status', select: 'name'},
                {path: 'priority', select: 'name'},
                {path: 'createdBy', select: 'name'},
                {path: 'updatedBy', select: 'name'}
                ];
this.populateList = [
                  {path: 'users', select: 'name'},
                  {path: 'lead', select: 'name'},
                  {path: 'status', select: 'name'},
                  {path: 'priority', select: 'name'},
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
  this.securityUserID = req.body.loginUser.userId;
  this.query = req.body.params ? req.body.params : {}; 
  let user = await SecurityUser.findById(this.securityUserID).populate({path: 'role', select: 'readAccess'}); 
  if(user.role.readAccess === false){
    this.query.users = this.securityUserID;
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
  this.securityUserID = req.body.loginUser.userId;
  let user = await SecurityUser.findById(this.securityUserID).populate({path: 'role', select: 'readAccess'}); 
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
  this.securityUserID = req.body.loginUser.userId;
  if(req.params.id && this.securityUserID) {
    let user = await SecurityUser.findById(this.securityUserID).populate({path: 'role', select: 'deleteAccess'}); 
    if(user.role.deleteAccess === false){
      let lead= await Lead.findOne({_id:req.params.id, users:this.securityUserID});
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
    }else{
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
  var _this=this;
  await body('email')
  .isEmail().withMessage('Invalid email format')
  .run(req);
  
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    res.status(StatusCodes.BAD_REQUEST).send(getReasonPhrase(StatusCodes.BAD_REQUEST));
  } else {
    let lead= await Lead.findOne({_id:req.params.id});
    this.dbservice.getObject(Lead, this.query, this.populate, getObjectCallback);
    async function getObjectCallback(error, response) {
      if (error) {
        logger.error(new Error(error));
        res.status(StatusCodes.INTERNAL_SERVER_ERROR).send(getReasonPhrase(StatusCodes.INTERNAL_SERVER_ERROR));
      } else { 
        if(!(_.isEmpty(response))){
         await _this.dbservice.patchObject(Lead, req.params.id, getDocumentFromReq(req), callbackFunc);
          function callbackFunc(error, result) {
            if (error) {
              logger.error(new Error(error));
              res.status(StatusCodes.INTERNAL_SERVER_ERROR).send(error);
            } else {
              const leadChanges = getHistoryDocument(req.body, lead ,'new', req.params.id)
              if(leadChanges && Object.keys(leadChanges).length > 6){
                 _this.dbservice.postObject(getHistoryDocument(req.body, lead ,'new', req.params.id),callbackFunc);
                function callbackFunc(error, result) {
                  if (error) {
                    logger.error(new Error(error));
                    res.status(StatusCodes.INTERNAL_SERVER_ERROR).send(error);
                  } else {
                    res.status(StatusCodes.ACCEPTED).send(rtnMsg.recordUpdateMessage(StatusCodes.ACCEPTED, result));
                  }
                }
              }else{
                res.status(StatusCodes.ACCEPTED).send(rtnMsg.recordUpdateMessage(StatusCodes.ACCEPTED, result));
              }
            }
          }
        }else{
          res.status(StatusCodes.BAD_REQUEST).send(rtnMsg.recordCustomMessage(StatusCodes.BAD_REQUEST, "Some thing is missinng, unable to update document!"));
        }
        
      }
    }
  }
};


// compare Dates
function compareDate(newDate, oldDate){
  //Example of regular  date
  const getNewDate = new Date(newDate);

  // Example date retrieved from MongoDB
  const getOldDate = new Date(oldDate); 
// console.log("getOldDate : ",getOldDate , "getNewDate : ",getNewDate)
  // Extract the date components from the regular date
  const newDateYear =   getNewDate.getFullYear();
  const newDateMonth =  getNewDate.getMonth();
  const newDateDay =    getNewDate.getDate();
// console.log("newDateYear : ", newDateYear, "newDateMonth : ", newDateMonth, "newDateDay : ", newDateDay)
  // Extract the date components from the MongoDB date
  const oldDateYear =  getOldDate.getFullYear();
  const oldDateMonth = getOldDate.getMonth();
  const oldDateDay =   getOldDate.getDate();
  // console.log("oldDateYear : ", oldDateYear, "oldDateMonth : ", oldDateMonth, "oldDateDay : ", oldDateDay)
  if(newDateYear !== oldDateYear || newDateMonth !== oldDateMonth || newDateDay !== oldDateDay){
    // console.log("date compared is different")
    return true; 
    }else{
    // console.log("date compared is not different")
    return false;
  }
  // if(newDateYear !== oldDateYear){
  //   if(newDateMonth !== oldDateMonth){
  //     if(newDateDay !== oldDateDay){
  //       return true
  //     }else{
  //       return false
  //     }
  //   }else{
  //     return false
  //   }
  // }else{
  //   return false
  // }
}
exports.compareDate = compareDate;


// getDocumentFromReq

function getDocumentFromReq(req, reqType){
  const { users, firstName, lastName, businessName, phone, alternatePhone, email, appoinmentDate, priority, note,
     status, streetAddress, aptSuite, city, postCode, country, lat, long, isActive, isArchived, loginUser } = req.body;
     this.securityUserID = loginUser.userId;
  let doc = {};
  if (reqType && reqType == "new"){
    doc = new Lead({});
  }
  if ("users" in req.body){
    doc.users = users;
  }
  if(reqType && reqType == "new"){
    doc.users = this.securityUserID
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
  if("priority" in req.body){
    doc.priority = priority;
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

function getHistoryDocument(newData, oldData, reqType, Id){
// console.log("newData : ",newData," oldData : ",oldData, " Id : ",Id);

  const {users, firstName, lastName, businessName, phone, alternatePhone, email, appoinmentDate, priority, note,
     status, streetAddress, aptSuite, city, postCode, country, lat, long, loginUser } = newData;
     
  let historyDoc = {};

  if (reqType && reqType == "new"){
    historyDoc = new LeadHistory({});
  }
   // if(Id){
    historyDoc.lead = Id
    // }
  if ("users" in newData){
    historyDoc.users = users;
  }
  if (newData && oldData && newData?.firstName !== oldData.firstName){
    historyDoc.firstName = firstName;
  }
  if (newData && oldData && newData?.lastName !== oldData?.lastName){
    historyDoc.lastName = lastName;
  }
  if (newData && oldData && newData?.businessName !== oldData?.businessName){
    historyDoc.businessName = businessName;
  }
  if (newData && oldData && newData?.phone !== oldData?.phone){
    historyDoc.phone = phone;
  }
  if (newData && oldData && newData?.alternatePhone !== oldData?.alternatePhone){
    historyDoc.alternatePhone = alternatePhone;
  }
  if (newData && oldData && newData?.email !== oldData?.email){
    historyDoc.email = email;
  }
  if (newData && oldData && compareDate(newData?.appoinmentDate, oldData?.appoinmentDate)){
    historyDoc.appoinmentDate = appoinmentDate;
  }
  if( newData && oldData && newData?.priority?.toString() !== oldData?.priority){
    historyDoc.priority = priority;
  }
  if (newData && oldData && newData?.note !== oldData?.note){
    historyDoc.note = note;
  }
  if(newData && oldData && newData?.status?.toString() !== oldData?.status?.toString()){
    historyDoc.status = status;
  }
  if(newData && oldData && newData?.streetAddress !== oldData?.streetAddres){
    historyDoc.streetAddress = streetAddress;
  }
  if(newData && oldData && newData?.aptSuite !== oldData?.aptSuite){
    historyDoc.aptSuite = aptSuite;
  }
  if(newData && oldData && newData?.city !== oldData?.city){
    historyDoc.city = city;
  }
  if(newData && oldData && newData?.postCode !== oldData?.postCode){
    historyDoc.postCode = postCode;
  }
  if(newData && oldData && newData?.country !== oldData?.country){
    historyDoc.country = country;
  }
  if (newData && oldData && newData?.lat !== oldData?.lat){
    historyDoc.lat = lat;
  }
  if (newData && oldData && newData?.long !== oldData?.long){
    historyDoc.long = long;
  }
 

  if ("loginUser" in newData ){
    historyDoc.updatedBy = loginUser.userId;
    historyDoc.updatedIP = loginUser.userIP;
  } 
// console.log("historyDoc : ",historyDoc)
  return historyDoc;

}

exports.getHistoryDocument = getHistoryDocument;