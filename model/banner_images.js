const mongoose = require("mongoose")

const Schema = new  mongoose.Schema({
    image_name : {
        type:String
    },
    status : {
        type:Boolean,
        default:true
    }
},
{timestamps:true})

const banner_images = new mongoose.model("banner_images",Schema)
module.exports = banner_images;