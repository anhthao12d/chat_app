var express = require('express');
var router = express.Router();



router.use('/accounts',require('./auth'));

module.exports = router;
