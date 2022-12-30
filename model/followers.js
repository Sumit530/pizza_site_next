const mongoose = require("mongoose")

const Schema = new  mongoose.Schema({

    user_id : {
        type:mongoose.Schema.Types.ObjectId,
        ref : 'User',
        require:true
    },
    follower_id : {
        type:mongoose.Schema.Types.ObjectId,
        ref : 'User',
        require:true
    },
    status : {
        type : Boolean,
        default:true
    },
    created_at : {
        type:Date,
        default:Date.now()
        
    },
    updated_at : {
        type:Date,
        default:null
        
    }
})
const followers = new mongoose.model("followers",Schema)
module.exports = followers;