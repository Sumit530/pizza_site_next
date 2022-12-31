const mongoose = require("mongoose")

const Schema = new  mongoose.Schema({
    user_id : {
        type:mongoose.Schema.Types.ObjectId,
        ref : 'Users',
       
    },
    video_id : {
        type:mongoose.Schema.Types.ObjectId,
        ref : 'videos',
       
    },
    type : {
        type:String,
        enum : [1,2] // 1 = user 2 = content
    }, 
    description : {
        type:String,

    }, 
    status : {
        type:Boolean,
        default:true
    }
},{timestamps:true})
const video_reports = new mongoose.model("video_reports",Schema)
module.exports = video_reports;