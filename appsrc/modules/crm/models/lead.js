const mongoose = require('mongoose');
const uniqueValidator = require('mongoose-unique-validator');
const { softDeletePlugin } = require('soft-delete-plugin-mongoose');
const baseSchema = require('../../../base/baseSchema');
// const patchHistory = require('mongoose-patch-history');
// const mongooseHistory = require('mongoose-history')
const Schema = mongoose.Schema;

const docSchema = new Schema({
        
        users: [{ type: Schema.Types.ObjectId, ref: 'SecurityUser', required: true}],
        // guid of lead from leads collection.
        periorty: { type: Schema.Types.ObjectId, ref: 'Periorty', required: true},
        // periorty of lead (high, low or medium)

        businessName: { type: String, required: true},
        // Business name of contact person firm

        firstName: { type: String, required: true},
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
        
        status: { type: Schema.Types.ObjectId, ref: 'LeadStatus', required: true},
        // guid of lead from leads collection.

        appoinmentDate: { type : Date, default: Date.now },
        // lead contact note .
        
        note: {type: String},
        // lead contact note .
        
        lat: { type: String },
        // latitude coordinates of site
    
        long: { type: String },
        // // longitude coordinates of site

},
{
        collection: 'Leads'
});
docSchema.set('timestamps', true);
docSchema.add(baseSchema.docContactSchema)
docSchema.add(baseSchema.docAddressSchema);
docSchema.add(baseSchema.docVisibilitySchema);
docSchema.add(baseSchema.docAuditSchema);

docSchema.plugin(uniqueValidator);
// docSchema.plugin(patchHistory, { mongoose, name: 'lead_patc_hHistory' });
// docSchema.plugin(mongooseHistory);

module.exports = mongoose.model('Lead', docSchema);
