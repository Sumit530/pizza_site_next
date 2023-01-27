const recent_emojis = require("../model/recent_emojis")

exports.get_recent_emoji = async(req,res) =>{
    if(!req.body.user_id || req.body.user_id == '' ){ 
        return  res.status(406).json({status:0,message:"please give proper parameter"})
    }
    
    const recentemooji = await recent_emojis.find({user_id:req.body.user_id},{emoji:1})
     if(recentemooji.length > 0){
        return res.status(201).json({status:1,message:"recent emoji found ",data:recentemooji})    

     }
     else{
        return res.status(402).json({status:0,message:"no data found"})
     }
    

}
exports.add_recent_emoji = async(req,res) =>{
    if(!req.body.user_id || req.body.user_id == '' ||  !req.body.emoji || req.body.emoji == '' ){ 
        return  res.status(406).json({status:0,message:"please give proper parameter"})
    }
    const recentemoojidata = new recent_emojis({
        user_id : req.body.user_id,
        emoji : req.body.emoji

    })
    await recentemoojidata.save()
    return res.status(201).json({status:1,message:"recent emoji add successfully",})    

}