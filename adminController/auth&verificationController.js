const banned_user = require("../model/banned_user")
const ban_reasons = require("../model/ban_reasons")
const password_policies = require("../model/password_policies")
const momnet = require("moment")
const Users = require("../model/users")
const followers = require("../model/followers")
const videos = require("../model/videos")
exports.getPasswordPolicy = async(req,res) =>{
   
    let page = req.body.page 
    let limit = req.body.limit
    page = (page-1)*limit 
    
        const password_policy = await password_policies.find({},{},{ skip: page, limit: limit })
        const total = await password_policies.count()
        if(password_policy.length>0){
            res.status(201).json({status:1,message:"password policy got successfully",result:password_policy,total:total})
        }else{
            res.status(402).json({status:0,message:"Password Policy Not Found",})

        }
}

exports.changePasswrodPolicy = async(req,res)=>{
    if(!req.body.id || req.body.id == '' || req.body.minimum_length == '' || !req.body.minimum_length || !req.body.complexity || req.body.complexity == '' || !req.body.expire || req.body.expire == ''){ 
        return  res.status(406).json({status:0,message:"please give proper parameter"})
    }
    await password_policies.findOneAndUpdate({_id:req.body.id},{minimum_length:req.body.minimum_length,complexity:req.body.complexity,expire:req.body.complexity})
    res.status(201).json({status:1,message:"password policy successfully Updated"})
}

exports.banUser = async(req,res) =>{
    // if(!req.body.user_id || req.body.user_id == '' || req.body.type == '' || !req.body.type || !req.body.reason || req.body.reason == ''){ 
    //     return  res.status(406).json({status:0,message:"please give proper parameter"})
    // }
const data = JSON.parse(req.body.data)
            var reason = data.reason?.length>0 ?   data.reason?.map(async(e)=>{
              
              if(e.__isNew__){
               
                  const inserting =  new ban_reasons({
                      reason:e.label
                    })
                    var inserted = await inserting.save()
                    return(inserted._id)
                }
                return(e.value)
            }):[]
            reason = await Promise.all(reason)
// var reasons = await ban_reasons.find({reason:{$in:req.body.reason.split(",")}},{_id:1})
// reasons = reasons.map((e)=> {return e.id})
         await Users.findOneAndUpdate({_id:req.body.user_id},{deActivated:true})
if( parseInt(data.type.value) == 1 ){

    var ban_user = new banned_user({
        user_id:req.body.user_id,
        type: data.type.value ,
        reason: reason
    })
}else{
    var ban_user = new banned_user({
        user_id:req.body.user_id,
        type: req.body.type ,
        reason: reason,
        unban_after: momnet().add(parseInt(req.body.unban_after),"day")
        })
}
    await ban_user.save()
    res.status(201).json({status:1,message:"User Banned Successfully"})
}

exports.showReasons = async(req,res)=>{
    const reason = await ban_reasons.find()
    console.log(reason)
    if(reason.length>0){
        res.status(201).json({status:1,message:"Ban Reason Found Successfully",result:reason})
    }else{
        res.status(402).json({status:0,message:"Ban Reason not found",})
    }
}
exports.showBanUsers = async (req,res)=>{
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
exports.unBanUser = async(req,res) =>{
    if(!req.body.user_id || req.body.user_id == ''){ 
        return  res.status(406).json({status:0,message:"please give proper parameter"})
    }
    await banned_user.deleteOne({user_id:req.body.user_id})
    await Users.findOneAndUpdate({_id:req.body.user_id},{deAtivated:false})
    res.status(201).json({status:1,message:"User Unban Successfully"})
}


