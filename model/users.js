const { softDeletePlugin } = require('soft-delete-plugin-mongoose');
const mongoose = require("mongoose")

const Schema = new  mongoose.Schema({
    social_id : {
        type:String,
    },
    name:{
        type:String
    },
    email:{
        type:String
    },
    username:{
        type:String
    },
    password:{
        type:String
    },
    country_code:{
        type:String
    },
    mobile_no:{
        type:String
    },
    page_name:{
        type:String
    },
    gender:{
        type:String
    },
    dob : {
        type:Date

    },
    otp : {
        type:String
    },
    device_id :{
        type:String
    },
    fcm_id :{
        type:String
    },
    otp_expired : {
        type:String,
    },
    profile_image : {
        type:String,
    },
    website : {
        type:String,
    },
    
    referral_code : {
        type:String,
    },
    iat : {
        type:String,
    },
    long : {
        type:String,
    },
    email_verified_at : {
        type:Date,
    },
    remember_token : {
        type:Date,
    },
    country_id : {
        type:mongoose.Schema.Types.ObjectId,
        ref:"countries"
    },
    language_id : {
        type:mongoose.Schema.Types.ObjectId,
        ref:"languages"
    },
    allow_find_me : {
        type:Boolean,
        default:true,
        require:true

    },
    private_account : {
        type:Boolean,
        default:false,
        require:true
        
    },
    is_vip : {
        type:Boolean,
        default:false,
        require:true
    },
    wallet : {
        type:Number,
        default:0 ,
        require:true
    },
    type : {
        type:Number,
        default:1,
        require:true
    },
    status : {
        type:Boolean,
        default:true,
        require:true
    }

},{timestamps:true})
Schema.plugin(softDeletePlugin)

const Users = new mongoose.model("Users",Schema)
module.exports = Users;