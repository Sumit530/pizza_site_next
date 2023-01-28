const mongoose = require("mongoose")

const Schema = new  mongoose.Schema({
    users : [ {
        type:mongoose.Schema.Types.ObjectId,
        ref : 'users',
        require:true,
        timestamps:true
    }],
    creater : {
        type:mongoose.Schema.Types.ObjectId,
        ref : 'users',
        require:true
    },
    name : {
        type:String, // name of chat it would be username or groupname
        require:true
    },
    profile_image:{
        type:String,
        require:true
    },
    is_group_chat : {
        type:Boolean,
        default:false
    },
    status : {
        type:Boolean,
        default:true
    }

},
{timestamps:true})
const chats = new mongoose.model("chats",Schema)
module.exports = chats;