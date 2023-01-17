const mongoose = require("mongoose")

const Schema = new  mongoose.Schema({
    users : [ {
        type:mongoose.Schema.Types.ObjectId,
        ref : 'users',
        require:true,
        timestamps:true
    }],
    admin : [ {
        type:mongoose.Schema.Types.ObjectId,
        ref : 'users',
        require:true,
        timestamps:true
    }],
    name : {
        type:String, // name of chat it would be username or groupname
        require:true
    },
    status : {
        type:Boolean,
        default:true
    }

},
{timestamps:true})
const chats = new mongoose.model("chats",Schema)
module.exports = chats;