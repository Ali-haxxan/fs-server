const mongoose = require('mongoose');
const uniqueValidator = require('mongoose-unique-validator');
const { softDeletePlugin } = require('soft-delete-plugin-mongoose');
const baseSchema = require('../../../base/baseSchema');
const GUID = require('mongoose-guid')(mongoose);
const Schema = mongoose.Schema;

const docSchema = new Schema({
        user: { type: Schema.Types.ObjectId, ref: 'SecurityUser' },
        // guid of customer from customers collection.
        
        name: { type: String, unique: true, required: true },
        // This will be used to handle any kind of comments or notes against any above field
        
        description: { type: String, required: true },
        // This will be used to handle any kind of comments or notes against any above field
},
{
        collection: 'LeadStatuses'
});

docSchema.set('timestamps', true);
docSchema.add(baseSchema.docVisibilitySchema);
docSchema.add(baseSchema.docAuditSchema);
docSchema.plugin(uniqueValidator);

module.exports = mongoose.model('LeadStatus', docSchema);
