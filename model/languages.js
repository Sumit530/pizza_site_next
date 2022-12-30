const mongoose = require("mongoose")

const Schema = new  mongoose.Schema({

    language_name : {
        type:String,
        require:true
    },
    status: {
        type:Boolean,
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
const languages = new mongoose.model("languages",Schema)
module.exports = languages;