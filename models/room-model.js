// sets up Schema for our rooms (aka the groups in which each user is a member)

const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const roomSchema = new Schema ({
    name: {type: String, required: true },
    description: {type: String, required: true },
    pictureUrl: {type: String, required: true },
    // who is a part of the group?
    member: {
        type: Schema.Types.ObjectId, //this needs to be several people?
        ref: "User",
        required: true
    }, 
    administrator: {type: String, required: true },
}, {
    timestamps: true
});

const Room = mongoose.model("Room", roomSchema);
module.exports = Room;