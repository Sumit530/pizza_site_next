const mongoose = require("mongoose")

const Schema = new  mongoose.Schema({
    access_token_id : {
        type:mongoose.Schema.Types.ObjectId,
        ref : 'oauth_access_tokens',
        require:true
    },
    revoked : {
        type:Number,
        require:true
    },
    expires_at : {
        type:Date,
        default:null
        
    }
})
const oauth_refresh_token = new mongoose.model("oauth_refresh_token",Schema)
module.exports = oauth_refresh_token;