//ALL OUR LOGIN OR SIGNUP STUFF 

const express = require("express");
const bcrypt = require("bcrypt");
const passport = require("passport");
const router = express.Router();

const User = require("../models/user-model");
const Invite = require("../models/invitation-model");
const Room = require("../models/room-model");

// ROUTES
///////////////////////////////////////////////////////

//SIGN UP
router.post( "/process-signup", ( req, res, next ) => {
    const { fullName, email, password } = req.body;

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

    const salt = bcrypt.genSaltSync( 10 );
    const encryptedPassword = bcrypt.hashSync( password, salt );

    User.create({ fullName, email, encryptedPassword })
        .then(() => {
            res.redirect( "/my-rooms" );
        })
        .catch(( err ) => {
            next( err );
        });
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
//             

                // req.query
//             // if you find a name that matches in DB
//             //then, print those names and buttons that say (send group invite)and you notify them by email
//             //when you click on group invite, they appear in the group and the group appears to them
//             }
//         })
//         .catch((err) => {
//             next(err);
//         })
// })


//invites a new user with an email
const nodemailer = require('nodemailer');
const transport = nodemailer.createTransport({
    service: "Gmail",
    auth: {
    user: process.env.gmail_user,
    pass: process.env.gmail_pass
    }
});

// router.post('/process-invite', invite ); could turn this into function later
router.post('/process-invite/:groupId', (req, res, next) => {
    const {email, confirmationCode, message} = req.body;
    
    User.findOne({ email }, "email", (err, user) => {
        if (user !== null) {
        res.render("room-views/my-room", { message: "The email already exists" });
        console.log("The email already exists")
        return;
        }
    
    const salt = bcrypt.genSaltSync(10);
    const hashEmail = bcrypt.hashSync(email, salt);

    const newInvite = new Invite({
      email: email,
      confirmationCode: hashEmail,
      roomsList: req.params.groupId //room we want to invite the user to.
    });

    const saveInvite = newInvite.save();

    router.get("/confirm/:hashEmail", (req, res, next) => {
        res.redirect("confirm")
    })

    //let {fullName, email, message} = req.body;
    const sendMail = transport.sendMail({
            from: "GiftHub <maggie@gifthub.com",
            to: email,
            subject: `(insert name of user here) would like to invite you to join GiftHub`,
            text: `Dear , <br/><br/>
              (insert name of user here) would like to invite you to join GiftHub, the highly-rated and fun gift-exchange application. 
              <br/><br/> Please see the following message from (insert name of user here):
              <br/><br/> ${message}
              <br/><br/>
              Click on this link http://localhost:3000/confirm/${hashEmail} to sign up and access your new group <br/>
            `,
            html: `
            Dear , <br/><br/>
              (insert name of user here) would like to invite you to join GiftHub, the highly-rated and fun gift-exchange application. 
              <br/><br/> Please see the following message from (insert name of user here):
              <br/><br/> ${message}
              <br/><br/>
              Click on this link http://localhost:3000/confirm/${hashEmail} to sign up and access your new group <br/>
            `
          })
          .then(() => {
              res.render('room-views/my-room');
          })
          .catch((err) => {
            next(err)
          })
          //res.send(req.body); was only for testing purposes

          Promise.all([ saveInvite, sendMail ])
            .then(() => {
                res.redirect('/');
            })
            .catch((err) => {
                next(err);
            });
    });
});


module.exports = router; 