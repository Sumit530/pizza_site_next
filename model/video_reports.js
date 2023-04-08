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
    reporter_id :{
        type:mongoose.Schema.Types.ObjectId,
        ref : 'Users',  
    },
    type : {
        type:Number,
        enum : [1,2] // 1 = user 2 = content
    }, 
    images : [{
        type:String,
    }],
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