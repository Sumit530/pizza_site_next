const User = require("../model/users")
const BlockUser = require("../model/block_user")


exports.add_block_user = async(req,res) => {
    if(!req?.body?.user_id || req?.body?.user_id == ''){
        return  res.status(406).json({status:0,message:"please give proper parameter"})
    }
    if(!req?.body?.block_user_id || req?.body?.block_user_id == ''){
        return  res.status(406).json({status:0,message:"please give proper parameter"})
    }
    const user_data = await User.find({_id:req?.body?.user_id})
    if(user_data.length > 0){
        const block_user_data = await User.find({_id:req?.body?.block_user_id})
        if(block_user_data.length > 0){
            const check_block = await BlockUser.find({user_id:req?.body?.user_id,block_user_id:req?.body?.block_user_id })
            if(check_block.length > 0){
                res.status(409).json({status:0,message:"already blocked"})
            }else{
                const block_data = new BlockUser({
                    user_id:req.body?.user_id,
                    block_user_id:req?.body?.block_user_id
                })
                await block_data.save()
                res.status(201).json({status:1,message:"user blocked successfully"})
            }
        }else{
            res.status(409).json({status:0,message:"user not found"})
        }
    }else{
        res.status(409).json({status:0,message:"user not found"})
    }
}

exports.remove_block_user = async(req,res) =>{
    if(!req?.body?.user_id || req?.body?.user_id == ''){
        return  res.status(406).json({status:0,message:"please give proper parameter"})
    }
    if(!req?.body?.block_user_id || req?.body?.block_user_id == ''){
        return  res.status(406).json({status:0,message:"please give proper parameter"})
    }
    const check_block = await BlockUser.find({user_id:req?.body?.user_id,block_user_id:req?.body?.block_user_id })
    if(check_block.length > 0){
        await BlockUser.deleteOne({user_id:req?.body?.block_user_id,block_user_id:req?.body?.block_user_id })
        res.status(201).json({status:1,message:"user unblocked successfully"})
    }else{
        res.status(409).json({status:0,message:"user not blocked"})
        
    }
    
}

exports.get_block_user_list = async(req,res) =>{
    if(!req?.body?.user_id || req?.body?.user_id == ''){
        return  res.status(406).json({status:0,message:"please give proper parameter"})
    }
    const check_block = await BlockUser.find({user_id:req?.body?.user_id}).populate("block_user_id")
    if(check_block.length > 0){
      var  data = check_block.map((e)=>{
        if(e.block_user_id.profile_image != ''){
            const path = process.env.PUBLICPOROFILEIMAGEURL
            if(fs.existsSync(`uploads/user/profile/${e.block_user_id.profile_image}`)){
                var  profile_image = `${path}/${e.block_user_id.profile_image}`
            }else{
                
                var profile_image = ''
            }
        }else{
            var profile_image = ''
        }
        return({
            id:e._id,
            user_id:e.block_user_id._id,
            name:e.block_user_id.name,
            username:e.block_user_id.username,
            profile:profile_image
        })
    })
        res.status(201).json({status:1,message:"user unblocked successfully",data:data})
    }else{
        res.status(409).json({status:0,message:"user not blocked"})
        
    }
    
}
