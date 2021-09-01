const MainModel 	= require(__path_schemas + 'users');
var bcrypt          = require('bcrypt');

const nodemailer    = require(__path_configs + 'nodemailer');

const saltRounds    = 10;

module.exports = {
    // find
    find : (data, options = null) => {
        if(options.task == 'find-email'){
            return MainModel.findOne({email : data}, {_id : 1});
        }

        if(options.task == 'check-password'){
            return MainModel.findOne({email : data}, {_id : 1, email: 1, password : 1, status : 1});
        }
        if(options.task == 'find-user_id'){
            return MainModel.findOne({user_id : data}, {user_id : 1});
        }
    },
    save : async(item, options = null) => {
        item.created= {
            user_name: item.name,
            time: Date.now(),
        };
        item.role = 'client';
        if(options.task == 'sing-up'){
            nodemailer.sendConfirmationEmail(item.name,item.email,item.token);
            item.password = await bcrypt.hash(item.password, saltRounds);
            item.status = 'inactive';
        }
        if(options.task == 'google-facebook'){
            item.status = 'active';
        }
        return new MainModel(item).save();
        
    },
}