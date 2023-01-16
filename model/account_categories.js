const { softDeletePlugin } = require('soft-delete-plugin-mongoose');
const mongoose = require("mongoose")

const Schema = new  mongoose.Schema({
    name : {
        type:String,
        require:true
    },
    status : {
        type:Boolean,
        default:true,
        require:true
    }
   
}, 
{timestamps:true})
Schema.plugin(softDeletePlugin)
const account_categories = new mongoose.model("account_categories",Schema)
module.exports = account_categories;
