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
const Language = require("../model/languages")
require("dotenv").config()
const TwoFactor = new (require('2factor'))(process.env.API_KEY)
const fs = require("fs");
const qrcode = require("qrcode")
const mongoose = require("mongoose")
var hbs = require('nodemailer-express-handlebars');
const path = require("path")
const ejs = require("ejs");
const videos = require("../model/videos");
const video_likes = require("../model/video_likes");
const video_watch_histories = require("../model/video_watch_histories");
const videos_comments = require("../model/videos_comments");
const video_favorites = require("../model/video_favorites");
const user_supports = require("../model/user_supports");
const banned_user = require("../model/banned_user");
const Complaint = require("../model/complaints")


function validateEmail(email) { 
    var emailRegex = /^([a-zA-Z0-9_\.\-])+\@(([a-zA-Z0-9\-])+\.)+([a-zA-Z0-9]{2,4})+$/;
    return emailRegex.test(email);
}

function validatePhone(phone) { 
    var phoneRegex = /^(\+91-|\+91|0)?\d{10}$/; 
    return phoneRegex.test(phone);
}
exports.registration = async(req,res) =>{
    
const country_code = req?.body?.country_code
console.log(req.body)
console.log(req.headers)
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
        return res.json({status:0,message:"incorrect phone number"})
    }
    const check = await User.find({mobile_no})
    if(check.length>0){
        return res.json({status:0,message:"phone number already exist"})
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
    const re = /^[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?$/i;
    if(!email.match(re)){
        return res.status(409).json({status:0,message:"incorrect email"})
    }
    const check = await User.find({email:email})
    // if(check.length>0){
    //     return res.status(409).json({status:0,message:"email allready exist"})
    // }
    const otp = Math.floor(1000 + Math.random() * 9000)
    const otpdate = Date.now()
    const otp_expired = moment(otpdate).add(30, 'm').toDate();
    const transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
          user: 'appstane.test@gmail.com',
          pass: 'hwivyglhxqcngwgy'
        },
      });
      transporter.use('complie',hbs({
        viewPath: 'views',
        extName:".handlebars"

    }))
    const sendEmail = (receiver,otp) => {
        ejs.renderFile('C:/demo3/views/email.ejs', { otp:otp , email:email}, (err, data) => {
          if (err) {
            console.log(err);
          } else {
            var mailOptions = {
              from: '"Swipe up" <Swipeup@gmail.com>',
              to: receiver,
              subject: "varification otp",
              html: data
            };
      
            transporter.sendMail(mailOptions, async(error, info) => {
                if (error) {
                    res.status(501).json({status:0,message:"internal error cannot sent email"+ error})
                  } else {
                      const userdata = new User({
                          country_code,email,otp,otp_expired    	           
                      })
                    
                      let finaluser = await userdata.save()
                      const notification_setting_data = new NotificationSetting({
                          user_id:finaluser._id
                      })
                      await notification_setting_data.save()
                      finaluser = {
                          user_id:finaluser._id,
                          name:finaluser.name,
                          country_code:finaluser.country_code,
                          mobile_no :finaluser.mobile_no,
                          email:finaluser.name,
                  
                      }
                      res.status(201).json({data:finaluser,status:1,message:"email send successfully"})
                  }
            });
          }
        });
      };
      sendEmail(email,otp)
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
             user = await User.find({mobile_no:email})
            
        }
        else if(email.match(/^(([^<>()[\]\.,;:\s@\"]+(\.[^<>()[\]\.,;:\s@\"]+)*)|(\".+\"))@(([^<>()[\]\.,;:\s@\"]+\.)+[^<>()[\]\.,;:\s@\"]{2,})$/i) != null){
             user = await User.find({email:email})
        }
        else {
             user = await User.find({username:email})
        }
        if(user.length>0) {
                
            if(await bcrypt.compare(password,user[0].password)==false){
                return res.status(409).json({status:0,message:"invalid password "})
            }
            else{

                if(user[0].deActivated == false){

                    const keysecret = process.env.USER_SECRET
                    const update = await User.findOneAndUpdate({email:email},{device_id:device_id,fcm_id:fcm_id},{new:true})
                    const token = jwt.sign({id:update._id,email:update.email},keysecret)
                    const data = {
                        user_id:update._id,name:update.name ? update.name : "" ,country_code:update.country_code,mobile_no : update.mobile_no ? update.mobile_no : "",email : update.email ? update.email :"",language_id:update.language_id,token:token
                    }
                    res.status(201).json({status:1,message:"logged in successfully",data:data})
                }else{
                         const reason = await banned_user.find({user_id:user[0]._id}).populate("reason")
                    return res.status(409).json({status:-1,message:"Id is Deactivated by admin",reason})
                }
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
if(!req.body.mobile_no){
    return res.json({status:0,message:"please provide email or phone"})
}
const phoneno = /^\d{10}$/;
if(req.body?.mobile_no.includes("@")){
    const otp = Math.floor(1000 + Math.random() * 9000)
    const otpdate = Date.now()
    const transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
          user: 'appstane.test@gmail.com',
          pass: 'hwivyglhxqcngwgy'
        },
      });
      transporter.use('complie',hbs({
        viewPath: 'views',
        extName:".handlebars"

    }))
    const sendEmail = (receiver,otp) => {
        let path = __dirname + "/../views/email.ejs"
        ejs.renderFile(path, { otp:otp , email:req.body?.mobile_no}, (err, data) => {
          if (err) {
            console.log(err);
          } else {
            var mailOptions = {
              from: '"Swipe up" <Swipeup@gmail.com>',
              to: receiver,
              subject: "varification otp",
              html: data
            };
      
            transporter.sendMail(mailOptions, async(error, info) => {
                if (error) {
                    res.status(501).json({status:0,message:"internal error cannot sent email"+ error})
                  } else {
                      let finaluser = await User.findOne({email:receiver})
                      const otp_expired = moment(otpdate).add(30, 'm').toDate();
                       await User.findOneAndUpdate({email:receiver},{otp:otp,otp_expired:otp_expired},{new:true})
                     
                      finaluser = {
                          user_id:finaluser?._id,
                          name:finaluser?.name,
                          country_code:finaluser?.country_code,
                          mobile_no :finaluser?.mobile_no,
                          email:finaluser?.email,
                          language_id:finaluser?.language_id,
                          otp:otp
                      }
                     return res.status(201).json({data:finaluser,status:1,message:"email send successfully"})
                  }
            });
          }
        });
      };
      sendEmail(req.body.mobile_no,otp)
}else{
    if(mobile_no.match(phoneno) == null ){
        return res.status(406).json({status:0,message:"please povide a valide number"})
    }
    const finaluser = await User.findOne({mobile_no:mobile_no})
    if(finaluser){
    
        const otp = Math.floor(1000 + Math.random() * 9000)
        // await TwoFactor.sendOTP(mobile_no,{otp:otp})
        const otpdate = Date.now()
        const otp_expired = moment(otpdate).add(30, 'm').toDate();
        const updateuser = await User.findOneAndUpdate({_id:finaluser._id},{otp:otp,otp_expired:otp_expired},{new:true})
        const data = {
            user_id:finaluser._id,name:finaluser.name ? finaluser.name : "" ,otp:otp,country_code:finaluser.country_code,mobile_no : finaluser.mobile_no ? finaluser.mobile_no : "",email : finaluser.email ? finaluser.email :"",language_id:finaluser.language_id
        }
        res.status(201).json({status:1,message:"otp send successfully",data})
       
    }
    else{
        res.status(409).json({status:0,message:"user not found"})
    }
}



}
exports.reset_password = (req,res)=>{
    
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
    

exports.getmyqrcode = async(req,res)=>{
    if(!req.body.user_id || req.body.user_id == '' ){ 
        return  res.status(406).json({status:0,message:"please give proper parameter"})
    } 

    const userData = await User.find({_id:req?.body?.user_id})
    if(userData.length>0){
        let data = {
            id:userData[0]._id,
            name:userData[0].name,
            username:userData[0].username,
        }
        data = JSON.stringify(data)
        qrcode.toDataURL(data,(err,url)=>{
            if(err) return "error orrcured " + err
            const data = url.split("base64,")[1]
            res.status(201).json({status:1,message:"Qrcode generated successfully",data:data})
        })

    }else{
        res.status(409).json({status:0,message:"user not found"})
    }
}


exports.user_details = async(req,res)=>{
    try {
    const {keyword} =  req?.body
    
    if(!keyword) {
        return res.status(402).json({status:0,message:"please provide a keyword"})
    } 
    var user = null
    if(isNaN(keyword) == false){
       var user = await User.find({mobile_no: {$regex :keyword}})
    }
    else if(keyword.match(/^(([^<>()[\]\.,;:\s@\"]+(\.[^<>()[\]\.,;:\s@\"]+)*)|(\".+\"))@(([^<>()[\]\.,;:\s@\"]+\.)+[^<>()[\]\.,;:\s@\"]{2,})$/i) != null){
        var user = await User.find({email: {$regex : keyword}},{otp:0,createdAt:0,deletedAt:0,updatedAt:0})
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

exports.all_user_list = async(req,res) =>{
    try {
    if(!req.body.keyword || req.body.keyword == "" ){
        return res.status(402).json({status:0,message:"internal server error"})
    }
    const userData = await User.find({username: {$regex : req.body.keyword}},{name:1,username:1,profil_image:1,private_account:1})
    if(userData.length>0){
        const data = userData.map((e)=>{
            if(e.profile_image != ''){
                
                const path = process.env.PUBLICPROFILEURL
                if(fs.existsSync(`uploads/users/profile/${e.profile_image}`)){
                    var profile_image = `${path}/${e.profile_image}`
                }
                else {
                    var profile_image = ''
                }
            }else{
                var profile_image = ''
            }
            return ({
                id : e._id,
                name:e.name,
                username:e.username,
                private_account : e.private_account == true ? 1 : 0 ,
                profile_image:profile_image,

            })
        })
        if(data.length>0){
            return  res.status(201).json({status:1,message:"user found",data:data})  
        }else{
            return res.status(406).json({status:0,message:"No data found.!"})
        }
    }else{
        return res.status(406).json({status:0,message:"No data found.!"})
    }
} catch (error) {
    res.status(502).json({status:0,message:"internal server error"})
    console.log("server error on get my account" + error);   
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
exports.reset_password = async(req,res)=>{

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
            return res.status(201).json({status:1,message:"This user name is already our database"})
        }
        else {
            return res.status(201).json({status:0,message:"This user name is not in our database"})
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

exports.update_dob = async(req,res) =>{
    try {
        
   
    if(!req?.body?.dob ||  req?.body?.dob == '' || req?.body?.user_id == '' || !req?.body?.user_id){ 
        return  res.status(406).json({status:0,message:"please give proper parameter"})
    }
    const {dob,user_id} = req?.body
    console.log(dob)
    const user = await User.find({_id:user_id})
    if(user.length>0){
        await User.findOneAndUpdate({_id:user_id},{dob: moment(dob,"DD/MM/YYYY")},{new:true})
        return res.status(201).json({status:1,message:"Dob updated successfully"})
    }
    else {
        return res.status(402).json({status:0,message:"User Not Exist"})
    }
} catch (error) {
    res.status(502).json({status:0,message:"internal server error"})
    console.log("server error on update username",error); 
}
}
exports.update_password = async(req,res) =>{
    try {
        
   
    if(!req?.body?.password || req?.body?.password == '' || req?.body?.user_id == '' || !req?.body?.user_id){ 
        return  res.status(406).json({status:0,message:"please give username"})
    }
    const {password,user_id} = req?.body
    const pass = await bcrypt.hash(password,10)
    const user = await User.find({_id:user_id})
    if(user.length>0){
        await User.findOneAndUpdate({_id:user_id},{password:pass,password_updated_at:moment().local().format(),password_expire_at:moment().local().add(30,"day").format()},{new:true})
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
    console.log("server error on update mobile no"); 
}
}

exports.update_page_name = async(req,res) =>{
   try {
    if(!req?.body?.page_name || req?.body?.page_name == '' || req?.body?.user_id == '' || !req?.body?.user_id){ 
        return  res.status(406).json({status:0,message:"please give username or page name"})
    }

    const updateuser = await User.findOneAndUpdate({_id: req?.body?.user_id},{page_name:req?.body?.page_name},{new:true})
    if(Object.keys(updateuser).length > 0){
        return res.status(201).json({status:1,message:"page name updated successfully"})
    }else{
        return res.status(402).json({status:0,message:"page name not updated please try again"})
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

exports.update_profile = async(req,res) =>{
    if(!req?.body?.name || req?.body?.name  == ''){ 
        return  res.status(406).json({status:0,message:"please give prorpery parameter"})
    }
    if(!req?.body?.username || req?.body?.username  == '' ){ 
        return  res.status(406).json({status:0,message:"please give prorpery parameter"})
    }
    if(req?.body?.user_id == '' || !req?.body?.user_id){ 
        return  res.status(406).json({status:0,message:"please give prorpery parameter"})
    }
    if(!req?.body?.email || req?.body?.email  == ''){ 
        return  res.status(406).json({status:0,message:"please give prorpery parameter"})
    }
  
    if(!req?.body?.gender || req?.body?.gender  == ''){ 
        return  res.status(406).json({status:0,message:"please give prorpery parameter"})
    }
    const userData = await User.findOneAndUpdate({_id:req?.body?.user_id},{
        name : req?.body?.name,
        username : req?.body?.username,
        email : req?.body?.email,
        mobile_no:req?.body?.mobile_no ? req?.body?.mobile_no : "",
        website : req?.body?.website ? req?.body?.website : "",
        gender : req?.body?.gender,
        bio : req?.body?.bio ? req?.body?.bio : "",
        profile_image : req?.file ? req?.file?.filename : "" 
    })
    if(userData.profile_image  != ''){
        
        if(fs.existsSync(`uploads/users/profile/${userData.profile_image }`)){
                    fs.unlink(`uploads/users/profile/${userData.profile_image }`,(err)=>{
                        if(err) return res.json({status:0,message:"please try again"})
                    })
        }
    }
    var data = await User.find({_id:req.body.user_id})
    if(data.length > 0){
        if(data[0].profile_image  != ''){
            const path = process.env.PUBLICPROFILEURL
            if(fs.existsSync(`uploads/users/profile/${data[0].profile_image }`)){
                var profile_image      = `${path}/${data[0].profile_image}`
            }
            else {
                var profile_image     = ''
            }
        }else{
            var profile_image     = ''
        } 
        console.log(profile_image)
        data[0].profile_image = profile_image
        return res.status(201).json({status:1,message:"profile updated successfully",data:data})
    }else{   
        return res.status(402).json({status:0,message:"user profile not updated"})
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
        const notifcation_data = NotificationSetting.findOneAndUpdate({ user_id:req?.body?.user_id,},{
            is_likes:req?.body?.is_likes,
            is_customized_updates:req?.body?.is_customized_updates,
            is_direct_messages:req?.body?.is_direct_messages,
            is_mentions:req?.body?.is_mentions,
            is_recommended_broadcasts:req?.body?.is_recommended_broadcasts,  
        })
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
        var profile = await User.find({_id:follower_id})
        if(profile.length==0){
            return res.status(402).json({status:0,message:"No Data Found"})
        }
        if(profile[0].profile_image != ''){
                
            const path = process.env.PUBLICPROFILEURL
            if(fs.existsSync(`uploads/profile/${profile[0].profile_image}`)){
                var filepath = `${path}/${profile[0].profile_image}`
            }
            else {
                var filepath = ''
            }
        }else{
            var filepath = ''
        }
        var total_following  = await Follow.count({follower_id:profile[0]._id})
        var total_follow     = await Follow.count({user_id:profile[0]._id})
        var total_likess  = 0
        const videos  = await videos.find({user_id:profile[0]._id})
        if(videos.length>0){
            videos.map((e)=>{
                total_likess += video_likes.count({video_id:e._id}) 
            })
        }else{
            total_likess = 0
        }
        var total_likes   = 0
        var total_like_this_video   = 0
        var total_comments   = 0
        var all_video_data  = await videos.find({user_id:profile[0]._id,is_view:1,is_save_to_device:0})
        if(all_video_data.length>0){
               var video_file_data =  all_video_data.map(async(e)=>{
                    var total_views = await video_watch_histories.count({video_id:e._id})
                    total_likes   += await video_likes.count({video_likes:e._id})
                    total_like_this_video   = await video_likes.count({video_likes:e._id})
                    total_comments   = await videos_comments.count({video_id:e._id})
                    if(e.cover_image != ''){
                        const path = process.env.PUBLICCOVERIMAGEEURL
                        if(fs.existsSync(`uploads/videos/cover_image/${e.cover_image}`)){
                            var cover_image    = `${path}/${e.cover_image}`
                        }
                        else {
                            var cover_image   = ''
                        }
                    }else{
                        var cover_image   = ''
                    }
                    if(e.file_name  != ''){
                        const path = process.env.PUBLICVIDEOSURL
                        if(fs.existsSync(`uploads/videos/videos/${e.file_name }`)){
                            var  video_url     = `${path}/${e.file_name}`
                        }
                        else {
                            var video_url    = ''
                        }
                    }else{
                        var  video_url    = ''
                     } 
                     var user_like_data = await video_likes.find({video_id:e._id,user_id:req?.body?.login_id})
                     if(user_like_data.length > 1){
                        var is_video_like  = 1
                     }else{
                        var is_video_like  = 0
                     }
                     return ({
                    id:e._id,
                    cover_image:cover_image,
                    video_url:video_url,
                    description:e.description,
                    is_video_like:is_video_like,
                    total_comments:total_comments,
                    total_views:total_views,
                     })

                })
        }else{
            var video_file_data = []
        }
        const all_favorite_video_data = await video_favorites.find({user_id:req?.body?.login_id})
        if(all_favorite_video_data.length>0){
            var record_video_files =  all_favorite_video_data.map(async(e)=>{
                var total_views = await video_watch_histories.count({video_id:e._id})
                total_likes   += await video_likes.count({video_likes:e._id})
                total_like_this_video   = await video_likes.count({video_likes:e._id})
                total_comments   = await videos_comments.count({video_id:e._id})
                if(e.cover_image != ''){
                    const path = process.env.PUBLICCOVERIMAGEEURL
                    if(fs.existsSync(`uploads/videos/cover_image/${e.cover_image}`)){
                        var cover_image    = `${path}/${e.cover_image}`
                    }
                    else {
                        var cover_image   = ''
                    }
                }else{
                    var cover_image   = ''
                }
                if(e.file_name  != ''){
                    const path = process.env.PUBLICVIDEOSURL
                    if(fs.existsSync(`uploads/videos/videos/${e.file_name }`)){
                        var  video_url     = `${path}/${e.file_name}`
                    }
                    else {
                        var video_url    = ''
                    }
                }else{
                    var  video_url    = ''
                 } 
                 var user_like_data = await video_likes.find({video_id:e._id,user_id:req?.body?.login_id})
                 if(user_like_data.length > 1){
                    var is_video_like  = 1
                 }else{
                    var is_video_like  = 0
                 }
                 return ({
                id:e._id,
                cover_image:cover_image,
                video_url:video_url,
                description:e.description,
                is_video_like:is_video_like,
                total_comments:total_comments,
                total_views:total_views,
                 })

            })
        }else{
            var record_video_files = []
        }
       const private_videos  = await videos.find({user_id:profile[0]._id,is_save_to_device:0})
       if(private_videos.length > 0){
       var recordp_video_file =  all_favorite_video_data.map(async(e)=>{
            var total_views = await video_watch_histories.count({video_id:e._id})
            total_likes   += await video_likes.count({video_likes:e._id})
            total_like_this_video   = await video_likes.count({video_likes:e._id})
            total_comments   = await videos_comments.count({video_id:e._id})
            if(e.cover_image != ''){
                const path = process.env.PUBLICCOVERIMAGEEURL
                if(fs.existsSync(`uploads/videos/cover_image/${e.cover_image}`)){
                    var cover_image    = `${path}/${e.cover_image}`
                }
                else {
                    var cover_image   = ''
                }
            }else{
                var cover_image   = ''
            }
            if(e.file_name  != ''){
                const path = process.env.PUBLICVIDEOSURL
                if(fs.existsSync(`uploads/videos/videos/${e.file_name }`)){
                    var  video_url     = `${path}/${e.file_name}`
                }
                else {
                    var video_url    = ''
                }
            }else{
                var  video_url    = ''
             } 
             var user_like_data = await video_likes.find({video_id:e._id,user_id:req?.body?.login_id})
             if(user_like_data.length > 1){
                var is_video_like  = 1
             }else{
                var is_video_like  = 0
             }
             return ({
            id:e._id,
            cover_image:cover_image,
            video_url:video_url,
            description:e.description,
            is_video_like:is_video_like,
            total_comments:total_comments,
            total_views:total_views,
             })

        })
       }else{
        var recordp_video_file = []
       } 
       const unshuffle_followers_data  = await Follow.find({user_id:req?.body?.follower_id})
       if(unshuffle_followers_data.length>0){

           var followers_data =  unshuffle_followers_data
           .map(value => ({ value, sort: Math.random() }))
           .sort((a, b) => a.sort - b.sort)
           .map(({ value }) => value)
           followers_data = followers_data.splice(0,25)
           var followers_result  = followers_data.map(async(e)=>{
                const user_data = await User.find({_id:e.follower_id})
                if(user_data.length>0){
                    if(user_data[0].profile_image  != ''){
                        const path = process.env.PUBLICPROFILEURL
                        if(fs.existsSync(`uploads/users/profile/${user_data[0].profile_image }`)){
                            var  profile_image     = `${path}/${user_data[0].profile_image}`
                        }
                        else {
                            var profile_image    = ''
                        }
                    }else{
                        var  profile_image    = ''
                     } 
                    }
                    return({
                        id:e._id,
                        user_id:user_data[0]._id,
                        name:user_data[0].name,
                        username:user_data[0].username,
                        private_account:user_data[0].private_account,
                        profile_image:profile_image
                    })
           })
        }else{
            var followers_result = []
        }

        if(profile[0].email != ""){
            hidden = ""
            for(let i = 0;i<profile[0].email.split("@")[0]-3;i++){
                hidden += "*" 
            }
            var email = `${profile[0].email.splice(0,3)}${hidden}`
        }else{
            email = ""
        }
        if(profile[0].email != ""){
            var mobile_no = `${profile[0].email.splice(0,2)}******${profile[0].email.splice(8,2)}`
        }else{
            mobile_no = ""
        }
        
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
    flwdata = await Follow.find({follower_id:req?.body?.user_id})
    const data = []
   const promisedata =  flwdata?.map(async(g)=>{
        const users = await User.find({_id:g.user_id}) 

            if(users[0].profile_image != ''){
                
                const path = process.env.PUBLICPROFILEURL
                if(fs.existsSync(`uploads/profile/${users[0].profile_image}`)){
                    var filepath = `${path}/${users[0].profile_image}`
                }
                else {
                    var filepath = ''
                }
            }else{
                var filepath = ''
            }
            return({
                id:g._id,
                user_id:g.follower_id,
                name:users[0].name ? users[0].name  : "" ,
                username:users[0].username ? users[0].username :"",
                private_account:users[0].private_account ? users[0].private_account : "",
                profil_image:filepath
            })
        
    })
    Promise.all(promisedata).then((e)=>{

        if(e.length>0){
            return res.status(201).json({status:1,message:" follower found successfully",data:e})
        }
        else{
            return res.status(402).json({status:0,message:"user not have followers"})
        }
    })
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

    const flwdata = await Follow.find({user_id:req?.body?.user_id})
    const data = []
    const proimesdata = flwdata?.map(async(g)=>{
       
            const users = await User.find({_id:g.follower_id}) 
            if(users[0]?.profile_image != ''){
                
                const path = process.env.PUBLICPROFILEURL
                if(fs.existsSync(`uploads/users/profile/${users[0]?.profile_image}`)){
                    var filepath = `${path}/${users[0]?.profile_image}`
                }
                else {
                    var filepath = ''
                }
            }else{
                var filepath = ''
            }
           
            return({
                id:g._id,
                user_id:g.follower_id,
                name:users[0].name ? users[0].name  : "" ,
                username:users[0].username ? users[0].username :"",
                private_account:users[0].private_account ? users[0].private_account : "",
                profil_image:filepath
            })
        
    })
    Promise.all(proimesdata).then((e)=>{
        if(e.length>0){
            return res.status(201).json({status:1,message:"follower found successfully",data:e})
        }
        else{
            return res.status(402).json({status:0,message:"user not have followers"})
        }
    })
    
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
        const flwdata = await Follow.find({user_id:req?.body?.user_id,status:0}).populate("follower_id")
        if(flwdata.length>0){
            const data = []
          const proimesdata  =  flwdata?.map(async(g)=>{
            const users = await User.find({_id:g.follower_id})
                g?.follower_id?.map((e)=>{
        
                    if(users[0].profile_image != ''){
                        
                        const path = process.env.PUBLICPROFILEURL
                        if(fs.existsSync(`uploads/users/profile/${users[0].profile_image}`)){
                            var filepath = `${path}/${users[0].profile_image}`
                        }
                        else {
                            var filepath = ''
                        }
                    }else{
                        var filepath = ''
                    }
                    return ({
                          id:g._id,
                          user_id:g.user_id,
                          name:g.name ? g.name  : "" ,
                          username:g.username ? g.username :"",
                          private_account:g.private_account ? g.private_account : "",
                          profil_image:filepath
                    })
                })
            })
            Promise.all(proimesdata).then((e)=>{

                if(e.length>0){
                    return res.status(201).json({status:1,message:"pending request found successfully",data:e})
                }
                else{
                    return res.status(402).json({status:0,message:"user not have pending request"})
                }
            })
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
                             const notifcationdata = new Notification({
                               user_id:mongoose.Types.ObjectId(user_id),
                                receiver_id :mongoose.Types.ObjectId(follower_id),
                             type:3
                           })
                             const notification = await notifcationdata.save()
                //         })
                //     }
                // }
                const followerdata = new Follow({
                    user_id:user_id,
                    follower_id:follower_id,
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
exports.update_language = async(req,res)=>{
    try {
        if( req?.body?.user_id == '' || !req?.body?.user_id ){ 
            return  res.status(406).json({status:0,message:"please give a proper parameter"})
        }  
        if( req?.body?.language_id == '' || !req?.body?.language_id || req?.body?.language_id == '' || !req?.body?.language_id ){ 
            return  res.status(406).json({status:0,message:"please give a proper parameter"})
        }  
        const userdata = await User.find({_id:req?.body?.user_id})
        if(userdata.length>0){
            const langdata= await Language.find({_id:req?.body?.language_id})
            if(langdata.length > 0){
                await User.findOneAndUpdate({_id:req?.body?.user_id},{language_id:req?.body?.language_id})
                return res.status(201).json({status:1,message:"langauge updated successfully!"})
            }else{
                return res.status(409).json({status:0,message:"This language not exist!!"}) 
            }
        }else{
            return res.status(409).json({status:0,message:"This user not exist!!"}) 
        }
    } catch (error) {
        res.status(502).json({status:0,message:"internal server error"})
        console.log("server error on to update language" + error); 
    }
}
exports.to_unfollow = async(req,res) =>{
    try {
        if( req?.body?.user_id == '' || !req?.body?.user_id || req?.body?.follower_id == '' || !req?.body?.follower_id ){ 
            return  res.status(406).json({status:0,message:"please give a proper parameter"})
        } 
        const user_data = await User.find({_id:req?.body?.user_id})
        if(user_data.length>0){
            const flwdata = await Follow.find({user_id:req?.body?.user_id,follower_id:req.body.follower_id})
            if(flwdata.length > 0){

                await Follow.findOneAndDelete({user_id:req?.body?.user_id,follower_id:req?.body?.follower_id},{new:true})
                return  res.status(201).json({status:1,message:"unFollow successfully!"})
            } else{
                return res.status(409).json({status:0,message:"user not following "})
            }
        }
        else{
            return res.status(409).json({status:0,message:"This user not exist!!"})
        }
    } catch (error) {
        res.status(502).json({status:0,message:"internal server error"})
        console.log("server error on to unfollow user" + error); 
    }
}




exports.add_complaint = async(req,res) =>{
    if( req?.body?.user_id == '' || !req?.body?.user_id || req?.body?.description == '' || !req?.body?.description ){ 
        return  res.status(406).json({status:0,message:"please give a proper parameter"})
    } 
    const Adding_complaint = new Complaint({
        user_id:req.body.user_id,
        description:req.body.description
    })
    await Adding_complaint.save()
    return  res.status(201).json({status:1,message:"Compaint Added Successfully!"})

}
exports.user_support_request = async(req,res) =>{
    if( req?.body?.user_id == '' || !req?.body?.user_id || req?.body?.description == '' || !req?.body?.description ){ 
        return  res.status(406).json({status:0,message:"please give a proper parameter"})
    } 

    const supports = new user_supports({
        user_id:req.body.user_id,
        description:req.body.description,
    })
    await supports.save()
    return  res.status(201).json({status:1,message:"Request Sent successfully!"})
}









