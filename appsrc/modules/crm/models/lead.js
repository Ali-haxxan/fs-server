const mongoose = require('mongoose');
const uniqueValidator = require('mongoose-unique-validator');
const { softDeletePlugin } = require('soft-delete-plugin-mongoose');
const baseSchema = require('../../../base/baseSchema');

const Schema = mongoose.Schema;

const docSchema = new Schema({
        
        user: { type: Schema.Types.ObjectId, ref: 'SecurityUser', required: true},
        // guid of lead from leads collection.

        lead: { type: Schema.Types.ObjectId, ref: 'LeadStatus', required: true},
        // guid of lead from leads collection.
        
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
        // Email addresses. There can be multiple comma separated entries
        
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

module.exports = mongoose.model('Lead', docSchema);
