const mongoose = require("mongoose")

const Schema = new  mongoose.Schema({
    user_id : {
        type:mongoose.Schema.Types.ObjectId,
        ref : 'Users',
        require:true
    },
    is_allow_comments : {
        type:Boolean,
        default:true
    },
    is_allow_duets : {
        type:Boolean,
        default:true
    },
    is_allow_messages : {
        type:Boolean,
        default:true
    },
    is_allow_downloads : {
        type:Boolean,
        default:true
    },
    status : {
        type:Boolean,
        default:true
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
const safeties = new mongoose.model("safeties",Schema)
module.exports = safeties;