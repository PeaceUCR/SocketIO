/**
 * Created by hea on 6/13/18.
 */

const mongoose = require('mongoose');

const messageSchema = mongoose.Schema({
    userId: {type: mongoose.Schema.Types.ObjectId, ref: 'User'},
    content: {type: String},
    room: {type: String},
    date:  { type: Date, default: Date.now }
});
module.exports = mongoose.model('Message', messageSchema);