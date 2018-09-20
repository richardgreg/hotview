var mongoose = require("mongoose");
var passportLocalMongoose   = require("passport-local-mongoose");
//var bycrypt = require("bycrypt-nodejs");

var UserSchema = new mongoose.Schema({
    username: {type: String, unique: true, required: true},
    password: String,
    firstName: String,
    lastName: String,
    email: {type: String, unique: true, required: true},
    avatar: String, //Add default string it goes to if empty
    resetPasswordToken: String,
    resetPasswordExpires: Date,
    isAdmin: {type: Boolean, default: false}
});

UserSchema.plugin(passportLocalMongoose);

module.exports = mongoose.model("User", UserSchema);