const { softDeletePlugin } = require('soft-delete-plugin-mongoose');
const mongoose = require("mongoose")

const Schema = new  mongoose.Schema({
    
    name:{
        type:String,
        require:true
    },
    desrciption : {
        type:String
    },
    status : {
        type:Boolean,
        default:true
    }
},
{timestamps:true})
Schema.plugin(softDeletePlugin)
const video_report_types = new mongoose.model("video_report_types",Schema)
module.exports = video_report_types;


