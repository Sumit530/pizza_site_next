const mongoose = require("mongoose")

const Schema = new  mongoose.Schema({

    name : {
        type:String
    },
    status : {
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
const countries = new mongoose.model("countries",Schema)
module.exports = countries;