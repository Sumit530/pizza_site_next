const mongoose = require("mongoose")

const Schema = new  mongoose.Schema({

    admin_id : {
        type:mongoose.Schema.Types.ObjectId,
        ref : 'admins',
        require:true
    },
    ban_user_id : {
        type:mongoose.Schema.Types.ObjectId,
        ref : 'Users',
        require:true
    },
    reason:[{
            type:mongoose.Schema.Types.ObjectId,
            ref : 'ban_reasons',
            require:true
    }],
    type:{
        type:Number,
        require:true     //1 = temprery 2= permanent
    },
    unban_after : {
        type:Number,   // number of days
        require:true
    } ,
    staus : {
        type:Boolean,
        require:true
    }

},{timestamps:true})
const banned_user = new mongoose.model("banned_user",Schema)
module.exports = banned_user;