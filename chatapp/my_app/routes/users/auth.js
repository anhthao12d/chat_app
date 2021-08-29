var express                     = require('express');
var router                      = express.Router();
var jwt                         = require('jsonwebtoken');

const MainValidator				= require(__path_validators + 'auth');
const ParamsHelper				= require(__path_helpers + 'getParams');
const MainModel					= require(__path_models_users + 'users');
const systemConfig 				= require(__path_configs + 'system');
const NotifyConfig 				= require(__path_configs + 'notify');

const layoutFrontend            =  __path_users  + 'login';
const folderView                = __path_users + 'pages/auth/';
const pageTitle                 = 'Login Page';
const linkSingIn                = '/' + systemConfig.prefixUsers +'/accounts/sing-in';

router.get('/:views',(req, res, next) => {
    let views	= ParamsHelper.getParamsHelper(req.params, 'views', 'sing-in');
    let item = {password : '', email: ''};
    if(views == 'sing-up') item.name = '';
    let err = [];
    let notify          = []
    res.render(`${folderView}${views}`, { 
        pageTitle,
        layout   : layoutFrontend,
        item,
        err,
        notify
    });
});

router.post('/sing-up', async(req, res, next) => {
    req.body		    = JSON.parse(JSON.stringify(req.body));
    let item		    = Object.assign(req.body);
    let err 		    =  MainValidator.validatorRegister(req);
    
    await MainModel.find(item.email, {task : 'findOne'}).then( async(user) => {
        if(user) await err.push({param : 'email', msg : NotifyConfig.ERROR_USER_EXIST})
    })
    
    if(err.length != 0) {
        res.render(`${folderView}sing-up`, { pageTitle, layout   : layoutFrontend, item, err});
    }else {
        let data = {password : '', email: ''};
        let notify = [{msg : NotifyConfig.WARNING_ACTIVE__ACCOUNT}]
        item.token = await jwt.sign({ email: item.email }, systemConfig.secretNodemailer);

        MainModel.save(item).then(() => {
            res.render(`${folderView}sing-in`, { pageTitle, layout   : layoutFrontend, item : data, err, notify});
        })
    }
        
});
router.post('/sing-in', async(req, res, next) => {
    req.body		    = JSON.parse(JSON.stringify(req.body));
    let item		    = Object.assign(req.body);
    let err 		    =  MainValidator.validatorLogin(req);
    let notify          = [];
    if(err.length != 0) {
        res.render(`${folderView}sing-in`, { pageTitle, layout   : layoutFrontend, item, err});
    } 
        
});
router.get('/active-account(/:token)?',(req, res, next) => {
    let token	= ParamsHelper.getParamsHelper(req.params, 'token', '');
    console.log(token);
    
});

module.exports = router;