const mongoose = require("mongoose")

const Schema = new  mongoose.Schema({
    user_id : {
        type:mongoose.Schema.Types.ObjectId,
        ref : 'Users',
        require:true
    },
    reporter_id : {
        type:mongoose.Schema.Types.ObjectId,
        ref : 'Users',
        require:true
    },
    reason:{
        type:String,
        require:true,
    },
    description : {
        type:String,
        require:true,
    },
    photos : [
        {
            type:String
        }
    ],
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

const user_report = new mongoose.model("user_reports",Schema)
module.exports = user_report;