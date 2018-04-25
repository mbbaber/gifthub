// OUR ROUTES ASSOCIATED WITH ROOMS

const express        = require("express");
const passport       = require("passport");
const router         = express.Router();
const ensureLogin    = require( "connect-ensure-login" );

const User           = require("../models/user-model")
const Room           = require("../models/room-model")
const Wall           = require("../models/wall-model")


////// MIDDLEWARES
//////////////////////////////////////////////////////////////////////////////////

router.use( ensureLogin.ensureLoggedIn("/") );




////// ROUTES
//////////////////////////////////////////////////////////////////////////////////

// This is my route to individual group page (/:wallUserId)?
router.get('/groups/:groupId/:userId', (req, res, next) => {
    var members = [];
    const currentRoomId = req.params.groupId;
    const wallUserId = req.params.userId
    const myUserId = req.user._id.toString(); // Don't know why, but this works...

    const isMyWall = wallUserId == myUserId // hbs doesn't support equal if statements...

    Room.findById(req.params.groupId)
        .populate("members")
        .exec()
        .then(room => {
            // // create a list of only ids
            // res.locals.memberList = populatedRooms.members.map(u => u._id)
            // const listOfIds = res.locals.memberList;    
            // // remove current user's id
            // listOfIds.splice(members.indexOf(req.member._id), 1)
                
            // // add it to the beginning
            // listOfIds.unshift(req.member._id)
            const wallUser = room.members.find(m => (m._id == wallUserId)); 

            const myUser = room.members.find(m => (m._id == myUserId)); // pick only the current user
            members.push({  // move to top
                name: myUser.fullName,  
                link: `/groups/${currentRoomId}/${myUserId}`
            });

            members = members.concat(
                room.members
                    .filter(m => m._id !== myUserId) // remove the current user
                    .map(function(member){
                        return {
                            id: member._id,
                            name: member.fullName,
                            roomId: currentRoomId,
                            link: `/groups/${currentRoomId}/${member._id}`
                        } 
                    })
                )

            const promises = room.members
                                 .find(u => u._id == wallUserId)
                                 .walls
                                 .map(wId => Wall.findById(wId))

            Promise.all(promises)
                .then(walls => {
                    const currentWall = walls.find(w => w.roomId == currentRoomId)

                    res.locals.wall = currentWall
                    res.locals.memberList = members;
                    res.locals.roomId = currentRoomId;
                    res.locals.wallUser = wallUser;
                    res.locals.isMyWall = isMyWall;
                    res.render('room-views/my-room');
                })
        


    }).catch(err => next(err))

        // Room.findById(req.params.groupId, "members", (err, room) => {
        //         var promises = room.members.map((m) => 
        //             User.findById(m, "fullName")
        //         )
        //         // This actually is just what POPULATE does!
        //         Promise.all(promises)
        //                .then((users) => {
        //                    console.log(users)
        //                     res.locals.memberList = users.map((m) => m.fullName)
        //                     res.locals.gId = req.params.groupId
        //                     res.locals.roomId = req.params.groupId
                            
        //                     res.render('room-views/my-room');
        //                })
        //                .catch((err) => {
        //                     next(err)
        //                })      
        //     })

})




// render rooms-list page with user's rooms
router.get("/my-rooms", (req, res, next) => {
    Room.find({members: req.user._id }) //will find only the rooms whose user is the logged-in user.
        .populate("members")
        .then((roomsFromDb) => {
            res.locals.roomList = roomsFromDb.map(function (room) {
                return { 
                    name: room.name, 
                    description: room.description, 
                    link: `/groups/${room._id}/${req.user._id}`
                }
            });
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
        .then(( room ) => {
            Wall.create({
                ownerId: administratorId,
                roomId: room._id,
            })
            .then(wall => {
                User.update({ _id: administratorId },{ $push : { walls : wall._id } })
                .then(() => {
                    console.log("Added user " + administratorId + " to room " + roomId)
                    res.redirect(`/groups/${roomId}`)
                })
                .catch(( err ) => {
                    next( err );
                });


            console.log("success Room created!");
            res.redirect("/my-rooms");
        })
        .catch((err) => {
            next(err);
        });
    });
});


// //INVITE FRIENDS/PARTICIPANTS
router.post('/process-search', (req, res, next) => {
    const { name, roomId } = req.body;
    console.log(roomId)
    User.find({fullName : name})
        .then((users) => {
            var searchResults = [];
            users.forEach((u) => {
                searchResults.push({
                    userId: u._id,
                    userName: u.fullName
                })
            })
            console.log(searchResults)
            res.locals.searchResults = searchResults;
            res.locals.roomId = roomId;
            res.locals.displaySearch = true // just to get back to the search page
            res.render("room-views/my-room")
            // if you find a name that matches in DB
            //then, print those names and buttons that say (send group invite)and you notify them by email
            //when you click on group invite, they appear in the group and the group appears to them
        }) 
        .catch((err) => {
            next(err);
        })
})


// ADD USER IN ROOM
router.post("/add-user-to-room", (req, res, next) => {
    const { userId, roomId } = req.body;
    const myUserId = req.user._id;

    console.log(req.body)
    Room.update(
        { _id: roomId }, 
        { $push : { members : { _id: userId } } }
    ).then(() => {
        Wall.create({
            ownerId: userId,
            roomId,
        }).then(wall => {
            User.update({ _id: userId },{ $push : { walls : wall._id } }
            ).then(() => {
                console.log("Added user " + userId + " to room " + roomId)
                res.redirect(`/groups/${roomId}/${myUserId}`)
            })
        })
      
    })
})

// KICK USER OUT
router.post("/remove-user-from-room", (req, res, next) => {
    
    const { userToDelete, roomId } = req.body;
    const myUserId = req.user._id;
    console.log("Removing "+userToDelete+" from room "+roomId)
    
    Room.findById(roomId)
        .then(room => { // Not sure why... https://stackoverflow.com/questions/42474045/mongoose-remove-element-in-array-using-pull
            room.members.pull({ _id: userToDelete })
            return room.save()
        }).then(() => {
            res.redirect(`/groups/${roomId}/${myUserId}`)
        }).catch(err => next(err))

    //Delete wall too?
})

// PRETTY SURE WE DON'T NEED THIS ANYMORE?
// :::::::::::::::::::::::::::::::::::::::
// // render wish-list page with user's list
// router.get("/wishlist:userId", (req, res, next) => {
//     Wall.find({ownerId: req.user._id }) //will find only the list whose user is the logged-in user.
//     //.populate("members")
//     .then((wishlistFromDb) => {
//         res.locals.wallList = wishlistFromDb;
//         res.render("room-views/my-wishlist");
//     })
//     .catch((err) => {
//         next(err);
//     })
// });





//CREATE A NEW ITEM IN THE WISHLIST AND IN THE DATABASE
router.post("/process-wishlist-item", (req, res, next) => {
    const { title, description, pictureUrl, price, roomId, wallId } = req.body;

    const myUserId = req.user._id
    // const owner = req.user._id;

    console.log(req.body)
    Wall.update({ _id: wallId },
                { $push : { wishlist: { title, description, pictureUrl, price } } })
        .then(() => {
            res.redirect(`/groups/${roomId}/${myUserId}`)

            // User.find()
            // .then(() => {
            //     res.render("room-views/my-room")
            // })
            //res.locals.roomId = roomId;
            // console.log("success Item created!");
            // //res.redirect(`/groups/${roomId}`);
            // res.render("room-views/my-room")

        })
        .catch((err) => {
            next(err);
        })
});
            


module.exports = router;
