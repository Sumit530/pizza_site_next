const mongoose = require("mongoose")

const Schema = new  mongoose.Schema({
    video_id : {
        type:mongoose.Schema.Types.ObjectId,
        ref : 'videos',
        require:true
    },
    hashtag_id : {
        type:mongoose.Schema.Types.ObjectId,
        ref : 'hashtags',
        require:true
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
const hashtag_data = new mongoose.model("hashtag_data",Schema)
module.exports = hashtag_data;