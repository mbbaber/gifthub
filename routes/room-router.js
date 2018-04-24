// OUR ROUTES ASSOCIATED WITH ROOMS

const express        = require("express");
const passport       = require("passport");
const router         = express.Router();
const ensureLogin    = require( "connect-ensure-login" );

const Room           = require("../models/room-model")


////// MIDDLEWARES
//////////////////////////////////////////////////////////////////////////////////

router.use( ensureLogin.ensureLoggedIn("/") );

////// ROUTES
//////////////////////////////////////////////////////////////////////////////////

// This is my route to individual group page
router.get('/groups/:groupId', (req, res, next) => {
    //.then(data => {
        //res.locals.groupArray = data.body.items;
        res.locals.gId = req.params.groupId
        res.render('room-views/my-room');
    })
    // .catch(err) => {
    //      console.log("You have an error", err);
    // })

router.get('/main-room-view', (req, res, next) => {
    //.then(data => {
        //res.locals.groupArray = data.body.items;
        res.render('room-views/main-room-view');
    })

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
router.post("/process-room/", (req, res, next) => {
    const { name, description, pictureUrl } = req.body;
    console.log( req.body );
    const administratorId = req.user._id;
    const members = req.user._id;
    Room.create({ name, description, pictureUrl, members, administratorId })

    //if I want to add members, i need to use a mongoose operator... something like $push

        .then(() => {
            console.log("success Room created!");
            res.redirect("/my-rooms");
        })
        .catch((err) => {
            next(err);
        })
});

// render wish-list page with user's list
router.get("/wishlist:userId", (req, res, next) => {
    Wall.find({ownerId: req.user._id }) //will find only the list whose user is the logged-in user.
    //.populate("members")
    .then((wishlistFromDb) => {
        res.locals.wallList = wishlistFromDb;
        res.render("room-views/my-wishlist");
    })
    .catch((err) => {
        next(err);
    })
});

//CREATE A NEW ITEM IN THE WISHLIST AND IN THE DATABASE
router.post("/process-wishlist-item", (req, res, next) => {
    const { name, description, pictureUrl, price } = req.body;
    const owner = req.user._id;
    Room.create({ name, description, pictureUrl, owner: owner })

        .then(() => {
            console.log("success Item created!");
            res.redirect("room-views/my-wishlist");
        })
        .catch((err) => {
            next(err);
        })
});



module.exports = router;
