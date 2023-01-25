const mongoose = require("mongoose")
const Schema = new  mongoose.Schema({
    user_id : {
        type:mongoose.Schema.Types.ObjectId,
        ref : 'users',
        require:true
    },
    sound_id : {
        type:mongoose.Schema.Types.ObjectId,
        ref : 'songs',
        require:true
    },
    status : {
        type:Boolean,
        default:true
    }
},
{timestamps:true})
const sound_bookmarks = new mongoose.model("sound_bookmarks",Schema)
module.exports = sound_bookmarks;