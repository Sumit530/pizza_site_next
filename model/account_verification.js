const mongoose = require("mongoose")
const { softDeletePlugin } = require('soft-delete-plugin-mongoose');
const Schema = new  mongoose.Schema({
    user_id : {
        type:mongoose.Schema.Types.ObjectId,
        ref : 'User',
        require:true
    },
    full_name : {
        type:String,
        require:true
    },
    document_type :{
        type:Number,
        require : true
    },
    document : {
        type:String,

    },
    category_id : {
        type:mongoose.Schema.Types.ObjectId,
        ref : 'account_categories',
        require:true
    },
    country_id : {
        type:mongoose.Schema.Types.ObjectId,
        ref : 'countries',
        require:true
    },
    audience : {
        type:String,
    },
    link_type1 : {
        type:Number,
    },
    url1 : {
        type:Number
    },
    link_type2 : {
        type:Number,
    },
    url2 : {
        type:Number
    },
    link_type3 : {
        type:Number,
    },
    url3 : {
        type:Number
    },
    link_type4 : {
        type:Number,
    },
    url4 : {
        type:Number
    },
    link_type5 : {
        type:Number,
    },
    url5 : {
        type:Number
    },
    status : {
        type:Boolean,
        require:true,
        default:false
    }

},
{timestamps:true})
Schema.plugin(softDeletePlugin)
const account_verification = new mongoose.model("account_verifications",Schema)
module.exports = account_verification;