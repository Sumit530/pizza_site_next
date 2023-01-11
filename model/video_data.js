const mongoose = require("mongoose")

const Schema = new  mongoose.Schema({

    video_id : {
        type:mongoose.Schema.Types.ObjectId,
        require:true
    },
    status : {
        type:Boolean,
        default:true
    }
},{
    timestamps:true
})