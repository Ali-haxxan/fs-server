const mongoose = require('mongoose');
const uniqueValidator = require('mongoose-unique-validator');
const { softDeletePlugin } = require('soft-delete-plugin-mongoose');
const baseSchema = require('../../../base/baseSchema');

const Schema = mongoose.Schema;

const docSchema = new Schema({
        

        name: { type: String, unique: true, required: true},
        // Name of periorty
        
        priority: { type: Number, required: true},

},
{
        collection: 'Priorities'
});
docSchema.set('timestamps', true);
docSchema.add(baseSchema.docContactSchema)
docSchema.add(baseSchema.docAddressSchema);
docSchema.add(baseSchema.docVisibilitySchema);
docSchema.add(baseSchema.docAuditSchema);

docSchema.plugin(uniqueValidator);

module.exports = mongoose.model('Priority', docSchema);
