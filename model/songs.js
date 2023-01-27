const mongoose = require("mongoose")
const { softDeletePlugin } = require('soft-delete-plugin-mongoose');
const Schema = new  mongoose.Schema({
    cat_id : {
        type:mongoose.Schema.Types.ObjectId,
        ref : 'categories',
        require:true
    },
    singer_id : {
        type:mongoose.Schema.Types.ObjectId,
        ref : 'singers',
        require:true
    },
    name : {
        type:String,
        require:true
    },
    description : {
        type:String,
        require:true
    },
    banner_image : {
        type:String,
        require:true
    },
    duration : {    
        type:String,
        require:true
    },
    attachment : {
        type:String,
        require:true
    },

    status : {
        type:Boolean,
        default:true
    }
},
{timestamps:true})
Schema.plugin(softDeletePlugin)
const songs = new mongoose.model("songs",Schema)
module.exports = songs;