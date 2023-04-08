const User = require("../model/users")
const fs = require("fs")
const notifications = require("../model/notifications")
const account_verification = require("../model/account_verification")

const help_center_data = require("../model/help_center_data")
const followers = require("../model/followers")
const videos = require("../model/videos")
const video_reports = require("../model/video_reports")
const user_supports = require("../model/user_supports")


exports.GetAllUser = async(req,res) =>{
    let page = req.body.page 
    let limit = req.body.limit
    page = (page-1)*limit 
    
        
    const users = await User.find({"$expr": {
        "$regexMatch": {
          "input": { "$concat": ["$name", " ", "$email"] },
          "regex": req.body.key,  //Your text search here
          "options": "i"
        }
      }},{password:0},{ skip: page, limit: limit }).sort({createdAt:-1})
      const totalusers = await User.count({"$expr": {
        "$regexMatch": {
          "input": { "$concat": ["$name", " ", "$email"] },
          "regex": req.body.key,  //Your text search here
          "options": "i"
        }
      }})
    if(users.length>0){
        const finalusers =  users.map(async(e)=>{
                const follower = await followers.count({follower_id:e._id}) 
                const following = await followers.count({user_id:e._id}) 
                const post = await videos.count({user_id:e._id}) 
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
                username:e.username,
                bio:e.bio,
                mobile_no:e.mobile_no,
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
    const bodyData = JSON.parse(req.body.data)
    
    console.log(bodyData)
    // if(!req?.body?.name || req?.body?.name  == ''){ 
    //     return  res.status(406).json({status:0,message:"please give prorpery parameter"})
    // }
    // if(!req?.body?.username || req?.body?.username  == '' ){ 
    //     return  res.status(406).json({status:0,message:"please give prorpery parameter"})
    // }
    // if(req?.body?.user_id == '' || !req?.body?.user_id){ 
    //     return  res.status(406).json({status:0,message:"please give prorpery parameter"})
    // }
    // if(!req?.body?.email || req?.body?.email  == ''){ 
    //     return  res.status(406).json({status:0,message:"please give prorpery parameter"})
    // }
    if(req.file){
        bodyData.profile_image = req.file.filename
    }

    const userData = await User.findOneAndUpdate({_id:bodyData._id},bodyData)
    console.log(userData)
    // if(userData.profile_image  != ''){
        
    //     if(fs.existsSync(`uploads/users/profile/${userData.profile_image }`)){
    //                 fs.unlink(`uploads/users/profile/${userData.profile_image }`,(err)=>{
    //                     if(err) return res.json({status:0,message:"please try again"})
    //                 })
    //     }
    // }
    var data = await User.find({_id:bodyData._id})
    if(data.length > 0){
        return res.status(201).json({status:1,message:"profile updated successfully"})
    }else{   
        return res.status(402).json({status:0,message:"user profile not updated"})
    }
}

exports.userRoles = (req,res)=>{

}

exports.getTwoFactorDisableUser = async(req,res)=>{
    let page = req.body.page 
    let limit = req.body.limit
    page = (page-1)*limit 
    const users = await User.find({two_factor:false,"$expr": {
        "$regexMatch": {
          "input": { "$concat": ["$name", " ", "$email"] },
          "regex": req.body.key,  //Your text search here
          "options": "i"
        }
      }},{password:0},{ skip: page, limit: limit }).sort({createdAt:-1})
    const totalusers = await User.count({two_factor:false,"$expr": {
        "$regexMatch": {
          "input": { "$concat": ["$name", " ", "$email"] },
          "regex": req.body.key,  //Your text search here
          "options": "i"
        }
      }})
    if(users.length>0){
        const finalusers = users.map(async(e)=>{

            const follower = await followers.count({follower_id:e._id}) 
            const following = await followers.count({user_id:e._id}) 
            const post = await videos.count({user_id:e._id}) 
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
            username:e.username,
            bio:e.bio,
            mobile_no:e.mobile_no,
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

    const users = await User.find({ "$and" :  [{email:{"$exists" : true, "$eq" : ""}},{"$expr": {  "$regexMatch": {"input": { "$concat": ["$name", " ", "$email"] },"regex": req.body.key,  "options": "i"}}}]},{password:0}).sort({createdAt:-1})
    const totalusers = await User.count(  { "$and" :  [{email:{"$exists" : true, "$eq" : ""}},{"$expr": {  "$regexMatch": {"input": { "$concat": ["$name", " ", "$email"] },"regex": req.body.key,  "options": "i"}}}]}).sort({createdAt:-1})
    if(users.length>0){
        const finalusers = users.map(async(e)=>{

            const follower = await followers.count({follower_id:e._id}) 
                const following = await followers.count({user_id:e._id}) 
                const post = await videos.count({user_id:e._id}) 
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
                username:e.username,
                bio:e.bio,
                mobile_no:e.mobile_no,
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

exports.verify_email = async(req,res)=>{
    if(!req.body.user_id || req.body.user_id == ""){
        return  res.status(406).json({status:0,message:"please give a proper parameter"})
    }
    if(!req.body.message || req.body.message == ""){
        return  res.status(406).json({status:0,message:"please give a proper parameter"})
    }
    console.log(req.body.user_id)
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
            let page = req.body.page 
             let limit = req.body.limit
             page = (page-1)*limit 
    
            const Data = await help_center_data.find({"$expr": {
                "$regexMatch": {
                  "input": { "$concat": ["$user_id.name", " ", "$user_id.email"] },
                  "regex": req.body.key,  //Your text search here
                  "options": "i"
                }
              }}).populate("user_id").sort({createdAt:-1})
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

exports.show_user_support = async(req,res) =>{
    let page = req.body.page 
    let limit = req.body.limit
    page = (page-1)*limit 
    var data = await user_supports.find({},{},{ skip: page, limit: limit }).populate({path:"user_id",select:"social_id name email username mobile_no fcm_id profile_image is_vip private_account",match:{"$expr": {
        "$regexMatch": {
          "input": { "$concat": ["$name", " ", "$email"] },
          "regex": req.body.key,  //Your text search here
          "options": "i"
        }
      }}}).sort({createdAt:-1})
      var total = await user_supports.count().populate({path:"user_id",select:"social_id name username mobile_no fcm_id profile_image is_vip private_account",match:{"$expr": {
        "$regexMatch": {
          "input": { "$concat": ["$name", " ", "$email"] },
          "regex": req.body.key,  //Your text search here
          "options": "i"
        }
      }}}).sort({createdAt:-1})
       data = data.filter((e)=>{return e.user_id != null})
    if(data.length>0){
        var finalusers =  data.map(async(e)=>{
            const follower = await followers.count({follower_id:e.user_id._id}) 
            const following = await followers.count({user_id:e.user_id._id}) 
            const post = await videos.count({user_id:e.user_id._id}) 
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
        const obj = new Object(e)
        obj.profile_image = profile_image
        obj['following'] = following
        obj['follower'] = follower
        return ({
            name:e.user_id.name,
            profile_image:profile_image,
            videos : post,
            follower,
            username:e.user_id.username,
            bio:e.description,
            mobile_no:e.user_id.mobile_no,
            following,
            email:e.user_id.email,
            _id:e._id,
            user_id : e.user_id._id,
            status:e.status,
            
            createdAt:e.createdAt,


        })
    })
    finalusers = await Promise.all(finalusers)
    return res.status(201).json({status:1,message:"User Data found!",result:finalusers,total:total})
    }else{
    return res.status(404).json({status:0,message:"User Data Not found."}) 
    }
}