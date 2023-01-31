const mongoose = require("mongoose")

const Schema = new  mongoose.Schema({
    chat_id :  {
        type:mongoose.Schema.Types.ObjectId,
        ref : 'chats',
        require:true,
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
const chat_setting = new mongoose.model("chat_setting",Schema)
module.exports = chat_setting;