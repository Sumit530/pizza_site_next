const Videos = require("../model/Videos")
const User = require("../model/User")
const VideoCommentsLikes = require("../model/video_comment_likes")
const VideoData = require("../model/video_data")


exports.add_comment_like = async(req,res) =>{
    if(req?.body?.user_id){
        return  res.status(406).json({status:0,message:"please give proper parameter"})
    }
    if(req?.body?.video_id){
        return  res.status(406).json({status:0,message:"please give proper parameter"})
    }
    if(req?.body?.comment_id){
        return  res.status(406).json({status:0,message:"please give proper parameter"})
    }

    user_data = await User.find({_id:req?.body?.user_id})
    if(user_data.length>0){
        const likedata = await VideoCommentsLikes.find({user_id:req?.body?.user_id,video_id:req?.body?.video_id,comment_id:req?.body?.comment_id})
        if(likedata.length>0){
            return  res.status(406).json({status:0,message:"This comment already likeed"})
        }
        else{
            const video = Videos.find({_id:req?.body?.video_id})
            if(video.length>0){

                const data = new VideoCommentsLikes({
                    user_id:req?.body?.user_id,
                    video_id:req?.body?.video_id,
                    comment_id:req?.body?.comment_id
                })
                await data.save()
                return  res.status(201).json({status:1,message:"Video comment liked successfully"})
            }else{
                return  res.status(406).json({status:0,message:"video not found"})
            }
        }
    }else{
        return  res.status(406).json({status:0,message:"user not found"})
    }
}


exports.remove_comment_like = async(req,res) =>{
    if(req?.body?.user_id){
        return  res.status(406).json({status:0,message:"please give proper parameter"})
    }
    if(req?.body?.video_id){
        return  res.status(406).json({status:0,message:"please give proper parameter"})
    }
    if(req?.body?.comment_id){
        return  res.status(406).json({status:0,message:"please give proper parameter"})
    }

    user_data = await User.find({_id:req?.body?.user_id})
    if(user_data.length>0){
        const likedata = await VideoCommentsLikes.find({user_id:req?.body?.user_id,video_id:req?.body?.video_id,comment_id:req?.body?.comment_id})
        if(likedata.length>0){
            await VideoCommentsLikes.deleteOne({user_id:req?.body?.user_id,video_id:req?.body?.video_id,comment_id:req?.body?.comment_id})
            return  res.status(201).json({status:1,message:"Video comment like removed successfully"})
        }
        else{
            
            return  res.status(406).json({status:0,message:"comment like not found"})
         }
}else{
    return  res.status(406).json({status:0,message:"user not found"})
}
}
