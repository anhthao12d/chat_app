var express                     = require('express');
var router                      = express.Router();

const layoutFrontend            =  __path_users  + 'login';
const folderView                = __path_users + 'pages/auth/';
const pageTitle                 = 'Login Page';

router.get('/dang-nhap',(req, res, next) => {
    let item = {username : '', password : ''};
    let err = [];
    res.render(`${folderView}index`, { 
        pageTitle,
        layout   : layoutFrontend,
        item,
        err,
    });
});
module.exports = router;