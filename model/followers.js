const mongoose = require("mongoose")
const usermodel = require("./users")
const Schema = new  mongoose.Schema({

    user_id : {
        type:mongoose.Schema.Types.ObjectId,
        ref : 'Users',
        require:true
    },
    follower_id : {
        type:mongoose.Schema.Types.ObjectId,
        ref : 'Users',
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