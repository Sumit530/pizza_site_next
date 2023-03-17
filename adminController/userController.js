const User = require("../model/users")
const fs = require("fs")
const notifications = require("../model/notifications")
const account_verification = require("../model/account_verification")
const user_report = require("../model/user_reports")
const help_center_data = require("../model/help_center_data")
const followers = require("../model/followers")
const videos = require("../model/videos")
exports.GetAllUser = async(req,res) =>{
    let page = req.body.page 
    let limit = req.body.limit
    page = (page-1)*limit 

    const users = await User.find({},{password:0},{ skip: page, limit: limit }).sort({createdAt:-1})
    const totalusers = await User.count()
    
    if(users.length>0){
        const finalusers =  users.map(async(e)=>{
                const follower = await followers.count({follower_id:e._id}) 
                const following = await followers.count({user_id:e._id}) 
                const post = await videos.count({user_id:e._id}) 
                console.log(post)
            if(e.profile_image  != ''){
                const path = process.env.PUBLICPROFILEURL
                if(fs.existsSync(`uploads/users/profile/${e.profile_image }`)){
                    var profile_image      = `${path}/${e.profile_image}`
                }
                else {
                    var profile_image     = ''
                }
            }else{
                var profile_image     = ''
            } 
            const obj = new Object(e)
            obj.profile_image = profile_image
            Object.keys("sumit").values = "sumit"
            obj['following'] = following
            obj['follower'] = follower
            return ({
                name:e.name,
                profile_image:profile_image,
                videos : post,
                follower,
                following,
                email:e.email,
                _id:e._id,
                status:e.status,
                createdAt:e.createdAt,


            })
        })
         const data = await Promise.all(finalusers)
        return res.status(201).json({status:1,message:"User Data found!",result:data,total:totalusers})
    }else{
        return res.status(404).json({status:0,message:"User Data Not found."})
    }
}

exports.deleteUser = async(req,res) =>{
    if(!req.body.user_id || req.body.user_id == ""){
        return  res.status(406).json({status:0,message:"please give a proper parameter"})
    }
    await User.deleteOne({_id:req.body.user_id})
    return res.status(201).json({status:1,message:"User Deleted Successfully!"})
}

exports.updateProfile = async(req,res)=>{
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

exports.userRoles = (req,res)=>{

}

exports.getTwoFactorDisableUser = async(req,res)=>{
    const users = await User.find({two_factor:false},{password:0}).sort({createdAt:-1})
    if(users.length>0){
        const finalusers = users.map((e)=>{

            if(e.profile_image  != ''){
                const path = process.env.PUBLICPROFILEURL
                if(fs.existsSync(`uploads/users/profile/${e.profile_image }`)){
                    var profile_image      = `${path}/${e.profile_image}`
                }
                else {
                    var profile_image     = ''
                }
            }else{
                var profile_image     = ''
            } 
            console.log(profile_image)
            e.profile_image = profile_image
            return e
        })
        console.log(finalusers)
        return res.status(201).json({status:1,message:"User Data found!",result:finalusers})
    }else{
        return res.status(404).json({status:0,message:"User Data Not found."})
    }
}


exports.require_two_factor = async(req,res)=>{
    if(!req.body.user_id || req.body.user_id == ""){
        return  res.status(406).json({status:0,message:"please give a proper parameter"})
    }
    if(!req.body.message || req.body.message == ""){
        return  res.status(406).json({status:0,message:"please give a proper parameter"})
    }
    const notification = new notifications({
        receiver_id:req.body.user_id,
        type:5,
        message:req.body.message
    })
        await notification.save()
    return res.status(201).json({status:1,message:"sent Notification Successfully "})

}

exports.email_not_verified_user = async(req,res)=>{
    const users = await User.find({email:""},{password:0}).sort({createdAt:-1})
    if(users.length>0){
        const finalusers = users.map((e)=>{

            if(e.profile_image  != ''){
                const path = process.env.PUBLICPROFILEURL
                if(fs.existsSync(`uploads/users/profile/${e.profile_image }`)){
                    var profile_image      = `${path}/${e.profile_image}`
                }
                else {
                    var profile_image     = ''
                }
            }else{
                var profile_image     = ''
            } 
            console.log(profile_image)
            e.profile_image = profile_image
            return e
        })
        console.log(finalusers)
        return res.status(201).json({status:1,message:"User Data found!",result:finalusers})
    }else{
        return res.status(404).json({status:0,message:"User Data Not found."})
    }
}

exports.verify_email = async(req,res)=>{
    if(!req.body.user_id || req.body.user_id == ""){
        return  res.status(406).json({status:0,message:"please give a proper parameter"})
    }
    if(!req.body.message || req.body.message == ""){
        return  res.status(406).json({status:0,message:"please give a proper parameter"})
    }
    const notification = new notifications({
        receiver_id:req.body.user_id,
        type:5,
        message:req.body.message
    })
        await notification.save()
    return res.status(201).json({status:1,message:"sent Notification Successfully "})

}
exports.show_verification_requests = async(req,res)=>{
                const data = await account_verification.find().populate("user_id","social_id name username mobile_no fcm_id profile_image is_vip private_account").sort({createdAt:-1})

        if(data.length>0){
            const finalusers = data.map((e)=>{

                if(e.user_id.profile_image  != ''){
                    const path = process.env.PUBLICPROFILEURL
                    if(fs.existsSync(`uploads/users/profile/${e.user_id.profile_image }`)){
                        var profile_image      = `${path}/${e.user_id.profile_image}`
                    }
                    else {
                        var profile_image     = ''
                    }
                }else{
                    var profile_image     = ''
                } 
                e.user_id.profile_image = profile_image
                if(e.documents  != ''){
                    const path = process.env.PUBLICPROFILEURL
                    if(fs.existsSync(`uploads/users/verification_documents/${e.documents }`)){
                        var document      = `${path}/${e.documents}`
                    }
                    else {
                        var document     = ''
                    }
                }else{
                    var document     = ''
                } 
                e.document = document
                return e
            })  
            return res.status(201).json({status:1,message:"User Data found!",result:finalusers})
        }else{
            return res.status(404).json({status:0,message:"User Data Not found."}) 
        }

}
exports.show_reported_user = async(req,res)=>{
    
    const data = await user_report.find().populate("user_id","social_id name username mobile_no fcm_id profile_image is_vip private_account").sort({createdAt:-1})

if(data.length>0){
const finalusers = data.map((e)=>{

    if(e.user_id.profile_image  != ''){
        const path = process.env.PUBLICPROFILEURL
        if(fs.existsSync(`uploads/users/profile/${e.user_id.profile_image }`)){
            var profile_image      = `${path}/${e.user_id.profile_image}`
        }
        else {
            var profile_image     = ''
        }
    }else{
        var profile_image     = ''
    } 
    e.user_id.profile_image = profile_image
    if(e.documents  != ''){
        const path = process.env.PUBLICPROFILEURL
        if(fs.existsSync(`uploads/users/verification_documents/${e.documents }`)){
            var document      = `${path}/${e.documents}`
        }
        else {
            var document     = ''
        }
    }else{
        var document     = ''
    } 
    e.document = document
    return e
})  
return res.status(201).json({status:1,message:"User Data found!",result:finalusers})
}else{
return res.status(404).json({status:0,message:"User Data Not found."}) 
}
}


exports.show_help_center_data = (req,res) =>{
    async(req,res) =>{
        try {
           
            const Data = await help_center_data.find().populate("user_id").sort({createdAt:-1})
            if(Data.length > 0){
              const user_data =   Data.map((e)=>{

                    if(e.user_id.profile_image  != ''){
                        const path = process.env.PUBLICPROFILEURL
                        if(fs.existsSync(`uploads/users/profile/${e.user_id.profile_image }`)){
                            var profile_image      = `${path}/${e.user_id.profile_image}`
                        }
                        else {
                            var profile_image     = ''
                        }
                    }else{
                        var profile_image     = ''
                    } 
                    e.user_id.profile_image = profile_image
                    return e
                })
                return res.status(201).json({status:1,message:"'Help center Data Found!",result:user_data})
            }else {
                res.status(402).json({status:0,message:"Help center Data Not Found"})    
            }      
        } catch (error) {
            res.status(502).json({status:0,message:"internal server error"})
        console.log("server error on add_help_center_problem_resolved" + error);  
        }
    }
}

exports.add_help_center_problem_resolved = async(req,res) =>{
    try {
        if(!req.body.help_center_data_id || req.body.help_center_data_id){ 
            return  res.status(406).json({status:0,message:"please give proper parameter"})
        }
        const checkdata = await help_centers.find({_id:req.body.help_center_id})
        if(checkdata.length > 0){
            const checkdata = await help_centers.findOneAndUpdate({_id:req.body.help_center_id},{problem_solved:true})
            return res.status(201).json({status:1,message:"'Problem resolved add successfully"})
        }else {
            res.status(402).json({status:0,message:"not found helpcenter"})    
        }
            
    } catch (error) {
        res.status(502).json({status:0,message:"internal server error"})
    console.log("server error on add_help_center_problem_resolved" + error);  
    }
}