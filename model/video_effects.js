const { softDeletePlugin } = require('soft-delete-plugin-mongoose');
const mongoose = require("mongoose")

const Schema = new  mongoose.Schema({
   name : {
    type:String
   },
   attachment : {
    type:String
   }, 
    status : {
        type:Boolean,
        default:true
    }

},
{timestamps:true})
Schema.plugin(softDeletePlugin)
const video_effects = new mongoose.model("video_effects",Schema)
module.exports = video_effects;