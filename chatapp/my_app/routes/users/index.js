var express = require('express');
var router = express.Router();



router.use('/dang-nhap-dang-ky-thanh-vien',require('./auth'));
// router.use('/',middlewareGetUserInfor,middlewareGetParams,require('./home'));
// router.use('/the-loai',require('./categories'));
// router.use('/thong-tin',require('./contact'));
// router.use('/tin-tuc',require('./generalNews'));
// router.use('/truy-cap',require('./permission'));
module.exports = router;
