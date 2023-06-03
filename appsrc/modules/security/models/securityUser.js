const mongoose = require('mongoose');
const uniqueValidator = require('mongoose-unique-validator');
const { softDeletePlugin } = require('soft-delete-plugin-mongoose');
const baseSchema = require('../../../base/baseSchema');

const Schema = mongoose.Schema;
const docSchema = new Schema({
            
        name: { type: String, required: true},
        // Full name of user

        phone: { type: String },
        // phone/mobile numbers. Phone number must with country code.  

        email: { type: String, unique: true, required: true },
        // Email addresses. 

        password: { type: String,  },
        // password to access portal

        role: { type: Schema.Types.ObjectId, ref: 'SecurityRole' },

},
{
        collection: 'SecurityUsers'
});

docSchema.set('timestamps', true);
docSchema.add(baseSchema.docVisibilitySchema);
docSchema.add(baseSchema.docAuditSchema);

docSchema.plugin(uniqueValidator);

module.exports = mongoose.model('SecurityUser', docSchema);