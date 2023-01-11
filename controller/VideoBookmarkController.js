const video_bookmarks = require("../model/video_bookmarks")
const VideoWatchHistory = require("../model/video_watch_histories")
const VideoLikes = require("../model/video_likes")
const VideoComments = require("../model/videos_comments")
const Videos = require("../model/Videos")
const User = require("../model/User")

exports.add_video_bookmark =async(req,res)=>{
    try {
        if(req?.body?.user_id){
            return  res.status(406).json({status:0,message:"please give proper parameter"})
        }
        if(req?.body?.video_id){
            return  res.status(406).json({status:0,message:"please give proper parameter"})
        }
        const user = await User.find({_id:req?.body?.user_id})
        if(user.length > 0){
            const videoBookMark = await video_bookmarks.find({user_id:req?.body?.user_id,video_id:req?.body?.video_id})
            if(videoBookMark.length == 0){
                const videobokmarkData = new video_bookmarks({
                    user_id:req?.body?.user_id,
                    video_id:req?.body?.video_id
                })
                await videobokmarkData.save()
                return  res.status(201).json({status:1,message:"Video bookmark add successfully"})
                
            }else{
                return  res.status(406).json({status:0,message:"This video already added bookmark"})  
            }
        }else{
            return  res.status(406).json({status:0,message:"user not found"})  

        }
    } catch (error) {
        res.status(502).json({status:0,message:"internal server error"})
        console.log("server error on add video bookmark");  
    }
}

exports.remove_video_bookmark = async(req,res)=>{
    try {
        if(req?.body?.user_id){
            return  res.status(406).json({status:0,message:"please give proper parameter"})
        }
        if(req?.body?.video_id){
            return  res.status(406).json({status:0,message:"please give proper parameter"})
        }
        
            const videoBookMark = await video_bookmarks.find({user_id:req?.body?.user_id,video_id:req?.body?.video_id})
            if(videoBookMark.length > 0){
              
                const videoBookMark = await video_bookmarks.deleteOne({user_id:req?.body?.user_id,video_id:req?.body?.video_id})
                return  res.status(201).json({status:1,message:"Video bookmark deleted successfully"})
                
            }else{
                return  res.status(406).json({status:0,message:" bookmark video not found"})  
            }
    } catch (error) {
        res.status(502).json({status:0,message:"internal server error"})
        console.log("server error on add video bookmark");  
    }
}