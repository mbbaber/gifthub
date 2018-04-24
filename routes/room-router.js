// OUR ROUTES ASSOCIATED WITH ROOMS

const express        = require("express");
const passport       = require("passport");
const router         = express.Router();
const ensureLogin    = require( "connect-ensure-login" );

const Room           = require("../models/room-model")


////// ROUTES

router.use( ensureLogin.ensureLoggedIn() );


//  This is my route to individual group page
// router.get('/groups/:groupId', (req, res, next) => {
//     .then(data => {
//         res.locals.groupArray = data.body.items;
//         res.render('room-views/my-room');
//     })
//      .catch(err) => {
//          console.log("You have an error", err);
//     })
// })

// render rooms-list page with user's rooms
router.get("/my-rooms", (req, res, next) => {
    Room.find({members: req.user._id }) //will find only the rooms whose user is the logged-in user.
    .populate("members")
    .then((roomsFromDb) => {
        res.locals.roomList = roomsFromDb;
        res.render("rooms-list");
    })
    .catch((err) => {
        next(err);
    })
});


//CREATE A NEW ROOM/GROUP IN THE DATABASE
router.post("/process-room", (req, res, next) => {
    // if (!req.user) {
    //     res.flash("error", "You must be logged-in to see this page")
    //     res.redirect("/");
    //     return
    // }
    const { name, description, pictureUrl } = req.body;
    //creates room for whomever is logged-in
    console.log(req.user._id)
    const administratorId = req.user._id;
    const member = req.user._id;
    Room.create({ name, description, pictureUrl, administratorId, members: [member]})

    //if I want to add members, i need to use a mongoose operator... something like $push

    //Room.create({name, description, pictureUrl})
    .then(() => {
        console.log("success Room created!");
        res.redirect("/my-rooms");
    })
    .catch((err) => {
        next(err);
    })
});

module.exports = router;
