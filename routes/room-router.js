// OUR ROUTES ASSOCIATED WITH ROOMS

const express        = require("express");
const passport       = require("passport");
const router         = express.Router();
const ensureLogin    = require( "connect-ensure-login" );

const Room           = require("../models/room-model")

<<<<<<< HEAD



router.use( ensureLogin.ensureLoggedIn() );


// ROUTES
///////////////////////////////////////////////////////

// render rooms-list page()
=======
// ROUTES
///////////////////////////////////////////////////////

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

// render rooms-list page
>>>>>>> 16e6ec6d521eeb187140c9b3f4a56908e7e69ccf
router.get("/my-rooms", (req, res, next) => {
    res.render("rooms-list");
});
//     Room.find({member: req.user._id }) //will find only the rooms whose user is the logged-in user.
//     .populate("member")
//     .then((roomsFromDb) => {
//         res.locals.roomList = roomsFromDb;
//         res.render("rooms-list");
//     })
//     .catch((err) => {
//         next(err);
//     })
// });

//CREATE A NEW ROOM/GROUP IN THE DATABASE
router.post("/process-room", (req, res, next) => {
    // if (!req.user) {
    //     res.flash("error", "You must be logged-in to see this page")
<<<<<<< HEAD
    //     res.redirect("/");
=======
    //     res.redirect("/login");
>>>>>>> 16e6ec6d521eeb187140c9b3f4a56908e7e69ccf
    //     return
    // }
    const { name, description, pictureUrl } = req.body;
    //creates room for whomever is logged-in
    const administratorId = req.user._id;
    Room.create({ name, description, pictureUrl: administratorId})

    //Room.create({name, description, pictureUrl})
    .then(() => {
        console.log("success Room created!");
        res.redirect("/my-rooms");
    })
    .catch((err) => {
        next(err);
    })
});

//INVITE FRIENDS/PARTICIPANTS
router.post('/process-invite', (req, res, next) => {
    const {sender, senderEmail, message} = req.body;
    transport.sendMail({
      from: "Your website <website@example.com",
      to: process.env.gmail_user, 
      subject: `${sender} is trying to contact you`,
      text: `
        Name: ${sender}
        Email: ${senderEmail}
        Message: ${message}
      `,
      html: `
      <h1>Contact Form Message<h1>
      <p>Name: <b>${sender}<br></p>
      <p>Email: ${senderEmail}</p>
      <p>Message: ${message}</p>
      `
    })
    .then(() => {
      res.redirect('/');
    })
    .catch((err) => {
      next(err)
    })
    //res.send(req.body); was only for testing purposes
  });

module.exports = router;
