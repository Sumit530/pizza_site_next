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

const user_report = new mongoose.model("user_supports",Schema)
module.exports = user_report;