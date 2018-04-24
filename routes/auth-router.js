//ALL OUR LOGIN OR SIGNUP STUFF 

const express = require("express");
const bcrypt = require("bcrypt");
const passport = require("passport");
const router = express.Router();

const User = require("../models/user-model");

// ROUTES
///////////////////////////////////////////////////////
//SIGN UP
router.post( "/process-signup", ( req, res, next ) => {
    const { fullName, email, password } = req.body;
    // Here we prepare the name, the email and the password.
    // Name and email are just gonna be sent to, the server
    // password will be encrypted, then sent to the server

    if( fullName === "" ) {
        res.render( "index", { nameMessage: "The name can't be empty!" } );
        return;
    }

    if( password === "" || password.length < 5 ) {
        res.render( "index", { passwordMessage: "The password can't be empty, and must be longer than 4 signs!" } );
        return;
    }

    if( email === "" ) {
        res.render( "index", { emailMessage: "The email can't be empty!" } );
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

//SIGN OUT
router.post( "/process-login", ( req, res, next ) => {
    const { email, password } = req.body;
    // Je récupère l'email et le password que la personne a rentrés dans les champs, via req.body

    User.findOne({ email })
    // Je demande de fouiller dans la data base "User", et de trouver l'email entré par l'utilisateur (que je viens de récupérer dans la const)
    
        .then(( userDetails ) => {
        // if the email doesn't exist in the DB, there won't be an error, userDetails will be falsy

        if( !userDetails ) {
        // Here, by "!userDetails", I just check if it's falsy. If it is, I redirect and return.

            res.render( "index", { noUserMessage: "Seems you're not in the database, try signing up first!" } );
            return;
        }
        
        const { encryptedPassword } = userDetails;
        // I retrieve the "encryptedPassword" variable from the userDetails

        if( !bcrypt.compareSync( password, encryptedPassword )) {
        // Here, I check if the bcrypt "compareSync" method returns true. If not, I redirect to the login page
            
            res.render( "index", { wrongPasswordMessage: "Oops, maybe you misstiped?" }  );
            return;
        }
        
        req.login( userDetails, () => {
        // "req.login()" is Passport's method for logging a user in

            res.redirect( "/my-rooms" );
        });

        })
        .catch(( err ) => {

        })
});

//LOGOUT
router.get( "/logout", ( req, res, next ) => {
    req.logout();
    // "req.logout()" is Passport's method for logging a user out

    res.redirect( "/" );
});


// //ADD A NEW PERSON TO ROOM (will probably embed this into another function)
// router.post("/process-room", (req, res, next) => {
//     const { name, email } = req.body;
//     // roomList - add object in this array with room
//     const administratorId = req.user._id;
//     const members = req.user._id;
//     User.create({name, email })
    
//     //also need to PUSH member to "members" in group schema

//         .then(() => {
//             console.log("success person added to room!");
//             res.redirect("/my-room");
//         })
//         .catch((err) => {
//             next(err);
//         })
// });


// //INVITE FRIENDS/PARTICIPANTS
// router.post('/process-search', (req, res, next) => {
//     const {name} = req.body;
//     User.findOne({name})
//         .then((userDetails) => {
//             if (!userDetails) { // if no name matches in DB, 
//                 console.log("no user by that name was found")
//                                 // print or redirect to process-invite from (below)
//             // req.query
//             // if you find a name that matches in DB
//             //then, print those names and buttons that say (send group invite)and you notify them by email
//             //when you click on group invite, they appear in the group and the group appears to them
//             }
//         })
//         .catch((err) => {
//             next(err);
//         })
// })





// router.post('/process-invite', invite );
// //this is a function that invites a new user with an email

// function invite(req, res, next) {
//     let {name, email, message} = req.body;
//     transport.sendMail({
//       from: "Your website <website@example.com",
//       to: email,
//       //subject: `${the current user} would like to invite you to join GiftHub`,
//       text: `
//         Message: ${this.fullName} would like to invite you to join GiftHub, the highly-rated and fun gift-exchange application. Please see the following message from ${this.fullName}:
//         ${message}
//         To join your new group, please visit this link:
//         LINK HERE! 
//         and sign up for Gifthub!
//       `,
//       html: `
//       <p>Message: ${message}</p> // Copy and paste from about text-message
//       `
//     })
//     .then(() => {
//       res.redirect('/my-room');
//     })
//     .catch((err) => {
//       next(err)
//     })
//     //res.send(req.body); was only for testing purposes
// }


module.exports = router; 