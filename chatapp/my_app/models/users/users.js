const MainModel 	= require(__path_schemas + 'users');
var bcrypt          = require('bcrypt');

const nodemailer    = require(__path_configs + 'nodemailer');

const saltRounds    = 10;

module.exports = {
    // find
    find : (data, options) => {
        if(options.task == 'findOne'){
            return MainModel.findOne({email : data}, {_id : 1}) 
        }
    },
    save : async(item) => {
        nodemailer.sendConfirmationEmail(item.name,item.email,item.token);
        item.password = await bcrypt.hash(item.password, saltRounds);
        item.status = 'inactive';
        item.created= {
            user_name: item.name,
            time: Date.now(),
        };
        return new MainModel(item).save();
        
    },
}