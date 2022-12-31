const { softDeletePlugin } = require('soft-delete-plugin-mongoose');
const mongoose = require("mongoose")

const Schema = new  mongoose.Schema({
    name:{
        type:String,
        require:true

    },
    description : {
        type:String,
    },
    image : {
        type:String
    },
    status : {
        type:Boolean,
        default:true
    }
},
{timestamps:true})
Schema.plugin(softDeletePlugin)
const singers = new mongoose.model("singers",Schema)
module.exports = singers;