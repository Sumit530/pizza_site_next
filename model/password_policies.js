const mongoose = require("mongoose")

const Schema = new  mongoose.Schema({
    minimum_length : {
        type:Number,
        require:true
    },
    complexity : {
        type:Number,  // 1 =easy  2 = simple 3 = hard 
        require:true
    },
    expire : {
        type:Number, //day eg. 30 days
        default:30
        
    }
})
const password_policies = new mongoose.model("password_policies",Schema)
module.exports = password_policies;