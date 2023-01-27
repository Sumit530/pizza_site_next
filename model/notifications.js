const mongoose = require("mongoose")

const Schema = new  mongoose.Schema({
    user_id : {
        type:mongoose.Schema.Types.ObjectId,
        ref : 'Users',
        require:true
    },
    receiver_id : {
        type:mongoose.Schema.Types.ObjectId,
        ref : 'Users',
      
    },
    video_id : {
        type:mongoose.Schema.Types.ObjectId,
        ref : 'videos',
      
    },
    follower_id : {
        type:mongoose.Schema.Types.ObjectId,
        ref : 'followers',
        
    },
    mention_id : {
        type:mongoose.Schema.Types.ObjectId,
    },
    comment_id :{
        type:mongoose.Schema.Types.ObjectId,
        ref:"video_comments"
    },
    type :{
        type:Number,
        // 1 = likes  ||  2 = comment || 3 = followers || 4 = mention  || 5 = swipeup 
    },
    status : {
        type:Boolean,
        default:true
    }
},
{timestamps:true})
const notifications = new mongoose.model("notifications",Schema)
module.exports = notifications;