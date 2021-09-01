const { body }      = require('express-validator');
const util 		    = require('util');
const notifyConfig  = require(__path_configs +'notify');
const options   = {
    password        : { min: 8},
   
};
module.exports  = {
    validatorRegister: [
        body('name', notifyConfig.ERROR_NAME)
            .not().isEmpty(),
        body('email', notifyConfig.ERROR_EMAIL)
            .isEmail(),
        body('password', util.format(notifyConfig.ERROR_PASSWORD_LENGTH, options.password.min))
            .isLength({min: options.password.min})
    ],
    validatorLogin: [
        body('email', notifyConfig.ERROR_EMAIL)
            .isEmail(),
        body('password', util.format(notifyConfig.ERROR_PASSWORD_LENGTH, options.password.min))
            .isLength({min: options.password.min})
    ]
    
}