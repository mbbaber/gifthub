// HOME PAGE AND RELATED INFO

const express = require('express');
const router  = express.Router();
const passport = require("passport");


/* GET home page (index.js) */
router.get('/', (req, res, next) => {
  if( !req.user ) {
    res.render('index', { confirmationCode : "" });
  } else {
    res.redirect( "/my-rooms" );
  }
});

module.exports = router;

