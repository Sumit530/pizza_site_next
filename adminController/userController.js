const User = require("../model/users")
exports.GetAllUser = async(req,res) =>{
    const users = await User.find({},{password:0})
    if(users.length>0){
        return res.status(201).json({status:1,message:"User Data found!",result:users})
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

