const mongoose = require("mongoose")

const Schema = new  mongoose.Schema({
    type : {
        type:Number,
    },
   
    name : {
        type:String,
        require:true
    },
    email:{
        type:String
    },
    status : {
        type:String,
    },
    password:{
        type:String
    }
},{timestamps:true})
const admins = new mongoose.model("admins",Schema)
module.exports = admins;