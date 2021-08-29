const mongoose          = require('mongoose');
const databaseConfig    = require(__path_configs + 'database');
let schema = new mongoose.Schema({
    name: String,
    password: String, 
    email : String,
    status : String,
    created: {
        user_id: String,
        user_name: String,
        time: Date,
    },
    modified: {
        user_id: String,
        user_name: String,
        time: Date,
    },
})
module.exports  = mongoose.model(databaseConfig.col_users , schema); 