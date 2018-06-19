/**
 * Created by hea on 5/29/18.
 */

const mongoose = require('mongoose');
const bcrypt = require('bcrypt-nodejs');

const userSchema = mongoose.Schema({
    username: {type: String},
    email: {type: String, unique: true},
    password:  {type: String},
    userImage:  {type: String,  default: '/default.png'},
    google:  {type: String,  default: ''},
    googleTokens: Array,
    timeCreated: { type: Date, default: Date.now },
    lastLogin: { type: Date },
    isOnline: Boolean,
    sentRequest: [{
        userId: {type: mongoose.Schema.Types.ObjectId, ref: 'User'}
    }],
    request: [{
        userId: {type: mongoose.Schema.Types.ObjectId, ref: 'User'}
    }],
    friendsList: [{
        userId: {type: mongoose.Schema.Types.ObjectId, ref: 'User'}
    }]
});

userSchema.methods.encryptPassword = function (password) {
    return bcrypt.hashSync(password, bcrypt.genSaltSync(10), null);

}

userSchema.methods.validatePassword = function (password) {
    return bcrypt.compareSync(password, this.password);
}

module.exports = mongoose.model('User', userSchema);