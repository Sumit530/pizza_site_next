const banned_user = require("../model/banned_user")
const ban_reasons = require("../model/ban_reasons")
const password_policies = require("../model/password_policies")
const momnet = require("moment")
const Users = require("../model/users")
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
    if(!req.body.user_id || req.body.user_id == '' || req.body.type == '' || !req.body.type || !req.body.reason || req.body.reason == '' || !req.body.admin_id || req.body.admin_id == ''){ 
        return  res.status(406).json({status:0,message:"please give proper parameter"})
    }

    var reasons = await ban_reasons.find({reason:{$in:req.body.reason.split(",")}},{_id:1})
    reasons = reasons.map((e)=> {return e.id})
        await Users.findOneAndUpdate({_id:req.body.user_id},{deAtivated:true})
if( parseInt(req.body.type) == 1 ){

    var ban_user = new banned_user({
        user_id:req.body.user_id,
        type: req.body.type ,
        reason: reasons
    })
}else{
    var ban_user = new banned_user({
        user_id:req.body.user_id,
        type: req.body.type ,
        reason: reasons,
        unban_after: momnet().add(parseInt(req.body.unban_after),"day")
        })
}
    await ban_user.save()
    res.status(201).json({status:1,message:"User Banned Successfully"})
}

exports.showReasons = async(req,res)=>{
    const reason = await ban_reasons.find()
    if(reason.length>0){
        res.status(201).json({status:1,message:"Ban Reason Found Successfully",result:reason})
    }else{
        res.status(402).json({status:0,message:"Ban Reason not found",})
    }
}
exports.showBanUsers = async (req,res)=>{
    const ban_user = await banned_user.find().populate("user_id","-password")
    const user_data =   ban_user.map((e)=>{
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
    if(user_data.length>0){
        res.status(201).json({status:1,message:"Ban Users Found Successfully",result:user_data})
    }else{
        res.status(402).json({status:0,message:"Ban Users not found",})
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


