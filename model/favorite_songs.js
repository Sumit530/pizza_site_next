const mongoose = require("mongoose")

const Schema = new  mongoose.Schema({
    user_id : {
        type:mongoose.Schema.Types.ObjectId,
        ref : 'User',
        require:true
    },
    song_id : {
        type:String,
        ref : 'User',
        require:true
    },
    status : {
        type:Boolean,
        default:true
    },
    created_at : {
        type:Date,
        default:Date.now()
        
    },
    updated_at : {
        type:Date,
        default:null
        
    }
})

const favorite_songs = new mongoose.model("favorite_songs",Schema)
module.exports = favorite_songs;