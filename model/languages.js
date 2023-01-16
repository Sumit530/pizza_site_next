const { softDeletePlugin } = require('soft-delete-plugin-mongoose');
const mongoose = require("mongoose")

const Schema = new  mongoose.Schema({

    language_name : {
        type:String,
        require:true
    },
    status: {
        type:Boolean,
        default:true
    }
},
{timestamps:true})
Schema.plugin(softDeletePlugin)
const languages = new mongoose.model("languages",Schema)
module.exports = languages;