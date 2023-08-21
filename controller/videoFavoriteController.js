const video_favorites = require("../model/video_favorites")
const User = require("../model/users")
const fs = require("fs")

exports.add_video_favorite =async(req,res)=>{
    try {
        if(!req?.body?.user_id || req?.body?.user_id == ''){
            return  res.status(406).json({status:0,message:"please give proper parameter"})
        }
        if(!req?.body?.video_id || req?.body?.video_id == ''){
            return  res.status(406).json({status:0,message:"please give proper parameter"})
        }
        const user = await User.find({_id:req?.body?.user_id})
        if(user.length > 0){
            const videoBookMark = await video_favorites.find({user_id:req?.body?.user_id,video_id:req?.body?.video_id})
            if(videoBookMark.length == 0){
                const videobokmarkData = new video_favorites({
                    user_id:req?.body?.user_id,
                    video_id:req?.body?.video_id
                })
                await videobokmarkData.save()
                return  res.status(201).json({status:1,message:"Video Favorite add successfully"})
                
            }else{
                return  res.status(406).json({status:0,message:"This video already added Favorite"})  
            }
        }else{
            return  res.status(406).json({status:0,message:"user not found"})  

        }
    } catch (error) {
        res.status(502).json({status:0,message:"internal server error"})
        console.log("server error on add video bookmark" + error);  
    }
}

exports.remove_video_favorite = async(req,res)=>{
    try {
        if(!req?.body?.user_id || req?.body?.user_id == ''){
            return  res.status(406).json({status:0,message:"please give proper parameter"})
        }
        if(!req?.body?.video_id || req?.body?.video_id == ''){
            return  res.status(406).json({status:0,message:"please give proper parameter"})
        }
        
            const videoBookMark = await video_favorites.find({user_id:req?.body?.user_id,video_id:req?.body?.video_id})
            if(videoBookMark.length > 0){
              
                const videoBookMark = await video_favorites.deleteOne({user_id:req?.body?.user_id,video_id:req?.body?.video_id})
                return  res.status(201).json({status:1,message:"Video bookmark deleted successfully"})
                
            }else{
                return  res.status(406).json({status:0,message:" Favorite video not found"})  
            }
    } catch (error) {
        res.status(502).json({status:0,message:"internal server error"})
        console.log("server error on add video Favorite" + error);  
    }
}

exports.get_video_favorite = async(req,res)=>{
    if(!req?.body?.user_id || req?.body?.user_id == ''){
        return  res.status(406).json({status:0,message:"please give proper parameter"})
    } 

    const videoBookMark = await video_favorites.find({user_id:req?.body?.user_id}).populate("video_id")
    if(videoBookMark.length>0){
        const data = videoBookMark.map((e)=>{

        
        if(e?.video_id?.cover_image != ''){
            const path = process.env.PUBLICCOVERIMAGEEURL
            if(fs.existsSync(`uploads/videos/cover_image/${e.video_id?.cover_image}`)){
                var cover_image    = `${path}/${e.video_id?.cover_image}`
            }
            else {
                var cover_image   = ''
            }
        }else{
            var cover_image   = ''
        }
        if(e?.video_id?.file_name  != ''){
            const path = process.env.PUBLICVIDEOSURL
            if(fs.existsSync(`uploads/videos/videos/${e.video_id.file_name }`)){
                console.log("2")
                var  video_url     = `${path}/${e.video_id.file_name}`
            }
            else {
                var video_url    = ''
            }
        }else{
            var  video_url    = ''
         }
        return(  {
            
            "user_id": e.user_id,
                "video_id": e.video_id._id,
                "song_id": e.video_id.song_id,
                "description": e.video_id.is_view,
                "is_view": e.video_id.is_view,
                "is_allow_comment": e.video_id.is_allow_comment,
                "is_allow_duet": e.video_id.is_allow_duet,
                "is_save_to_device": e.video_id.is_save_to_device,
                "freinds_id": e.video_id.freinds_id,
                "mention_ids": e.video_id.mention_ids,
                "status": e.video_id.status,
                "isDeleted": e.video_id.isDeleted,
                "cover_image": cover_image,
                "video_url": video_url,
                "status": e.video_id.status,
                 "createdAt": e.createdAt,
                 "updatedAt": e.updatedAt,
        })
        })
        return res.status(201).json({ status:1,message:"Data Got successfully",data})
         
    }else{
        return res.status(402).json({status:0,message:"no data found"})
    }
}