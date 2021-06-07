const mongoose = require("mongoose");

const TournamentSchema = new mongoose.Schema({
    name:{
        type: String,
        required: true
    },
    description:{
        type: String,
        required: true
    },
    owner:{
        type: String,
        required: true
    },
    users:{
        type: Array,
        required: true
    },
    isPrivate:{
        type: Boolean,
        default: false
    },
    date:{
        type: Date,
        default: Date.now
    }
});

const Tournament = mongoose.model("Tournaments", TournamentSchema);

module.exports = Tournament;