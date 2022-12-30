const mongoose = require("mongoose")

const Schema = new  mongoose.Schema({
    email:{
        type:String,
        require:true
    },
    token : {
        type:String,
        require:true
    },
    created_at : {
        type:Date,
        default:null
    }

})

const password_resets = new mongoose.model("password_resets",Schema)
module.exports = password_resets;