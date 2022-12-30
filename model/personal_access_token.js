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