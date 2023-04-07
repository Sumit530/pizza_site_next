const mongoose = require("mongoose")

const Schema = new  mongoose.Schema({
    role : {
        type:Number,  // 1 = basic 2= medium 3 = hard 4 = all rounder 
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