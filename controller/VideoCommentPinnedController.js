const Videos = require("../model/Videos")
const User = require("../model/User")
const VideoComments = require("../model/videos_comments")
const videoCommentPinneds = require("../model/video_comment_pinneds")
const VideoData = require("../model/video_data")

exports.add_comment_pinned = async(req,res)=>{
    try {
        if(req?.body?.user_id){
            return  res.status(406).json({status:0,message:"please give proper parameter"})
        }
        if(req?.body?.comment_id){
            return  res.status(406).json({status:0,message:"please give proper parameter"})
        }
        const user_data = await User.find({_id:req?.body?.user_id})
        if(user_data.length > 0){
            const pinned_data = await videoCommentPinneds.find({user_id:req?.body?.user_id,comment_id:req?.body?.comment_id})
            if(pinned_data.length > 0){
                return  res.status(406).json({status:0,message:"this comment already pinned"})
            }else{
                const video_comment_data = await VideoComments.find({_id:req?.body?.comment_id})
                if(video_comment_data.length > 0){
                    const videocommentpinned = new videoCommentPinneds({
                        user_id:req?.body?.user_id,
                        comment_id : req?.body?.comment_id
                    })
                    await videocommentpinned.save()
                    return  res.status(201).json({status:1,message:"Video comment pinned successfully"})
                }else{
                    return  res.status(406).json({status:0,message:"comment not found"})
                }
            }
        }else{
            return  res.status(406).json({status:0,message:"user not found "})
        }
    } catch (error) {
        res.status(502).json({status:0,message:"internal server error"})
    console.log("server error on add comment pinned");
    }
}

exports.remove_comment_pinned = async(req,res)=>{
   try {
    if(req?.body?.user_id){
        return  res.status(406).json({status:0,message:"please give proper parameter"})
    }
    if(req?.body?.comment_id){
        return  res.status(406).json({status:0,message:"please give proper parameter"})
    }
    const user_data = await User.find({_id:req?.body?.user_id})
    if(user_data.length > 0){
        const pinned_data = await videoCommentPinneds.find({user_id:req?.body?.user_id,comment_id:req?.body?.comment_id})
        if(pinned_data.length > 0){
             await videoCommentPinneds.deleteOne({user_id:req?.body?.user_id,comment_id:req?.body?.comment_id})
             return  res.status(201).json({status:1,message:"Video comment unpinned successfully"})
        }else{
            return  res.status(406).json({status:0,message:"not pinned comment "})
           
        }
    }else{
        return  res.status(406).json({status:0,message:"user not found "})
    }
   } catch (error) {
    res.status(502).json({status:0,message:"internal server error"})
    console.log("server error on remove comment pinned");
   }
}

