const mongoose = require("mongoose")

const Schema = new  mongoose.Schema({
   name : {
    type:String
   },
   attachment : {
    type:String
   },
   deleted_at : {
    type:Date,
    default:null
    
},
    status : {
        type:Boolean,
        default:true
    },
    created_at : {
        type:Date,
        default:Date.now()
        
    },
    updated_at : {
        type:Date,
        default:null
        
    }

})
const video_effects = new mongoose.model("video_effects",Schema)
module.exports = video_effects;