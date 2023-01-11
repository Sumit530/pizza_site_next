const mongoose = require("mongoose")
const { softDeletePlugin } = require('soft-delete-plugin-mongoose');
const Schema = new  mongoose.Schema({
    name : {
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
const categories = new mongoose.model("categories",Schema)
module.exports = categories;