const { body }      = require('express-validator');
const util 		    = require('util');
const notifyConfig  = require(__path_configs +'notify');
const options   = {
    password        : { min: 8},
   
};
module.exports  = {
    validatorRegister: (req) => {
        req.checkBody('name', notifyConfig.ERROR_NAME)
            .not().isEmpty()
        req.checkBody('email', notifyConfig.ERROR_EMAIL)
            .isEmail()
        req.checkBody('password', util.format(notifyConfig.ERROR_PASSWORD_LENGTH, options.password.min))
            .isLength({min: options.password.min})

        let errors = req.validationErrors() !== false ? req.validationErrors() : [];
        return errors;
    },
    validatorLogin: (req) => {
        req.checkBody('email', notifyConfig.ERROR_EMAIL)
            .isEmail()
        req.checkBody('password', util.format(notifyConfig.ERROR_PASSWORD_LENGTH, options.password.min))
            .isLength({min: options.password.min})

        let errors = req.validationErrors() !== false ? req.validationErrors() : [];
        return errors;
    }
    
}