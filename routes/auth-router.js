//ALL OUR LOGIN OR SIGNUP STUFF 

const express = require("express");
const bcrypt = require("bcrypt");
const passport = require("passport");
const router = express.Router();

const User = require("../models/user-model");



// ROUTES
///////////////////////////////////////////////////////

router.post( "/process-signup", ( req, res, next ) => {
    const { fullName, email, password } = req.body;
    // Here we prepare the name, the email and the password.
    // Name and email are just gonna be sent to, the server
    // password will be encrypted, then sent to the server

    if( fullName === "" ) {
        res.redirect( "/index", { message: "The name can't be empty!" } );
        return;
    }

    if( password === "" || password.length < 5 ) {
        res.redirect( "/index", { message: "The password can't be empty, and must be longer than 4 signs!" } );
        return;
    }

    if( email === "" ) {
        res.redirect( "/index", { message: "The email can't be empty!" } );
        return;
    }
    // If the password field is empty, or if there's not at least one digit, it will just redirect to the homepage and "return", so the code below won't run.

    const salt = bcrypt.genSaltSync( 10 );
    // Here, we generate our "salt", and capture it in a const. It's sort of a unique key to encrypt our password

    const encryptedPassword = bcrypt.hashSync( password, salt );
    // Here, we encrypt our pawwsord, somehow mixing it with our "salt"

    User.create({ fullName, email, encryptedPassword })
        .then(() => {
            res.redirect( "/my-rooms" );
        })
        .catch(( err ) => {
            next( err );
        })
});












///////////////////////////////////////////////////////



module.exports = router; 