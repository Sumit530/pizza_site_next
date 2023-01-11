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
const failed_jobs = new mongoose.model("failed_jobs",Schema)
module.exports = failed_jobs;