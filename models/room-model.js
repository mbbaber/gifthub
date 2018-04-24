// sets up Schema for our rooms (aka the groups in which each user is a member)

const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const roomSchema = new Schema ({
    name: {type: String, required: true },
    description: {type: String, required: true },
    pictureUrl: String,
    // who is a part of the group?
    members: [
        {
        type: Schema.Types.ObjectId, //this needs to be several people?
        ref: "User",
        required: true
        }
    ],
    administratorId: {
        type: Schema.Types.ObjectId,
        required: true,
        ref: "User"
    },
}, {
    timestamps: true
});

const Room = mongoose.model("Room", roomSchema);

module.exports = Room;