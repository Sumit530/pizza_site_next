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
    },
    deleted_at : {
        type:Date,
        default:null
        
    },
    created_at : {
        type:Date,
        default:null
        
    },
    updated_at : {
        type:Date,
        default:null
        
    }
})
const singers = new mongoose.model("singers",Schema)
module.exports = singers;