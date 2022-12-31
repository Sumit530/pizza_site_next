const mongoose = require("mongoose")

const Schema = new  mongoose.Schema({
    user_id : {
        type:mongoose.Schema.Types.ObjectId,
        ref : 'Users',
        require:true
    },
    keyword : {
        type:String,
        require:true
    },
    status : {
        type:Boolean,
        default:true
    }
},
{timestamps:true})
const search_histories = new mongoose.model("search_histories",Schema)
module.exports = search_histories;