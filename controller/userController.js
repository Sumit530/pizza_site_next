const User = require("../model/users")
const moment = require("moment")
const nodemailer = require('nodemailer');
const { validate} =   require('deep-email-validator')
const jwt = require("jsonwebtoken")
const bcrypt = require("bcryptjs");
const Notification = require("../model/notifications")
const NotificationSetting = require("../model/notification_settings")
const safety = require("../model/safeties")
const Follow = require("../model/followers")
require("dotenv").config()
const TwoFactor = new (require('2factor'))(process.env.API_KEY)
const fs = require("fs");
const { default: axios } = require("axios");



exports.registration = async(req,res) =>{
const {country_code} = req?.body
var email = null;
let mobile_no = null;
if(req?.body?.email){
email = req?.body?.email
}
if(req?.body?.mobile_no){
mobile_no = req?.body?.mobile_no
}

if(mobile_no != null ){
    const phoneno = /^\d{10}$/;
    if(mobile_no.match(phoneno) == null){
        return res.status(401).json({status:0,message:"incorrect phone number"})
    }
    const check = await User.find({mobile_no})
    console.log(check);
    if(check.length>0){
        return res.status(401).json({status:0,message:"phone number already exist"})
    }
    const otp = Math.floor(1000 + Math.random() * 9000)
    const otpdate = Date.now()
 //  await TwoFactor.sendOTP(mobile_no,{otp:otp})
    const otp_expired = moment(otpdate).add(30, 'm').toDate();
    const userdata = new User({
        country_code,mobile_no,otp,otp_expired    	           
    })
    let finaluser = await userdata.save()
    const notification_data = new Notification({
        user_id:finaluser._id
    })
    await notification_data.save()
    const notification_setting_data = new NotificationSetting({
        user_id:finaluser._id
    })
    await notification_setting_data.save()
    const safeties = new safety({
        user_id: finaluser._id
    })
    await safeties.save()
    finaluser = {
        user_id:finaluser._id,
        name:finaluser.name,
        country_code:finaluser.country_code,
        mobile_no :finaluser.mobile_no,
        email:finaluser.name,

    }
    res.status(201).json({data:finaluser,status:1,message:"registration successfull"})
    }
    

    //notification settng
    

else if (email != null){

    const valid =  await validate(email)
    if(valid == false){
        return res.status(409).json({status:0,message:"incorrect email"})
    }
    const check = await User.find({email:email})
    if(check.length>0){
        return res.status(409).json({status:0,message:"email allready exist"})
    }
    const otp = Math.floor(1000 + Math.random() * 9000)
    const otpdate = Date.now()
    const otp_expired = moment(otpdate).add(30, 'm').toDate();
    const transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
          user: 'appstane.test@gmail.com',
          pass: 'Sumit1458p'
        }
      });
      
      const mailOptions = {
        from: 'swipeupp@gmail.com',
        to: `${email}`,
        subject: 'varification opt',
        text: `otp : ${otp}`
      };
      transporter.sendMail(mailOptions, async(error, info)=>{
        if (error) {
          res.status(501).json({status:0,message:"internal error cannot sent email"})
        } else {
            const userdata = new User({
                country_code,email,otp,otp_expired    	           
            })
          
            const finaluser = await userdata.save()
            const notification_setting_data = new NotificationSetting({
                user_id:finaluser._id
            })
            await notification_setting_data.save()
            res.status(201).json({data:finaluser,status:1,message:"email send successfully"})
        }})
}

}


exports.social_signup = async(req,res)=>{
    if(!req?.body?.email  ){
        return res.status(401).json({status:1,message:"please fill field properly"})
    }
    if(!req?.body?.type ) {
        return res.status(401).json({status:1,message:"please fill field properly"})
    }
    const {name,email,social_id,type} = req?.body
const check_user = await User.find({email:email})
const keysecret = process.env.USER_SECRET
if(check_user.length>0){
    let token = jwt.sign({ id:check_user[0]._id,email:check_user.email},keysecret);
    const data = {
        user_id: check_user[0]._id  ,
        name:check_user[0].name ? check_user[0].name : "",
        email:check_user[0].email ? check_user[0].email : "",
        token:token
    }
res.status(409).json({status:1,message:"already registerd user",data})
}
else{
    const user = new User({
        name:name ? name : '',email,social_id:social_id ? social_id : "",type
    })
    const finaluser = await user.save()
    const token = jwt.sign({id:finaluser._id,email:finaluser.email},keysecret)
    const data = {
        user_id: check_user._id  ,
        name:finaluser.name ? finaluser.name : "",
        email:finaluser.email ? finaluser.email : "",
        token:token
    }
    res.status(409).json({status:1,message:"user registerd successfully",data}) 
}

}

exports.LoginUser = async(req,res)=>{
    const {email,password,fcm_id,device_id} = req?.body
    if(email && password && fcm_id && device_id){
        var user = null
        if(!isNaN(email)){
             user = await User.find({mobile_no:7041938623})
            
        }
        else if(email.match(/^(([^<>()[\]\.,;:\s@\"]+(\.[^<>()[\]\.,;:\s@\"]+)*)|(\".+\"))@(([^<>()[\]\.,;:\s@\"]+\.)+[^<>()[\]\.,;:\s@\"]{2,})$/i) != null){
             user = await User.find({email:email})
        }
        else {
             user = await User.find({username:email})
        }
        if(user.length>0) {
            if(bcrypt.compare(`'${password}'`,user[0].password)==false){
                return res.status(409).json({status:0,message:"invalid password "})
            }
            else{
                 const keysecret = process.env.USER_SECRET
                const update = await User.findOneAndUpdate({email:email},{device_id:device_id,fcm_id:fcm_id},{new:true})
                const token = jwt.sign({id:update._id,email:update.email},keysecret)
                const data = {
                    user_id:update._id,name:update.name ? update.name : "" ,country_code:update.country_code,mobile_no : update.mobile_no ? update.mobile_no : "",email : update.email ? update.email :"",language_id:update.language_id,token:token
                }
                res.status(201).json({status:1,message:"logged in successfully",data:data})
            }
        }
        else {
            res.status(409).json({status:0,message:"user not found",})
        }
    }
    else{
        res.status(409).json({status:0,message:"please fill field properly",})
    }
}


//api for registration user 
exports.send_otp = async(req,res)=>{
const {mobile_no} = req?.body
const phoneno = /^\d{10}$/;
    if(mobile_no.match(phoneno) == null ){
        return res.status(406).json({status:0,message:"please povide a valide number"})
    }

const finaluser = await User.find({mobile_no:mobile_no})
if(finaluser.length>0){

    const otp = Math.floor(1000 + Math.random() * 9000)
    await TwoFactor.sendOTP(mobile_no,{otp:otp})
    const otpdate = Date.now()
    const otp_expired = moment(otpdate).add(30, 'm').toDate();
    const updateuser = await User.findOneAndUpdate({_id:finaluser[0]._id},{otp:otp,otp_expired:otp_expired},{new:true})
    const data = {
        user_id:finaluser._id,name:finaluser.name ? finaluser.name : "" ,otp:otp,country_code:finaluser[0].country_code,mobile_no : finaluser.mobile_no ? finaluser.mobile_no : "",email : finaluser.email ? finaluser.email :"",language_id:finaluser.language_id,token:token
    }
    res.status(201).json({status:1,message:"otp send successfully",data})
   
}
else{
    res.status(409).json({status:0,message:"user not found"})
}
}

exports.resend_otp = async(req,res)=>{
    const {mobile_no} = req?.body
    const phoneno = /^\d{10}$/;
        if(mobile_no.match(phoneno) == null ){
            return res.status(406).json({status:0,message:"please povide a valide number"})
        }
    
    const finaluser = await User.find({mobile_no:mobile_no})
    if(finaluser.length>0){
    
        const otp = Math.floor(1000 + Math.random() * 9000)
        await TwoFactor.sendOTP(mobile_no,{otp:otp})
        const otpdate = Date.now()
        const otp_expired = moment(otpdate).add(30, 'm').toDate();
        const updateuser = await User.findOneAndUpdate({_id:finaluser._id},{otp:otp,otp_expired:otp_expired},{new:true})
        const data = {
            user_id:finaluser._id,name:finaluser.name ? finaluser.name : "" ,otp:otp,country_code,mobile_no : finaluser.mobile_no ? finaluser.mobile_no : "",email : finaluser.email ? finaluser.email :"",language_id:finaluser.language_id
        }
        res.status(201).json({status:1,message:"otp send successfully",data})
       
    }
    else{
        res.status(409).json({status:0,message:"user not found"})
    }
    }
    

exports.user_details = async(req,res)=>{
    const {keyword} =  req?.body
try {
    
    if(!keyword) {
        return res.status(402).json({status:0,message:"please provide a keyword"})
    } 
    var user = null
    if(isNaN(keyword) == false){
       var user = await User.find({mobile_no: `/${keyword}/` })
    }
    else if(keyword.match(/^(([^<>()[\]\.,;:\s@\"]+(\.[^<>()[\]\.,;:\s@\"]+)*)|(\".+\"))@(([^<>()[\]\.,;:\s@\"]+\.)+[^<>()[\]\.,;:\s@\"]{2,})$/i) != null){
        var user = await User.find({email:`/${keyword}/`})
    }
    
    if(user == null || user.length<=0){
        res.status(406).json({status:0,message:"user not found"})
    }
    else {
        res.status(406).json({status:1,message:"User detail get successfully",data:user})
    }
} catch (error) {
    res.status(501).json({status:0,message:"internal server error"})
    console.log(error)
}
}
exports.get_my_accounts = async(req,res)=>{
    try {
        var result = []
        const {user_id } = req?.body
        if(!user_id){
            return res.status(406).json({status:0,message:"please give a user id"})
        }  
        const user = await User.find({_id:user_id})
        console.log(user)
        if(user.length>0){
            var data = null
            user.map((e)=>{
                if(e.profile_image != ''){
                    var profile = `${process.env.PUBLICPROFILEURL}/${e.profile}`
                }
                else{
                    var profile = ''
                }
                data = {
                    id:user[0]._id,name:user[0].name ? user[0].name : "",username:user[0].username ? user[0].username : "",email:user[0].email ? user[0].email : ""  ,country_code:user[0].country_code ? user[0].country_code : "",dob:user[0].dob ? user[0].dob : "",private_account:user[0].private_account ? user[0].private_account : "",language_id:user[0].language_id ? user[0].language_id : "",is_vip:user[0].is_vip ? user[0].is_vip : "",wallet:user[0].wallet ? user[0].wallet : "",profile_image:profile
                }
                result.push(data)
            })
        return  res.status(201).json({status:1,message:"user found",data:result})

        }   
        return res.status(406).json({status:0,message:"No data found.!"})

    } catch (error) {
        console.log("server error on get my account");
    }
}
exports.get_all_users = async(req,res)=>{
    try {
        
    
    const {user_id } = req?.body
    var result = []
    if(!user_id){
        return res.status(406).json({status:0,message:"please give a user id"})
    }  
    var user = null
    if(req?.body?.keyword && req?.body?.keyword != '' ){
         user = await User.find({_id:user_id,status:1,username:`/${req?.body?.keyword}/i`})

    }else{
         user = await User.find({_id:user_id,status:1})
    }
    console.log(user)
    if( user != null && user.length > 0){
        user.map((e)=>{
            if(e.profile_image != ''){
                var profile = `${process.env.PUBLICPROFILEURL}/${e.profile}`
            }
            else{
                var profile = ''
            }
            data = {
                id:user._id,name:user.name ? user.name : "",mobile_no:user.mobile_no ? user.mobile_no :"",page_name:user.page_name ? user.page_name : "", username:user.username ? user.username : "",email:user.email ? user.email : ""  ,country_code:user.country_code ? user.country_code : "",dob:user.dob ? user.dob : "",private_account:user.private_account ? user.private_account : "",language_id:user.language_id ? user.language_id : "",is_vip:user.is_vip ? user.is_vip : "",wallet:user.wallet ? user.wallet : "",profile_image:profile
            }
            result.push(data)
        })
        return  res.status(201).json({status:1,message:"user found",data:result})
    }
    return res.status(406).json({status:0,message:"No data found.!"})
} catch (error) {
    res.status(502).json({status:0,message:"internal server error"})
    console.log("server error on get my account" + error); 
}

}

exports.check_otp  = async(req,res)=>{
    try {
        if(!req?.body?.user_id || req?.body?.user_id == '' ){
            return res.status(406).json({status:0,message:"please give a user id"})
        }
        const {user_id,otp} = req?.body

        const user = await User.find({_id:user_id})
        if(user.length>0){
            if(user[0].otp == otp){
                await User.findOneAndUpdate({_id:user_id},{otp:'',otp_expired:''},{new:true})
                return res.status(201).json({status:1,message:"otp match successfully"})
            }
            else{
                return res.status(403).json({status:0,message:"otp not match "})
            }
        }else{
            return res.status(406).json({status:0,message:"No data found.!"}) 
        }
    } catch (error) {
        res.status(502).json({status:0,message:"internal server error"})
        console.log("server error on otp send"); 
    }
}
exports.check_username = async(req,res)=>{
    try {
        if(!req?.body?.username || req?.body?.username == ''){ 
            return  res.status(406).json({status:0,message:"please give username"})
        }
        const {username} = req?.body
        const user = await User.find({username:username})
        if(user.length>0){
            return res.status(402).json({status:1,message:"This user name is already our database"})
        }
        else {
            return res.status(402).json({status:0,message:"This user name is not in our database"})
        }
    } catch (error) {
        res.status(502).json({status:0,message:"internal server error"})
        console.log("server error on check username"); 
    }
}
exports.update_username = async(req,res) =>{
    try {
        
   
    if(!req?.body?.username || req?.body?.username == '' || req?.body?.user_id == '' || !req?.body?.user_id){ 
        return  res.status(406).json({status:0,message:"please give username"})
    }
    const {username,user_id} = req?.body
    const user = await User.find({username:username})
    if(user.length>0){
        return res.status(402).json({status:0,message:"This user name is already our database"})
    }
    else {
        await User.findOneAndUpdate({_id:user_id},{username:username},{new:true})
        return res.status(201).json({status:1,message:"username updated successfully"})
    }
} catch (error) {
    res.status(502).json({status:0,message:"internal server error"})
    console.log("server error on update username"); 
}
}
exports.update_password = async(req,res) =>{
    try {
        
   
    if(!req?.body?.password || req?.body?.password == '' || req?.body?.user_id == '' || !req?.body?.user_id){ 
        return  res.status(406).json({status:0,message:"please give username"})
    }
    const {password,user_id} = req?.body
    const user = await User.find({_id:user_id})
    if(user.length>0){
        await User.findOneAndUpdate({_id:user_id},{password:password},{new:true})
        return res.status(201).json({status:1,message:"password updated successfully"})
    }
    else {
        return res.status(402).json({status:0,message:"This user not in our database "})
    }
} catch (error) {
    res.status(502).json({status:0,message:"internal server error"})
    console.log("server error on update username"); 
}
}

exports.update_mobile_no = async(req,res) =>{
    try {
        
    
    if(!req?.body?.mobile_no || req?.body?.mobile_no == '' || req?.body?.user_id == '' || !req?.body?.user_id){ 
        return  res.status(406).json({status:0,message:"please give username and mobile no"})
    }
    const user = await User.findOneAndUpdate({_id:req?.body?.user_id},{mobile_no:req?.body?.mobile_no})
    if(Object.keys(user).length>0){
        return res.status(201).json({status:1,message:"mobile number updated successfully"})
    }
} catch (error) {
    res.status(502).json({status:0,message:"internal server error"})
    console.log("server error on update mobiel no"); 
}
}

exports.update_page_name = async(req,res) =>{
   try {
    if(!req?.body?.page_name || req?.body?.page_name == '' || req?.body?.user_id == '' || !req?.body?.user_id){ 
        return  res.status(406).json({status:0,message:"please give username or page name"})
    }

    const updateuser = await User.findOneAndUpdate({_id:user_id},{page_name:page_name},{new:true})
    if(updateuser.length>0){
        return res.status(201).json({status:1,message:"page name updated successfully"})
    }
   } catch (error) {
    res.status(502).json({status:0,message:"internal server error"})
    console.log("server error on update page name"); 
   }
}

exports.update_privacy = async(req,res) =>{
    try {
        if(!req?.body?.allow_find_me || req?.body?.allow_find_me  == ''|| !req?.body?.private_account || req?.body?.private_account  == '' || req?.body?.user_id == '' || !req?.body?.user_id){ 
            return  res.status(406).json({status:0,message:"please give prorpery parameter"})
        }
        const updateuser = await User.findOneAndUpdate({_id:req?.body?.user_id},{allow_find_me:req?.body?.allow_find_me,private_account:req?.body?.private_account},{new:true})
        if(Object.keys(updateuser).length>0){
            return res.status(201).json({status:1,message:"privacy updated successfully"})
        }
    } catch (error) {
        res.status(502).json({status:0,message:"internal server error"})
    console.log("server error on update privacy"); 
    }
}

exports.get_user_safeties = async(req,res) =>{
  try {
    if( req?.body?.user_id == '' || !req?.body?.user_id){ 
        return  res.status(406).json({status:0,message:"please give proper parameter"})
    }
    const safeties = await safety.find({user_id:req?.body?.user_id})
    if(safeties.length>0){
        return res.status(201).json({status:1,message:"found safeties",data:safeties})
    }
    else{
        return res.status(402).json({status:0,message:"user safety not found"})
    }
  } catch (error) {
    res.status(502).json({status:0,message:"internal server error"})
    console.log("server error on get user safeties"); 
  }
}
exports.update_safeties = async(req,res) =>{
try {
    if(!req?.body?.is_allow_comments || req?.body?.is_allow_comments  == ''|| !req?.body?.is_allow_downloads || req?.body?.is_allow_downloads  == '' || req?.body?.user_id == '' || !req?.body?.user_id){ 
        return  res.status(406).json({status:0,message:"please give prorpery parameter"})
    }
    const safeties = await safety.find({user_id:req?.body?.user_id})
    if(safeties.length>0){
        const updatesafeties = await safety.findOneAndUpdate({user_id:req?.body?.user_id},{is_allow_comments:req?.body?.is_allow_comments,is_allow_downloads:req?.body?.is_allow_downloads},{new:true})
        return res.status(201).json({status:1,message:"safeties updated successfully",data:updatesafeties})
    }
    else{
        return res.status(402).json({status:0,message:"user safety not found"})
    }
    
} catch (error) {
    res.status(502).json({status:0,message:"internal server error"})
    console.log("server error on update safeites"); 
}
}

exports.update_notification_settings = async(req,res) =>{
    try {
        if(!req?.body?.is_likes || req?.body?.is_likes  == ''){ 
            return  res.status(406).json({status:0,message:"please give prorpery parameter"})
        }
        if(!req?.body?.is_customized_updates || req?.body?.is_customized_updates  == '' ){ 
            return  res.status(406).json({status:0,message:"please give prorpery parameter"})
        }
        if(req?.body?.user_id == '' || !req?.body?.user_id){ 
            return  res.status(406).json({status:0,message:"please give prorpery parameter"})
        }
        if(!req?.body?.is_direct_messages || req?.body?.is_direct_messages  == ''){ 
            return  res.status(406).json({status:0,message:"please give prorpery parameter"})
        }
        if(!req?.body?.is_mentions || req?.body?.is_mentions  == ''){ 
            return  res.status(406).json({status:0,message:"please give prorpery parameter"})
        }
        if(!req?.body?.is_recommended_broadcasts || req?.body?.is_recommended_broadcasts  == ''){ 
            return  res.status(406).json({status:0,message:"please give prorpery parameter"})
        }
        
       const  notifcationdata = await NotificationSetting.find({user_id:req?.body?.user_id})
       if(notifcationdata.length > 0){
        const notifcation_data = new NotificationSetting({
            user_id:req?.body?.user_id,
            is_likes:req?.body?.is_likes,
            is_customized_updates:req?.body?.is_customized_updates,
            is_direct_messages:req?.body?.is_direct_messages,
            is_mentions:req?.body?.is_mentions,
            is_recommended_broadcasts:req?.body?.is_recommended_broadcasts,  
        })
        await notifcation_data.save()
        return res.status(201).json({status:1,message:"notification setting updated successfully"})
       }else{
        return res.status(402).json({status:0,message:"user notification data not found"})
       }
    } catch (error) {
        res.status(502).json({status:0,message:"internal server error"})
        console.log("server error on update notification setting"); 
    }
}

exports.get_notification_settings = async(req,res) =>{
    try {
        if( req?.body?.user_id == '' || !req?.body?.user_id){ 
            return  res.status(406).json({status:0,message:"please give username and mobile no"})
        }
        const  notifcationdata = await NotificationSetting.find({user_id:req?.body?.user_id})
        if(notifcationdata.length > 0){

            return res.status(201).json({status:1,message:"notification data got successfully",data:notifcationdata})
           }else{
            return res.status(402).json({status:0,message:"user notification data not found"})
           }
    } catch (error) {
        res.status(502).json({status:0,message:"internal server error"})
    console.log("server error on update get notification setting"); 
    }
}

exports.getProfile = async(req,res) =>{
    try {
        if(!req?.body?.follower_id || req?.body?.follower_id == '' || req?.body?.login_id == '' || !req?.body?.login_id){ 
            return  res.status(406).json({status:0,message:"please give proper parameter"})
        }
        const user = await User.find({_id:follower_id})
    } catch (error) {
        res.status(502).json({status:0,message:"internal server error"})
    console.log("server error on update get notification setting"); 
    }
}

exports.update_location = async(req,res) =>{
   try {
    if( req?.body?.user_id == '' || !req?.body?.user_id || req?.body?.lat == '' || !req?.body?.lat || req?.body?.long == '' || !req?.body?.long){ 
        return  res.status(406).json({status:0,message:"please give a proper parameter"})
    }
    const user = await User.find({_id:req?.body?.user_id})
    if(user.length>0){
        const locationupdate = await User.findOneAndUpdate({user_id:req?.body?.user_id},{lat:req?.body?.lat,long:req?.body?.long},{new:true})
        return res.status(201).json({status:1,message:"location updated successfully"})
    }
    else{
        return res.status(402).json({status:0,message:"user safety not found"})
    }
    
   } catch (error) {
    res.status(502).json({status:0,message:"internal server error"})
    console.log("server error on update get update location"); 
   }

}

exports.following_list = async(req,res) =>{
   try {
    if( req?.body?.user_id == '' || !req?.body?.user_id ){ 
        return  res.status(406).json({status:0,message:"please give a proper parameter"})
    }
    const user = await User.find({_id:req.body.user_id})
    flwdata = await Follow.find({follower_id:req?.body?.user_id}).populate("user_id")
    console.log(flwdata)
    const data = []
    flwdata?.map((g)=>{
        

            if(g?.user_id.profile_image != ''){
                
                const path = process.env.PUBLICPROFILEURL
                if(fs.existsSync(`uploads/profile/${g?.user_id.profile_image}`)){
                    var filepath = `${path}/${g?.user_id.profile_image}`
                }
                else {
                    var filepath = ''
                }
            }else{
                var filepath = ''
            }
            data.push({
                id:e._id,
                user_id:e.user_id,
                name:e.name,
                username:e.username,
                private_account:e.private_account,
                profile_image:filepath
            })
        
    })
    if(data.length>0){
        return res.status(201).json({status:1,message:" follower found successfully",data:data})
    }
    else{
        return res.status(402).json({status:0,message:"user not have followers"})
    }
   } catch (error) {
    res.status(502).json({status:0,message:"internal server error"})
    console.log("server error on  get follower list" + error); 
   }
}
exports.follow_list = async(req,res) =>{
  try {
    if( req?.body?.user_id == '' || !req?.body?.user_id ){ 
        return  res.status(406).json({status:0,message:"please give a proper parameter"})
    }

    flwdata = await Follow.find({user_id:req?.body?.user_id}).populate("follower_id")
    const data = []
    flwdata?.map((g)=>{
       

            if(e.user_id.profile_image != ''){
                
                const path = process.env.PUBLICPROFILEURL
                if(fs.existsSync(`${path}/${g?.user_id.profile_image}`)){
                    var filepath = `${path}/${g?.user_id.profile_image}`
                }
                else {
                    var filepath = ''
                }
            }else{
                var filepath = ''
            }
            data.push({
                id:e._id,
                user_id:e.user_id,
                name:e.name,
                username:e.username,
                private_account:e.private_account,
                profil_image:filepath
            })
        
    })
    if(data.length>0){
        return res.status(201).json({status:1,message:"follower found successfully",data:data})
    }
    else{
        return res.status(402).json({status:0,message:"user not have followers"})
    }
  } catch (error) {
     res.status(502).json({status:0,message:"internal server error"})
    console.log("server error on update get following list" + error); 
  }
}


exports.pending_follow_request = async(req,res)=>{
    try {
        if( req?.body?.user_id == '' || !req?.body?.user_id ){ 
            return  res.status(406).json({status:0,message:"please give a proper parameter"})
        }
        const flwdata = await Follow.find({user_id:user_id,status:0}).populate("follower_id")
        if(flwdata.length>0){
            const data = []
            flwdata?.map((g)=>{
                g?.follower_id?.map((e)=>{
        
                    if(e.profile_image != ''){
                        
                        const path = process.env.PUBLICPROFILEURL
                        if(fs.existsSync(`uploads/profile/${e.profile_image}`)){
                            var filepath = `${path}/${e.profile_image}`
                        }
                        else {
                            var filepath = ''
                        }
                    }else{
                        var filepath = ''
                    }
                    data.push({
                        id:e._id,
                        user_id:e.user_id,
                        name:e.name,
                        username:e.username,
                        private_account:e.private_account,
                        profil_image:filepath
                    })
                })
            })
            if(data.length>0){
                return res.status(201).json({status:1,message:"pending request found successfully",data:data})
            }
            else{
                return res.status(402).json({status:0,message:"user not have pending request"})
            }
        }
        else{
            return res.status(402).json({status:0,message:"user not have pending request"})
        }   
    } catch (error) {
        res.status(502).json({status:0,message:"internal server error"})
        console.log("server error on update get pending follow request list"); 
    }
}

exports.to_follow = async(req,res)=>{
    try {
        if( req?.body?.user_id == '' || !req?.body?.user_id || req?.body?.follower_id == '' || !req?.body?.follower_id ){ 
            return  res.status(406).json({status:0,message:"please give a proper parameter"})
        } 
        const user_id =  req?.body?.user_id
        const follower_id =  req?.body?.follower_id
        if(user_id == follower_id){
            return  res.status(406).json({status:0,message:"please follow another user"})
        }
        const user_data = await User.find({_id:user_id})
        if(user_data.length>0){
           const follower_data = await Follow.find({user_id:user_id,follower_id:follower_id})
            if(follower_data.length>0){
                return  res.status(406).json({status:0,message:"already following"})
            }
            else{
                const follower_user_data = await User.find({_id:user_id})
                // if(follower_user_data[0].device_id != "" ){
                //     const notification_id = Math.floor(1000 + Math.random() * 9000)
                //     const find_receiver_id = follower_user_data[0].device_id
                //     const fcms = []
                //     fcms.push(find_receiver_id)
                //     const title = `${user_data[0].name} send follow request`
                //     const message = `${user_data[0].name} send follow request at ${moment().format("D-MM-YYYY hh:mm:ss a")}`
                //     if(find_receiver_id != ""){
                //         const img = "";
                //         const field = {
                //             registratin_ids : [
                //                 find_receiver_id
                //             ],
                //             data: {
                //                 message : title,
                //                 body:message,
                //                 content : message,
                //                 notification_id:notification_id,
                //                 type:1,
                //                 id:follower_id,
                //                 image:img,
                //                 sound:1,
                //                 vibration:1
                //             }
                //         }
                //         const headers = [
                //             'Authorization: key=AAAAzoC3TFA:APA91bHSq2d1ECf3rUcKN1pGCSj6NKOV04kgNCMac_iH04FMQ6n3iWCYbrWuKdRCL9dx7kkCpN8tDpSzoA49jSk1TuwdIEtB07ObVvHkKeQuxuAlhH3TnQfjH5-_vPqmbHmCHy5AZlvl',
                //                 'Content-Type: application/json'
                //         ]
                //         axios.post("https://fcm.googleapis.com/fcm/send",{
                //             headers:headers,
                //             body:field
                //         }).then(async(e)=>{
                //             const notifcationdata = new Notification({
                //                 user_id:mongoose.Types.ObjectId(user_id),
                //                 receiver_id :mongoose.Types.ObjectId(follower_id),
                //                 type:3
                //             })
                //             const notification = await notifcationdata.save()
                //         })
                //     }
                // }
                const followerdata = new Follow({
                    user_id:mongoose.Types.ObjectId(user_id),
                    follower_id:mongoose.Types.ObjectId(follower_id),
                })
                const newfollower = await followerdata.save()
                return res.status(201).json({status:1,message:"Follow successfully!"})
            } 
        }else{
            return res.status(409).json({status:0,message:"This user not exist!!"})
        }
    } catch (error) {
        res.status(502).json({status:0,message:"internal server error" })
        console.log("server error on to follow user" + error); 
    }
}

exports.to_unfollow = async(req,res) =>{
    try {
        if( req?.body?.user_id == '' || !req?.body?.user_id || req?.body?.follower_id == '' || !req?.body?.follower_id ){ 
            return  res.status(406).json({status:0,message:"please give a proper parameter"})
        } 
        const user_data = await User.find({_id:req?.body?.user_id})
        if(user_data.length>0){
            await Follow.findOneAndDelete({user_id:req?.body?.user_id,follower_id:req?.body?.follower_id},{new:true})
            return  res.status(201).json({status:1,message:"unFollow successfully!"})
        }
        else{
            return res.status(409).json({status:0,message:"This user not exist!!"})
        }
    } catch (error) {
        res.status(502).json({status:0,message:"internal server error"})
        console.log("server error on to unfollow user" + error); 
    }
}