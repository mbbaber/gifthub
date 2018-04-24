const mongoose = require("mongoose");

const Schema = mongoose.Schema;

// Created user schema with pending user properties (aka who we are sending invitations to)

const inviteSchema = new Schema ({
    email: {type: String, required: true, unique: true },
    confirmationCode: {type: String, unique: true},
    roomsList: [
        {
        type: Schema.Types.ObjectId,
        // unique: true,
        ref: "Room"
        }
    ]
}, {
    timestamps: true
});

const Invite = mongoose.model("Invite", inviteSchema);

module.exports = Invite;