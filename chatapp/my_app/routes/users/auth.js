var express                     = require('express');
var router                      = express.Router();
var jwt                         = require('jsonwebtoken');
var passport                    = require('passport');
const { validationResult } 	    = require('express-validator');
var bcrypt                      = require('bcrypt');
var randomstring                = require("randomstring");
const MainValidator				= require(__path_validators + 'auth');
const ParamsHelper				= require(__path_helpers + 'getParams');
const MainModel					= require(__path_models_users + 'users');
const systemConfig 				= require(__path_configs + 'system');
const NotifyConfig 				= require(__path_configs + 'notify');

const layoutFrontend            =  __path_users  + 'login';
const folderView                = __path_users + 'pages/auth/';
const pageTitle                 = 'Login Page';
const linkSingIn                = '/' + systemConfig.prefixUsers +'/accounts/sing-in';
const FacebookStrategy          = require('passport-facebook').Strategy
const GoogleStrategy            = require('passport-google-oauth20').Strategy;
const folderView2	            =  '/accounts/sing-in';
const saltRounds                = 10;

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

router.post('/sing-up/', MainValidator.validatorRegister, async(req, res, next) => {
    req.body		    = JSON.parse(JSON.stringify(req.body));
    let item		    = Object.assign(req.body);
    const errors 	    = validationResult(req);
    let err 		    =  errors.array();
    
    await MainModel.find(item.email, {task : 'find-email'}).then((user) => {
        if(user)  err.push({param : 'email', msg : NotifyConfig.ERROR_USER_EXIST})
    })
    
    if(err.length != 0) {
        res.render(`${folderView}sing-up`, { pageTitle, layout   : layoutFrontend, item, err});
        
    }else {
        let data = {password : '', email: ''};
        let notify = [{msg : NotifyConfig.WARNING_ACTIVE__ACCOUNT}];
        item.user_id = randomstring.generate(32);
        item.token = await jwt.sign({ user_id: item.user_id }, systemConfig.secretNodemailer);

        MainModel.save(item, {task : 'sing-up'}).then((result) => {
            res.render(`${folderView}sing-in`, { pageTitle, layout   : layoutFrontend, item : data, err, notify});
        })
    }
        
});
router.post('/sing-in',MainValidator.validatorLogin, async(req, res, next) => {
    req.body		    = JSON.parse(JSON.stringify(req.body));
    let item		    = Object.assign(req.body);
    const errors 	    = validationResult(req);
    let err 		    =  errors.array();
    const notify        = [];
    if(err.length != 0) {
        res.render(`${folderView}sing-in`, { pageTitle, layout   : layoutFrontend, item, err, notify});
    } else {
        MainModel.find(item.email, {task : 'check-password'}).then( async(user) => {
            let err= [];
            if(!user) {
                err = [{param : 'email', msg : NotifyConfig.ERROR_USER_NOT_EXIST}];
                res.render(`${folderView}sing-in`, { pageTitle, layout   : layoutFrontend, item, err, notify});
            } else {
                if(user.status != 'active') {
                    let notify = [{msg : NotifyConfig.WARNING_ACTIVE__ACCOUNT}];
                    err = [];
                    res.render(`${folderView}sing-in`, { pageTitle, layout   : layoutFrontend, item, err, notify});
                    
                } else if(await  bcrypt.compare(item.password, user.password) == false ) {
                    err = [{param : 'password', msg : NotifyConfig.ERROR_PASSWORD_FALSE}];
                    res.render(`${folderView}sing-in`, { pageTitle, layout   : layoutFrontend, item, err, notify});
                }
                
            }
            
        })
        
    }
        
});
// Active Account
router.get('/active-account(/:token)?',(req, res, next) => {
    let token	= ParamsHelper.getParamsHelper(req.params, 'token', '');
    console.log(token);
    
});
// Facebook
router.get('/auth/facebook', passport.authenticate('facebook', { scope : ['email'] })
);

router.get('/facebook/secrets', async(req, res, next) => {
    passport.authenticate('facebook', function(err, user, info) {
        if (err) {  return next(err); }
        if (!user) {
            let err = []
            let data = {password : '', email: ''};
            let notify = [{msg : NotifyConfig.ERROR_GOOGLE_FACEBOOK_SINGIN_SINGUP}];
            res.render(`${folderView}sing-in`, { pageTitle, layout   : layoutFrontend, item : data, err, notify});
        
        }
        req.logIn(user, function(err) {
            if (err) { return next(err); }
            else { 
                let err = []
                let data = {password : '', email: ''};
                let notify = [{msg : 'Thanh cong'}];
                res.render(`${folderView}sing-in`, { pageTitle, layout   : layoutFrontend, item : data, err, notify});
            }
        
        });
    })(req, res, next)
});

passport.use(new FacebookStrategy(systemConfig.facebook,  async(accessToken, refreshToken, profile, done) => {
    await MainModel.find(profile._json.id, {task : 'find-user_id'}).then((user) => {
        if(user) {
            return done(null,user);
        } else {
            user = profile._json.id;
            let item = {
                name : (profile._json.name != '') ? profile._json.give_name : 'user',
                email : (profile._json.email != '') ? profile._json.email : '',
                user_id : profile._json.id,
                passport : bcrypt.hash(randomstring.generate(10), saltRounds),
            }
            MainModel.save(item, {task : 'google-facebook'}).then((result) => {
                return done(null, user);
            })
        }
        
    })
}
));

// Google
router.get('/auth/google',
    passport.authenticate('google', { scope: ['profile','email'] })
);

router.get('/google/callback', async(req, res, next) => {
    passport.authenticate('google', function(err, user, info) {
        if (err) {  return next(err); }
        if (!user) {
            let err = []
            let data = {password : '', email: ''};
            let notify = [{msg : NotifyConfig.ERROR_GOOGLE_FACEBOOK_SINGIN_SINGUP}];
            res.render(`${folderView}sing-in`, { pageTitle, layout   : layoutFrontend, item : data, err, notify});
           
        }
        req.logIn(user, function(err) {
            if (err) { return next(err); }
            else { 
                let err = []
                let data = {password : '', email: ''};
                let notify = [{msg : 'Thanh cong'}];
                res.render(`${folderView}sing-in`, { pageTitle, layout   : layoutFrontend, item : data, err, notify});
            }
           
        });
    })(req, res, next);
}
);
passport.use(new GoogleStrategy(systemConfig.google,  async(accessToken, refreshToken, profile, cb) =>{
    MainModel.find(profile._json.sub, {task : 'find-user_id'}).then((user) => {
        if(user) {
            return cb(null,user);
        } else {
            user = profile._json.sub;
            let item = {
                name : (profile._json.given_name != '') ? profile._json.give_name : 'user',
                email : profile._json.email,
                user_id : profile._json.sub,
                passport : bcrypt.hash(randomstring.generate(10), saltRounds),
            }
            MainModel.save(item, {task : 'google-facebook'}).then((result) => {
                return cb(null, user);
            })
        }
        
    })
}
));

passport.serializeUser(function(user, done) {
    done(null,user);
});
passport.deserializeUser(function(user, done) {
    done(null,user)
});
module.exports = router;