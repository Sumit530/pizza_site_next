const mongoose = require("mongoose")

const Schema = new  mongoose.Schema({
    
    name:{
        type:String,
        require:true
    },
    desrciption : {
        type:String
    },
    deleted_at : {
    type:Date,
    default:null
    
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
const video_report_types = new mongoose.model("video_report_types",Schema)
module.exports = video_report_types;