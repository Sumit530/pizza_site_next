const User = require("../model/users")
const moment = require("moment")
const nodemailer = require('nodemailer');
const { validate} =   require('deep-email-validator')
const jwt = require("jsonwebtoken")
const bcrypt = require("bcryptjs");
const notification_setting = require("../model/notifications")
const safety = require("../model/safeties")
const Follow = require("../model/followers")
require("dotenv").config()
const TwoFactor = new (require('2factor'))(process.env.API_KEY)


exports.RegiserUser = async(req,res) =>{
const {country_code} = req.body
let email = null;
let mobile_no = null;
if(req.body.email){
email = req.body.email
}
if(req.body.mobile_no){
mobile_no = req.body.mobile_no
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
   await TwoFactor.sendOTP(mobile_no,{otp:otp})
    const otp_expired = moment(otpdate).add(30, 'm').toDate();

    const userdata = new User({
        country_code,mobile_no,otp,otp_expired    	           
    })
    
    const finaluser = await userdata.save()
    const safeties = new safety({
        user_id: finaluser._id
    })
    await safeties.save()
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
            res.status(201).json({data:finaluser,status:1,message:"email send successfully"})
        }})
}

}


exports.social_signup = async(req,res)=>{
const {name,email,social_id,type} = req.body
if(!email || !type ){
    return res.status(401).json({status:1,message:"please fill field properly"})
}
const check_user = await User.find({email:email})
const keysecret = process.env.UserSecretkey
if(check_user.length>0){
    let token = jwt.sign({ id:check_user._id,email:check_user.email},keysecret);
    const data = {
        user_id: check_user._id  ,
        name:check_user.name ? check_user.name : "",
        email:check_user.email ? check_user.email : "",
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
    const {email,password,fcm_id,device_id} = req.body
    if(email && password && fcm_id && device_id){
        var user = null
        if(isNaN(email)){
             user = await User.find({mobile_no:email})
        }
        else if(email.match(/^(([^<>()[\]\.,;:\s@\"]+(\.[^<>()[\]\.,;:\s@\"]+)*)|(\".+\"))@(([^<>()[\]\.,;:\s@\"]+\.)+[^<>()[\]\.,;:\s@\"]{2,})$/i) != null){
             user = await User.find({email:email})
        }
        else {
             user = await User.find({username:email})
        }
        if(user != null) {
            if(bcrypt.compare(password,user.password)==false){
                return res.status(409).json({status:0,message:"invalid password "})
            }
            else{
                const update = await User.findOneAndUpdate({email:email},{device_id:device_id,fcm_id:fcm_id})
                const token = jwt.sign({id:finaluser._id,email:finaluser.email},keysecret)
                const data = {
                    user_id:finaluser._id,name:finaluser.name ? finaluser.name : "" ,country_code,mobile_no : finaluser.mobile_no ? finaluser.mobile_no : "",email : finaluser.email ? finaluser.email :"",language_id:finaluser.language_id,token:token
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
const {mobile_no} = req.body
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
    const updateuser = await User.findOneAndUpdate({_id:finaluser._id},{otp:otp,otp_expired:otp_expired})
    const data = {
        user_id:finaluser._id,name:finaluser.name ? finaluser.name : "" ,otp:otp,country_code,mobile_no : finaluser.mobile_no ? finaluser.mobile_no : "",email : finaluser.email ? finaluser.email :"",language_id:finaluser.language_id,token:token
    }
    res.status(201).json({status:1,message:"otp send successfully",data})
   
}
else{
    res.status(409n ).json({status:0,message:"user not found"})
}
}

exports.resend_otp = async(req,res)=>{
    const {mobile_no} = req.body
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
        const updateuser = await User.findOneAndUpdate({_id:finaluser._id},{otp:otp,otp_expired:otp_expired})
        const data = {
            user_id:finaluser._id,name:finaluser.name ? finaluser.name : "" ,otp:otp,country_code,mobile_no : finaluser.mobile_no ? finaluser.mobile_no : "",email : finaluser.email ? finaluser.email :"",language_id:finaluser.language_id,token:token
        }
        res.status(201).json({status:1,message:"otp send successfully",data})
       
    }
    else{
        res.status(409n ).json({status:0,message:"user not found"})
    }
    }
    

exports.user_details = async(req,res)=>{
    const {keyword} =  req.body
try {
    
    if(!keyword) {
        return res.status(402).json({status:0,message:"please provide a keyword"})
    } 
    var user = null
    if(isNaN(keyword)){
        user = await User.find({mobile_no:keyword})
    }
    else if(keyword.match(/^(([^<>()[\]\.,;:\s@\"]+(\.[^<>()[\]\.,;:\s@\"]+)*)|(\".+\"))@(([^<>()[\]\.,;:\s@\"]+\.)+[^<>()[\]\.,;:\s@\"]{2,})$/i) != null){
        user = await User.find({email:keyword})
    }
    if(user == null){
        res.status(406).json({status:0,message:"user not found"})
    }
    else {
        res.status(406).json({status:1,message:"User detail get successfully",data:user})
    }
} catch (error) {
    res.status(501).json({status:0,message:"internal server error"})
}
}
exports.get_my_accounts = async(req,res)=>{
    try {
        var result = []
        const {user_id } = req.body
        if(!user_id){
            return res.status(406).json({status:0,message:"please give a user id"})
        }  
        const user = await User.find({_id:user_id})
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
                    id:user._id,name:user.name ? user.name : "",username:user.username ? user.username : "",email:user.email ? user.email : ""  ,country_code:user.country_code ? user.country_code : "",dob:user.dob ? user.dob : "",private_account:user.private_account ? user.private_account : "",language_id:user.language_id ? user.language_id : "",is_vip:user.is_vip ? user.is_vip : "",wallet:user.wallet ? user.wallet : "",profile_image:profile
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
        
    
    const {user_id } = req.body
    var result = []
    if(!user_id){
        return res.status(406).json({status:0,message:"please give a user id"})
    }  
    var user = null
    if(req.body.keyword && req.body.keyword != '' ){
         user = await find({_id:user_id,status:1,username:`/${keyword}/i`})

    }else{
         user = await find({_id:user_id,status:1})
    }
    if(user != null){
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
    console.log("server error on get my account"); 
}

}

exports.check_otp  = async(req,res)=>{
    try {
        if(!req.body.user_id || req.body.user_id == '' ){
            return res.status(406).json({status:0,message:"please give a user id"})
        }
        const {user_id,otp} = req.body

        const user = await User.find({_id:user_id})
        if(user.length>0){
            if(user.otp == otp){
                await User.findOneAndUpdate({_id:user_id},{otp:'',otp_expired:''})
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
        if(!req.body.username || req.body.username == ''){ 
            return  res.status(406).json({status:0,message:"please give username"})
        }
        const {username} = req.body
        const user = await User.find({username:username})
        if(user.length>0){
            return res.status(402).json({status:0,message:"This user name is already our database"})
        }
        else {

        }
    } catch (error) {
        res.status(502).json({status:0,message:"internal server error"})
        console.log("server error on check username"); 
    }
}
exports.update_username = async(req,res) =>{
    try {
        
   
    if(!req.body.username || req.body.username == '' || req.body.user_id == '' || !req.body.user_id){ 
        return  res.status(406).json({status:0,message:"please give username"})
    }
    const {username,user_id} = req.body
    const user = await User.find({username:username})
    if(user.length>0){
        return res.status(402).json({status:0,message:"This user name is already our database"})
    }
    else {
        await User.findOneAndUpdate({_id:user_id},{username:username})
        return res.status(201).json({status:1,message:"username updated successfully"})
    }
} catch (error) {
    res.status(502).json({status:0,message:"internal server error"})
    console.log("server error on update username"); 
}
}

exports.update_mobile_no = async(req,res) =>{
    try {
        
    
    if(!req.body.mobile_no || req.body.mobile_no == '' || req.body.user_id == '' || !req.body.user_id){ 
        return  res.status(406).json({status:0,message:"please give username and mobile no"})
    }
    const user = await User.findOneAndUpdate({_id:req.body.user_id},{mobile_no:mobile_no})
    if(user.length>0){
        return res.status(201).json({status:1,message:"mobile number updated successfully"})
    }
} catch (error) {
    res.status(502).json({status:0,message:"internal server error"})
    console.log("server error on update mobiel no"); 
}
}

exports.update_page_name = async(req,res) =>{
   try {
    if(!req.body.page_name || req.body.page_name == '' || req.body.user_id == '' || !req.body.user_id){ 
        return  res.status(406).json({status:0,message:"please give username or page name"})
    }

    const updateuser = await User.findOneAndUpdate({_id:user_id},{page_name:page_name})
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
        if(!req.body.allow_find_me || req.body.allow_find_me  == ''|| !req.body.private_account || req.body.private_account  == '' || req.body.user_id == '' || !req.body.user_id){ 
            return  res.status(406).json({status:0,message:"please give prorpery parameter"})
        }
        const updateuser = await User.findOneAndUpdate({_id:user_id},{allow_find_me:allow_find_me,private_account:private_account})
        if(updateuser.length>0){
            return res.status(201).json({status:1,message:"privacy updated successfully"})
        }
    } catch (error) {
        res.status(502).json({status:0,message:"internal server error"})
    console.log("server error on update privacy"); 
    }
}

exports.get_user_safeties = async(req,res) =>{
  try {
    if( req.body.user_id == '' || !req.body.user_id){ 
        return  res.status(406).json({status:0,message:"please give proper parameter"})
    }
    const safeties = await safety.find({user_id:user_id})
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
    if(!req.body.is_allow_comments || req.body.is_allow_comments  == ''|| !req.body.is_allow_downloads || req.body.is_allow_downloads  == '' || req.body.user_id == '' || !req.body.user_id){ 
        return  res.status(406).json({status:0,message:"please give prorpery parameter"})
    }
    const safeties = await safety.find({user_id:user_id})
    if(safeties.length>0){
        const updatesafeties = await safety.findOneAndUpdate({user_id:user_id},{is_allow_comments:is_allow_comments,is_allow_downloads:is_allow_downloads})
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

exports.update_notification_settings = (req,res) =>{
    try {
        if(!req.body.is_likes || req.body.is_likes  == ''|| !req.body.is_mentions || req.body.is_mentions  == ''|| !req.body.is_direct_messages || req.body.is_direct_messages  == ''|| !req.body.is_recommended_broadcasts || req.body.is_recommended_broadcasts  == ''|| !req.body.is_customized_updates || req.body.is_customized_updates  == '' || req.body.user_id == '' || !req.body.user_id){ 
            return  res.status(406).json({status:0,message:"please give prorpery parameter"})
        }
        //notification setting
    } catch (error) {
        res.status(502).json({status:0,message:"internal server error"})
    console.log("server error on update notification setting"); 
    }
}

exports.get_notification_settings = (req,res) =>{
    try {
        if( req.body.user_id == '' || !req.body.user_id){ 
            return  res.status(406).json({status:0,message:"please give username and mobile no"})
        }
        //notification settings
    } catch (error) {
        res.status(502).json({status:0,message:"internal server error"})
    console.log("server error on update get notification setting"); 
    }
}

exports.getProfile = async(req,res) =>{
    try {
        if(!req.body.follower_id || req.body.follower_id == '' || req.body.login_id == '' || !req.body.login_id){ 
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
    if( req.body.user_id == '' || !req.body.user_id || req.body.lat == '' || !req.body.lat || req.body.long == '' || !req.body.long){ 
        return  res.status(406).json({status:0,message:"please give a proper parameter"})
    }
    const user = await User.find({_id:user_id})
    if(user.length>0){
        const locationupdate = await safety.findOneAndUpdate({user_id:user_id},{lat:lat,long:long})
        return res.status(201).json({status:1,message:"location updated successfully",data:locationupdate})
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
    if( req.body.user_id == '' || !req.body.user_id ){ 
        return  res.status(406).json({status:0,message:"please give a proper parameter"})
    }

    flwdata = await Follow.find({follower_id:req.body.user_id})
    if(user.length>0){

        return res.status(201).json({status:1,message:"location updated successfully",data:locationupdate})
    }
    else{
        return res.status(402).json({status:0,message:"user safety not found"})
    }
}