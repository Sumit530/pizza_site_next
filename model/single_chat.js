const mongoose = require("mongoose")

const Schema = new  mongoose.Schema({
    user_id :  {
        type:mongoose.Schema.Types.ObjectId,
        ref : 'users',
        require:true,
        
    },
    reciever_id :  {
        type:mongoose.Schema.Types.ObjectId,
        ref : 'users',
        require:true,
        
    },
    status : {
        type:Boolean,
        default:true
    }

},
{timestamps:true})
const single_chat = new mongoose.model("single_chat",Schema)
module.exports = single_chat;