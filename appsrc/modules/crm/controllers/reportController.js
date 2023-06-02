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
const { Lead } = require('../models');

this.debug = process.env.LOG_TO_CONSOLE != null && process.env.LOG_TO_CONSOLE != undefined ? process.env.LOG_TO_CONSOLE : false;

this.fields = {};
this.query = {};
this.orderBy = { createdAt: -1 };  
this.populate = [
                {path: 'createdBy', select: 'name'},
                {path: 'updatedBy', select: 'name'}
                ];
this.populateList = [];


exports.getReport = async (req, res, next) => {

  let user = await SecurityUser.findById(req.params.securityUserID).populate({path: 'roles', select: 'readAccess'}); 
  this.securityUserID = req.params.securityUserID;

  const startDate = req.body.startDate
  const endDate = req.body.endDate

  try{
  this.pipeline = [
      {
        $match: {
          // user:  new mongoose.Types.ObjectId(this.securityUserID) ,
          createdAt: { $gte: new Date(startDate), $lte: new Date(endDate)},
        }
      },
    {
      $lookup: {
        from: "SecurityUsers",
        localField: "user",
        foreignField: "_id",
        as: "securityUsers"
      }
    },
    {
      $unwind: '$securityUsers' 
    },
    {
      $lookup: {
        from: "Periorties",
        localField: "periorty",
        foreignField: "_id",
        as: "periorty"
      }
    },
    {
      $unwind: '$periorty' 
    },
    {
      $lookup: {
        from: "LeadStatuses",
        localField: "status",
        foreignField: "_id",
        as: "leadStatus"
      }
    },
    {
      $unwind: '$leadStatus' 
    },
    { $group: { "_id": "$periorty", "documents": { $push: "$$ROOT" } } },
    {
      $project: {
        "_id._id": 0,
        "_id.isActive": 0,
        "_id.isArchived": 0,
        "_id.user": 0,
        "_id.createdAt": 0,
        "_id.updatedAt": 0,
        "_id.__v": 0,
        "documents.isActive": 0,
        "documents.isArchived": 0,
        "documents.status": 0,
        "documents.__v": 0,
        "documents.securityUsers.isActive": 0,
        "documents.securityUsers.isArchived": 0,
        "documents.securityUsers.createdAt": 0,
        "documents.securityUsers.updatedAt": 0,
        "documents.securityUsers.password": 0,
        "documents.securityUsers.roles": 0,
        "documents.securityUsers.__v": 0,
        "documents.periorty.isActive": 0,
        "documents.periorty.isArchived": 0,
        "documents.periorty.createdAt": 0,
        "documents.periorty.updatedAt": 0,
        "documents.periorty._id": 0,
        "documents.periorty.user": 0,
        "documents.periorty.__v": 0,
        "documents.leadStatus._id": 0,
        "documents.leadStatus.isActive": 0,
        "documents.leadStatus.isArchived": 0,
        "documents.leadStatus.description": 0,
        "documents.leadStatus.createdAt": 0,
        "documents.leadStatus.updatedAt": 0,
        "documents.leadStatus.user": 0,
        "documents.leadStatus.__v": 0
      }
    },
    {
      $sort: {
        "_id.periorty": -1
      }
    }
  ];

  if(user?.roles?.readAccess === true){
    this.pipeline[0].$match.user = new mongoose.Types.ObjectId(this.securityUserID) 
  }

  const result = await Lead.aggregate( this.pipeline);
  res.json(result);
  }catch(e) {
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).send(getReasonPhrase(StatusCodes.INTERNAL_SERVER_ERROR));
  }
}