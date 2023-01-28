const mongoose = require("mongoose")

const Schema = new  mongoose.Schema({
    chat_id : {
        type:mongoose.Schema.Types.ObjectId,
        ref : 'chats',
        require:true
    },
    user_id : {
        type:mongoose.Schema.Types.ObjectId, // user id of message sender
        ref : 'users',
        require:true
    },
    message : {
        type:String, //message contnent
        require:true
    },
    isFile : {
        type:Boolean,
        require:true,
        default:false
    },
    ifAudio : {
        type:Boolean,
        require:true,
        default:false
    },
    isImage : {
        type:Boolean,
        require:true,
        default:false
    },
    isVideo : {
        type:Boolean,
        require:true,
        default:false
    },
    isSeen : [{
        type:mongoose.Schema.Types.ObjectId,  //if it is group chat then how many user seen it otherwise only one sees
        ref : 'users',
        require:true
    }],
    status : {
        type:Boolean,
        default:true
    }

},
{timestamps:true})
const messages = new mongoose.model("messages",Schema)
module.exports = messages;