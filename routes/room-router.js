// OUR ROUTES ASSOCIATED WITH ROOMS

const express = require("express");

const Room = require("../models/room-model")

const router = express.Router();

// render rooms-list page
router.get("/my-rooms", (req, res, next) => {
    res.render("rooms-list");
    //Room.find({member: req.user._id }) //will find only the rooms whose user is the logged-in user.
    //.populate("member")
    //.then((roomsFromDb) => {
    //    res.locals.roomList = roomsFromDb;
    //    res.render("rooms-list");
    // })
    // .catch((err) => {
    //     next(err);
    // })
});

router.post("/process-room", (req, res, next) => {
    if (!req.user) {
        res.flash("error", "You must be logged-in to see this page")
        res.redirect("/");
        return
    }
    const { name, description, pictureUrl } = req.body;
    //creates room for whomever is logged-in
    Room.create({ name, description, pictureUrl, owner: req.user._id })
    .then(() => {
        //res.flash("success", "Room created!");
        res.redirect("/");
    })
    .catch((err) => {
        next(err);
    })
});

module.exports = router;
