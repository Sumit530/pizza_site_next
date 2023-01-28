const mongoose = require("mongoose")

const Schema = new  mongoose.Schema({
    user_id : {
        type:mongoose.Schema.Types.ObjectId,
        ref : 'Users',
        require:true
    },
    effect_id : {
        type:mongoose.Schema.Types.ObjectId,
        ref : 'video_effects',
        require:true
    },
    status : {
        type:Boolean,
        default:true
    }

},
{timestamps:true})

const video_effects_bookmark = new mongoose.model("video_effects_bookmark",Schema)
module.exports = video_effects_bookmark;