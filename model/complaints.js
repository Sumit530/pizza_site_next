const mongoose = require("mongoose")

const Schema = new  mongoose.Schema({
    user_id : {
        type:mongoose.Schema.Types.ObjectId,
        ref : 'Users',
        require:true
    },
   
    description : {
        type:String,
        require:true,
    },
    status : {
        type:Boolean,
        default:true
    }

},
{timestamps:true})

const complaints = new mongoose.model("complaints",Schema)
module.exports = complaints;