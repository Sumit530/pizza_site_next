const mongoose = require("mongoose")

const Schema = new  mongoose.Schema({
    user_id : {
        type:mongoose.Schema.Types.ObjectId,
        ref : 'Users',
        require:true
    },
    video_id : {
        type:mongoose.Schema.Types.ObjectId,
        ref : 'videos',
        require:true
    },
    status : {
        type:Boolean,
        default:true
    }

},
{timestamps:true})
const video_favorites = new mongoose.model("video_favorites",Schema)
module.exports = video_favorites;