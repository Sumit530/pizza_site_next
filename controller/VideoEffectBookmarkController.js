const VideoEffectBookmark = require("../model/video_effects_bookmark") 

const fs = require("fs")

exports.add_effect_bookmark = async(req,res)=>{
    if(!req.body.user_id || req.body.user_id == '' ){ 
        return  res.status(406).json({status:0,message:"please give proper parameter"})
    } 
    if(!req.body.effect_id || req.body.effect_id == '' ){ 
        return  res.status(406).json({status:0,message:"please give proper parameter"})
    }

    const checkEffectBookmark = await VideoEffectBookmark.find({user_id:req?.body?.user_id,effect_id:req?.body?.effect_id})
    if(checkEffectBookmark.length > 0){
        return res.status(402).json({status:0,message:"This effect already bookmarked"})
    }else{
        const EffectBookmark = new VideoEffectBookmark({
            user_id:req?.body?.user_id,
            effect_id:req?.body?.effect_id 
        })
        await EffectBookmark.save()
        return res.status(201).json({status:1,message:"effect bookmark added successfully!."})    
    }
    
}
exports.remove_effect_bookmark = async(req,res)=>{
    if(!req.body.user_id || req.body.user_id == '' ){ 
        return  res.status(406).json({status:0,message:"please give proper parameter"})
    } 
    if(!req.body.effect_id || req.body.effect_id == '' ){ 
        return  res.status(406).json({status:0,message:"please give proper parameter"})
    }

    const checkEffectBookmark = await VideoEffectBookmark.find({user_id:req?.body?.user_id,effect_id:req?.body?.effect_id})
    if(checkEffectBookmark.length > 0){
        await VideoEffectBookmark.deleteOne({user_id:req?.body?.user_id,effect_id:req?.body?.effect_id})
        return res.status(201).json({status:1,message:"effect bookmark added successfully!."})    
    }else{
        return res.status(402).json({status:0,message:"This effect not bookmarked"})
    }
    
}

exports.get_effect_bookmarks = async(req,res) =>{
    if(!req.body.user_id || req.body.user_id == '' ){ 
        return  res.status(406).json({status:0,message:"please give proper parameter"})
    } 

    const EffectBookmarkData = await VideoEffectBookmark.find({user_id:req?.body?.user_id}).populate("effect_id")
    if(EffectBookmarkData.length>0){
        var data = EffectBookmarkData?.map((e)=>{
            console.log(e)
            if(e.effect_id.attachment != ''){
                const path = process.env.PUBLICEFFECTSURL
                if(fs.existsSync(`uploads/effects/${e.effect_id.attachment}`)){
                   var cover_image    = `${path}/${e.effect_id.attachment}`
                }
                else {
                   var cover_image   = ''
                }
            }else{
               var cover_image   = ''
            }
            return({
                id:e._id,
                effect_id : e.effect_id._id,
                name:e.effect_id.name,
                attachment:cover_image
            })
        })
        return  res.status(201).json({data:data , status:1,message:" bookmarked effects found !"})
    }else{
      return res.status(402).json({status:0,message:"effect bookmarked not found"})  
    }
}