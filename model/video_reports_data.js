const mongoose = require("mongoose")

const Schema = new  mongoose.Schema({
        report_id : {
            type:mongoose.Schema.Types.ObjectId,
            ref:"video_reports"
        },
        file_name:{
            type:String
        },
        status : {
            type:Boolean,
            default:true
        }

},
{timestamps:true})
const video_reports_data = new mongoose.model("video_reports_data",Schema)
module.exports = video_reports_data;