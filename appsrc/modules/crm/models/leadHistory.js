const mongoose = require('mongoose');
const uniqueValidator = require('mongoose-unique-validator');
const { softDeletePlugin } = require('soft-delete-plugin-mongoose');
const baseSchema = require('../../../base/baseSchema');
const Schema = mongoose.Schema;

const docSchema = new Schema({

        lead: { type: Schema.Types.ObjectId, ref: 'Lead' },
        // lead Id

        users: [{ type: Schema.Types.ObjectId, ref: 'SecurityUser' }],
        // users is's

        periorty: { type: Schema.Types.ObjectId, ref: 'Periorty' },
        // periorty of lead (high, low or medium)

        businessName: { type: String },
        // Business name of contact person firm

        firstName: { type: String },
        // First name of contact person

        lastName: { type: String },
        // Last name of contact person

        phone: { type: String },
        // phone/mobile numbers.

        alternatePhone: { type: String },
        // phone/mobile numbers.

        email: { type: String },
        // Email addresses. 

        streetAdress: { type: String },
        //

        aptSuite: { type: String },
        //

        city: { type: String },
        //

        postCode: { type: String },
        //

        country: { type: String },
        //

        status: { type: Schema.Types.ObjectId, ref: 'LeadStatus'},
        // guid of lead from leads collection.

        appoinmentDate: { type : Date },

        note: {type: String},
        // lead contact note .

        lat: { type: String },
        // latitude coordinates of site
    
        long: { type: String },
        // // longitude coordinates of site
        updatedAt: { type : Date, default: Date.now },

},
{
        collection: 'LeadHistory'
});
// docSchema.set('timestamps', true);
// docSchema.add(baseSchema.docVisibilitySchema);
docSchema.add(baseSchema.docAuditSchema);

docSchema.plugin(uniqueValidator);

module.exports = mongoose.model('LeadHistory', docSchema);
