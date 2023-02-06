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
    parent_id : {
        type:mongoose.Schema.Types.ObjectId,
        require:true
    },
    comment : {
        type:String,
        default:null
    },
    mention_user : {
        type:mongoose.Schema.Types.ObjectId,
        ref : 'Users',
        require:true

    },
    status : {
        type:Boolean,
        default:true
    }
},
{timestamps:true})
const videos_comments = new mongoose.model("videos_comments",Schema)
module.exports = videos_comments;
