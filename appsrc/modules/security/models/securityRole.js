const mongoose = require('mongoose');
const uniqueValidator = require('mongoose-unique-validator');
const { softDeletePlugin } = require('soft-delete-plugin-mongoose');
const GUID = require('mongoose-guid')(mongoose);
const baseSchema = require('../../../base/baseSchema');

const Schema = mongoose.Schema;
const docSchema = new Schema({
                
                name: { type: String, required: true , unique: true},
                // name of role
                
                description: { type: String, required: true},
                // discription of role

                readAccess: { type: Boolean, default: false},
                //will be used to assign all module , like Administrator

                writeAccess: { type: Boolean, default: false},
                //enable write access for all module , like for Administrator

                updateAccess: { type: Boolean, default: false},
                //enable update access for all module , like for Administrator

                deleteAccess: { type: Boolean, default: false},
                //enable delete access for all module , like for Administrator

},
{
        collection: 'SecurityRoles'
});

docSchema.set('timestamps', true);
docSchema.add(baseSchema.docVisibilitySchema);
docSchema.add(baseSchema.docAuditSchema);

docSchema.plugin(uniqueValidator);

module.exports = mongoose.model('SecurityRole', docSchema);