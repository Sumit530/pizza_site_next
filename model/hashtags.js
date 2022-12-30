const mongoose = require("mongoose")

const Schema = new  mongoose.Schema({
    name : {
        type:String,
        require:true
    },
   
    status : {
        type : Boolean,
        default:true
    },
    deleted_at : {
        type:Date,
        default:null
        
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
const hashtags = new mongoose.model("hashtags",Schema)
module.exports = hashtags;