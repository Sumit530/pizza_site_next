const mongoose = require("mongoose")

const Schema = new  mongoose.Schema({
    chat_id :  {
        type:mongoose.Schema.Types.ObjectId,
        ref : 'chats',
        require:true,
    },
    delete_chats : {
        type:Number, // 1 = after view 2 = after 24 hours
        require:true,
        default:1
    },
    status : {
        type:Boolean,
        default:true
    }

},
{timestamps:true})
const chat_setting = new mongoose.model("chat_setting",Schema)
module.exports = chat_setting;