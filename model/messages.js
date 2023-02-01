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
    type:{
        type:Number,
        enum:[1,2,3,4,5], //1=message 2=image 3=audio 4=video 5=file
        default:1
    },
    isSaved : {
        type:Boolean,
        default:false
    },
    deletedBy : [{
        type:mongoose.Schema.Types.ObjectId,  //if it is group chat then how many user seen it otherwise only one sees
        ref : 'users',
        require:true
    }],
    attachment : {
        type:String,
        require:true,
    },
    seenBy : [{
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