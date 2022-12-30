const mongoose = require("mongoose")

const Schema = new  mongoose.Schema({
    client_id : {
        type:mongoose.Schema.Types.ObjectId,
        ref : 'User',
        require:true
    },
    created_at : {
        type:Date,
        default:null
        
    },
    updated_at : {
        type:Date,
        default:null
        
    },
})

const oauth_personal_access_clients = new mongoose.model("oauth_personal_access_clients",Schema)
module.exports = oauth_personal_access_clients;