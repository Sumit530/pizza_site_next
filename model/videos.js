const { softDeletePlugin } = require('soft-delete-plugin-mongoose');
const mongoose = require("mongoose")

const Schema = new  mongoose.Schema({
    user_id : {
        type:mongoose.Schema.Types.ObjectId,
        ref : 'Users',
        require:true
    },
    song_id : {
        type:mongoose.Schema.Types.ObjectId,
        ref : 'songs',
        require:true
    },
    description : {
        type:String,

    },
    is_view : {
        type:Number,
        default:1,
        enum : [1,2,3], // 1=public // 2=freinds 3 = private
    },
    is_allow_comment : {
        type : Boolean,
        default:true
    },
    is_allow_duet : {
        type : Boolean,
        default:true
    },
    is_save_to_device : {
        type : Boolean,
        default:true
    },
    freinds_id : [
        {type:mongoose.Schema.Types.ObjectId,ref:'users'}
    ],
    mention_ids : [
        {type:mongoose.Schema.Types.ObjectId,ref:'users'}
    ],
    cover_image : {
        type:String,
        require:true
    },
    file_name:{
        type:String,
        require:true
    },
    status : {
        type:Boolean,
        default:true
    }
},
{timestamps:true})
Schema.plugin(softDeletePlugin)
const videos = new mongoose.model("videos",Schema)
module.exports = videos;