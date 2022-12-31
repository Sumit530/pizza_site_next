const mongoose = require("mongoose")

const Schema = new  mongoose.Schema({
    user_id : {
        type:mongoose.Schema.Types.ObjectId,
        ref : 'Users',
        require:true
    },
    video_id : {
        type:mongoose.Schema.Types.ObjectId,
        ref : 'videos',
        require:true
    },
    status : {
        type:Boolean,
        default:true
    }
},
{timestamps:true})
const video_not_intersted = new mongoose.model("video_not_intersted",Schema)
module.exports = video_not_intersted;