// sets up Schema for our rooms (aka the groups in which each user is a member)

const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const roomSchema = new Schema ({
    name: {type: String, required: true },
    description: {type: String, required: true },
    pictureUrl: {
        type: String,
        default: "https://i.pinimg.com/236x/45/a3/c8/45a3c81a5291bfb69de1c362149ed9df.jpg" },
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