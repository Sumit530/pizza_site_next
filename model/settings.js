const mongoose = require("mongoose")

const Schema = new  mongoose.Schema({
    terms_of_use :{
        type:String,
    },
    privacy_policy :{
        type:String,
    },
    copyright_policy :{
        type:String,
    },
    status : {
        type:Boolean,
        default:true
    },
    created_at : {
        type:Date,
        default:null
        
    },
    updated_at : {
        type:Date,
        default:null
        
    }
})
const settings = new mongoose.model("settings",Schema)
module.exports = settings;