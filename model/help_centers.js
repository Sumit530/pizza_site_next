const mongoose = require("mongoose")

const Schema = new  mongoose.Schema({
    title : {
        type:String,
    },
    details: {
        type:String,
    },

    status : {
        type:Boolean,
        default:true
    }

},
{timestamps:true})

const help_centers = new mongoose.model("help_centers",Schema)
module.exports = help_centers;