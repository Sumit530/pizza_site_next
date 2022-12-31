const mongoose = require("mongoose")

const Schema = new  mongoose.Schema({
    user_id : {
        type:mongoose.Schema.Types.ObjectId,
        ref : 'Users',
        require:true
    },
    emoji : {
        type:String,
        require:true
    }
},
{timestamps:true})
const recent_emojis = new mongoose.model("recent_emojis",Schema)
module.exports = recent_emojis;