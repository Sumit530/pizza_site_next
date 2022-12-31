const mongoose = require("mongoose")

const Schema = new  mongoose.Schema({
        user_id : {
            type:mongoose.Schema.Types.ObjectId,
            ref:"users"
        },
        is_likes : {
            type:Boolean,
            default:true
        },
        is_comments : {
            type:Boolean,
            default:true
        },
        is_new_followers : {
            type:Boolean,
            default:true
        },
        is_videos_from_follow : {
            type:Boolean,
            default:true
        },
        is_livestreams_from_follow : {
            type:Boolean,
            default:true
        },
        is_recommended_broadcasts : {
            type:Boolean,
            default:true
        },
        is_customized_updates : {
            type:Boolean,
            default:true
        },
        status: {
            type:Boolean,
            default:true
        }
},
{timestamps:true})
const notification_settings = new mongoose.model("notification_settings",Schema)
module.exports = notification_settings;