const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema({
    userID:{
        type: String,
        required: true
    },
    name:{
        type: String,
        required: true
    },
    email:{
        type: String,
        required: true
    },
    password:{
        type: String,
        required: true
    },
    date:{
        type: Date,
        defult: Date.now
    }
});

const User = mongoose.model("Users", UserSchema);

module.exports = User;