const mongoose = require("mongoose")

const Schema = new  mongoose.Schema({
    user_id : {
        type:mongoose.Schema.Types.ObjectId,
        ref : 'Users',
        require:true
    },
    comment_id : {
        type:mongoose.Schema.Types.ObjectId,
        require:true,
        ref : 'videos_comments',
    }, 
    status : {
        type:Boolean,
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
const video_comment_pinneds = new mongoose.model("video_comment_pinneds",Schema)
module.exports = video_comment_pinneds;