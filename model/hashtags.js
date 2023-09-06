const { softDeletePlugin } = require('soft-delete-plugin-mongoose');
const mongoose = require("mongoose")

const Schema = new  mongoose.Schema({
    name : {
        type:String,
        require:true
    },
   
},
{timestamps:true})
Schema.plugin(softDeletePlugin)
const hashtags = new mongoose.model("hashtags",Schema)
module.exports = hashtags;