const mongoose = require("mongoose")
const { softDeletePlugin } = require('soft-delete-plugin-mongoose');
const Schema = new  mongoose.Schema({
    login_id : {
        type:mongoose.Schema.Types.ObjectId,
        ref : 'Users',
        require:true
    },
    user_id : {
        type:mongoose.Schema.Types.ObjectId,
        ref : 'Users',
        require:true
    },
    content : {
        type:String,
        require:true
    },
    status : {
        type:Boolean,
        default:true
    }
},
{timestamps:true})
Schema.plugin(softDeletePlugin)
const search_histories = new mongoose.model("search_histories",Schema)
module.exports = search_histories;