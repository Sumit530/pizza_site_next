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
    },
    created_at : {
        type:Date,
        default:null
        
    },
    updated_at : {
        type:Date,
        default:null
        
    }
})
const recent_emojis = new mongoose.model("recent_emojis",Schema)
module.exports = recent_emojis;