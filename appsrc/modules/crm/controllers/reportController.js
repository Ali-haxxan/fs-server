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
                {path: 'updatedBy', select: 'name'},
                {path: 'users', select: 'name'}
                ];
this.populateList = [];


exports.getReport = async (req, res, next) => {
  this.securityUserID = req.body.loginUser.userId;
  // console.log("this.securityUserID : ", this.securityUserID)
  let user = await SecurityUser.findById(this.securityUserID).populate({path: 'role', select: 'readAccess'}); 
// console.log(" user : ", user)
  const startDate = req.body.startDate
  const endDate = req.body.endDate
  try{
// old Query
      // this.pipeline = [
  //     {
  //       $match: {
  //         // users:  new mongoose.Types.ObjectId(this.securityUserID) ,
  //         createdAt: { $gte: new Date(startDate), $lte: new Date(endDate)},
  //       }
  //     },
  //   {
  //     $lookup: {
  //       from: "SecurityUsers",
  //       localField: "users",
  //       foreignField: "_id",
  //       as: "securityUser"
  //     }
  //   },
  //   {
  //     $unwind: '$securityUsers' 
  //   },
  //   {
  //     $lookup: {
  //       from: "Priorities",
  //       localField: "priority",
  //       foreignField: "_id",
  //       as: "priority"
  //     }
  //   },
  //   {
  //     $unwind: '$priority' 
  //   },
  //   {
  //     $lookup: {
  //       from: "LeadStatuses",
  //       localField: "status",
  //       foreignField: "_id",
  //       as: "leadStatus"
  //     }
  //   },
  //   {
  //     $unwind: '$leadStatus' 
  //   },
  //   // { $group: { "_id": "$periorty", "documents": { $push: "$$ROOT" } } },
  //   // {
  //   //   $project: {
  //   //     "_id._id": 0,
  //   //     "_id.isActive": 0,
  //   //     "_id.isArchived": 0,
  //   //     // "_id.users": 0,
  //   //     "_id.createdAt": 0,
  //   //     "_id.updatedAt": 0,
  //   //     "_id.__v": 0,
  //   //     "documents.isActive": 0,
  //   //     "documents.isArchived": 0,
  //   //     "documents.status": 0,
  //   //     "documents.__v": 0,
  //   //     "documents.securityUsers.isActive": 0,
  //   //     "documents.securityUsers.isArchived": 0,
  //   //     "documents.securityUsers.createdAt": 0,
  //   //     "documents.securityUsers.updatedAt": 0,
  //   //     "documents.securityUsers.password": 0,
  //   //     "documents.securityUsers.role": 0,
  //   //     "documents.securityUsers.__v": 0,
  //   //     "documents.priority.isActive": 0,
  //   //     "documents.priority.isArchived": 0,
  //   //     "documents.priority.createdAt": 0,
  //   //     "documents.priority.updatedAt": 0,
  //   //     "documents.priority._id": 0,
  //   //     "documents.priority.user": 0,
  //   //     "documents.priority.__v": 0,
  //   //     "documents.leadStatus._id": 0,
  //   //     "documents.leadStatus.isActive": 0,
  //   //     "documents.leadStatus.isArchived": 0,
  //   //     "documents.leadStatus.description": 0,
  //   //     "documents.leadStatus.createdAt": 0,
  //   //     "documents.leadStatus.updatedAt": 0,
  //   //     "documents.leadStatus.user": 0,
  //   //     "documents.leadStatus.__v": 0
  //   //   }
  //   // },
  //   {
  //     $sort: {
  //       "_id.priority": -1
  //     }
  //   }
  // ];
  // if(user.role.readAccess !== true){
  //   this.pipeline[0].$match.users = new mongoose.Types.ObjectId(this.securityUserID) 
  // }

  this.pipeline = [
    {
            $match: {
              // users:  new mongoose.Types.ObjectId(this.securityUserID) ,
              createdAt: { $gte: new Date(startDate), $lte: new Date(endDate)},
            }
          },
    {
      $lookup: {
        from: "SecurityUsers",
        localField: "users",
        foreignField: "_id",
        as: "securityUser"
      }
    },
    {
        $unwind: '$securityUser' 
    },
    {
      $lookup: {
        from: "Priorities",
        localField: "priority",
        foreignField: "_id",
        as: "priority"
      }
    },
    {
      $unwind: '$priority' 
    },
    {
      $lookup: {
        from: "LeadStatuses",
        localField: "status",
        foreignField: "_id",
        as: "status"
      }
    },
    {
      $unwind: '$status' 
    },
    { $group: { "_id": "$priority", "documents": { $push: "$$ROOT" } } },
    {
      $sort: {
        "_id.priority": 1
      }
    },
    {   $project: {
        "_id._id": 0,
        "_id.priority": 0,
        "_id.isActive": 0,
        "_id.isArchived": 0,
        "_id.createdBy": 0,
        "_id.createdIP": 0,
        "_id.updatedBy": 0,
        "_id.updatedIP": 0,
        "_id.createdAt": 0,
        "_id.updatedAt": 0,
        "_id.__v": 0,
        "documents.isActive": 0,
        "documents.isArchived": 0,
        "documents.status": 0,
        "documents.__v": 0,
        "documents.securityUser.isActive": 0,
        "documents.securityUser.isArchived": 0,
        "documents.securityUser.createdAt": 0,
        "documents.securityUser.updatedAt": 0,
        "documents.securityUser.password": 0,
        "documents.securityUser.role": 0,
        "documents.securityUser.__v": 0,
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
    }
  ];

  const result = await Lead.aggregate( this.pipeline);
  // console.log("first result: " , result)
  res.json(result);
  }catch(e) {
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).send(getReasonPhrase(StatusCodes.INTERNAL_SERVER_ERROR));
  }
}

exports.getCountReport = async (req, res, next) => {
  this.securityUserId = req.body.loginUser.userId;
  console.log("this.securityUserID : ", this.securityUserId)
  // let user = await SecurityUser.findById(this.securityUserID).populate({path: 'role', select: 'readAccess'}); 
// console.log(" user : ", user)
  const starTDate = req.body.startDate
  const enDDate = req.body.endDate
  try{

    this.PipeLine = [
      {
        $lookup: {
          from: "SecurityUsers",
          localField: "users",
          foreignField: "_id",
          as: "securityUser"
        }
      },
      {
        $unwind: "$securityUser"
      },
      {
        $lookup: {
          from: "Priorities",
          localField: "priority",
          foreignField: "_id",
          as: "priority"
        }
      },
      {
        $unwind: "$priority"
      },
      {
        $lookup: {
          from: "LeadStatuses",
          localField: "status",
          foreignField: "_id",
          as: "status"
        }
      },
      {
        $unwind: "$status"
      },
      {
        $group: {
          _id: "$securityUser",
          totalCount: { $sum: 1 },
          countsByPriority: {
            $push: {
              priority: "$priority",
              count: { $sum: 1 }
            }
          }
        }
      },
      {
        $project: {
          "securityUser._id": 0,
          "securityUser.isActive": 0,
          "securityUser.isArchived": 0,
          "securityUser.createdAt": 0,
          "securityUser.updatedAt": 0,
          "securityUser.password": 0,
          "securityUser.role": 0,
          "securityUser.__v": 0,
          "priority.isActive": 0,
          "priority.isArchived": 0,
          "priority.createdAt": 0,
          "priority.updatedAt": 0,
          "priority._id": 0,
          "priority.user": 0,
          "priority.__v": 0,
          "status._id": 0,
          "status.isActive": 0,
          "status.isArchived": 0,
          "status.description": 0,
          "status.createdAt": 0,
          "status.updatedAt": 0,
          "status.user": 0,
          "status.__v": 0
        }
      }
    ];

  const result = await Lead.aggregate( this.PipeLine);
  // console.log("first result: " , result)
  res.json(result);
  }catch(e) {
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).send(getReasonPhrase(StatusCodes.INTERNAL_SERVER_ERROR));
  }
}