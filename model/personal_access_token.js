const mongoose = require("mongoose")

const Schema = new  mongoose.Schema({
    tokenable_type : {
        type:String,
        require:true
    },
    tokenable_type : {
        type:mongoose.Schema.Types.ObjectId,
        require:true,
    },
    name : {
        type:String,
        require:true
    },
    token : {
        type:String,
        require:true
    },
    abilities : {
        type:String,
    },
    last_used_at : {
        type:Date,

    }
},
{timestamps:true})
const personal_access_token = new mongoose.model("personal_access_token",Schema)
module.exports = personal_access_token;