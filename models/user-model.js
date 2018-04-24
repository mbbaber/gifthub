const mongoose = require("mongoose");

const Schema = mongoose.Schema;

// Created user schema with user properties

const userSchema = new Schema ({
    fullName: {type: String, required: true },
    email: {type: String, required: true, unique: true },
    pictureUrl: String,
    // Added status and confirmation code in order to work with email invitations
    status: { 
        type: String,
        enum: ["Pending Confirmation", "Active"],
        default: "Pending Confirmation"
    },
    confirmationCode: {type: String, unique: true},
    // normal sign up & login
    encryptedPassword: {type: String, required: true },
    roomsList: [
        {
        type: Schema.Types.ObjectId,
        // unique: true,
        ref: "Room"
        }
    ]

    // login with Google could eventually go here.

}, {
    timestamps: true
});

// Doing our condition here instead of in .hbs
// Define the "isAdmin" fake property
// Can't be an array function bc it uses "this"
userSchema.virtual("isAdmin").get(function () {
    return this.role === "admin";
});

const User = mongoose.model("User", userSchema);

module.exports = User;