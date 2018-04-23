// HOME PAGE AND RELATED INFO

const express = require('express');
const router  = express.Router();

/* GET home page (index.js) */
router.get('/', (req, res, next) => {
  res.render('index');
});

module.exports = router;
