const mongoose = require("mongoose")

const Schema = new  mongoose.Schema({

    user_id : {
        type:mongoose.Schema.Types.ObjectId,
        ref : 'users',
        require:true
    },
    follower_id : {
        type:mongoose.Schema.Types.ObjectId,
        ref : 'users',
        require:true
    },
    status : {
        type : Boolean,
        default:true
    }
},
{timestamps:true})
const followers = new mongoose.model("followers",Schema)
module.exports = followers;