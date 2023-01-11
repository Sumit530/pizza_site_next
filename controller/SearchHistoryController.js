const search_histories = require('../model/search_histories')
const Songs = require("../model/songs")
const Followers = require("../model/Followers")
const Videos = require("../model/Videos")
const VideoData = require("../model/video_data")
const VideoLikes = require("../model/video_likes")
const VideoComments = require("../model/videos_comments")
const VideoWatchHistory = require("../model/video_watch_histories")
const VideoBookmark = require("../model/video_bookmarks")
const HashtagBookmarks = require("../model/hashtags_bookmarks")
const Hashtag = require("../model/hashtags")
const HashtagData = require("../model/hashtag_data")
const VideoFavorite = require("../model/video_favorites")



exports.add_search_history = async(req,res)=>{
    if(req?.body?.user_id){
        return  res.status(406).json({status:0,message:"please give proper parameter"})
    }
    if(req?.body?.keyword){
        return  res.status(406).json({status:0,message:"please give proper parameter"})
    }
    const getuser = await search_histories.find({user_id:req?.body?.user_id})
   if(getuser.length > 0){
    const searchdata = await search_histories.find({user_id:req?.body?.user_id,keyword:{$text:{$search:req?.body?.user_id}}})
    if(searchdata.length==0){

        await  search_histories.findOneAndUpdate({
            user_id:req?.body?.user_id   
        },{keyword:{$push:req.body.keyword}})
        return  res.status(201).json({status:1,message:"search history added successfully"})
    }
    else{
        return  res.status(406).json({status:0,message:"already has data"})  
    }
    }else{
        const data = new search_histories({
            user_id:req?.body?.user_id ,  
            keyword:[req.body.keyword]
        })
        await data.save()
        return  res.status(201).json({status:1,message:"search history added successfully"})
    }
}

exports.get_search_history = async(req,res)=>{
    if(req?.body?.user_id){
        return  res.status(406).json({status:0,message:"please give proper parameter"})
    }
    const getuser = await search_histories.find({user_id:req?.body?.user_id})
   if(getuser.length > 0){
    

        return  res.status(201).json({status:1,message:"search history added successfully",data:getuser[0]})
    
   }else{
        return  res.status(406).json({status:0,message:"not found user"})  
    }
    
}
exports.delete_search_history = async(req,res)=>{
    if(req?.body?.user_id){
        return  res.status(406).json({status:0,message:"please give proper parameter"})
    }
    if(req?.body?.keyword){
        return  res.status(406).json({status:0,message:"please give proper parameter"})
    }
    if(req?.body?.type){
        return  res.status(406).json({status:0,message:"please give proper parameter"})
    }
    if(req?.body?.type == 1){

        const getuser = await search_histories.deleteOne({user_id:req?.body?.user_id})
        return  res.status(201).json({status:1,message:"search history deleted successfully"})
    }else{
        const getuser = await search_histories.findOneAndUpdate({user_id:req?.body?.user_id,},{$pull:{keywords:req.body.keyword}})
        return  res.status(201).json({status:1,message:"search history deleted successfully"})
    }
    
    
}

exports.search_top_list = async(req,res)=>{
  
   try {
    if(req?.body?.keyword){
        return  res.status(406).json({status:0,message:"please give proper parameter"})
    }
    const keyword = req?.body?.keyword
    var hashtags_result = []
    var video_result  = []
    var user_result = []
    var song_result  = []
    const search_hashtags_data  = await Hashtag.find({name:`/${keyword}/i`})
    if(search_hashtags_data.length>0){
        search_hashtags_data?.map(async(e)=>{
            const total_videos = await HashtagData.find({hashtag_id:e._id})
            hashtags_result.push({
                id:e._id,
                hashtag:e.name,
                total_videos:total_videos
            })
        })
    }else{
        hashtags_result = []
    }
    const search_by_video_data   = await Videos.find({description:`/${keyword}/i`})
    if(search_hashtags_data.length>0){
        search_hashtags_data?.map(async(e)=>{
            const totalviews = await VideoWatchHistory.find({video_id:e._id})
            if(e.cover_image != ''){
                
                const path = process.env.PUBLICCOVERIMAGEEURL
                if(fs.existsSync(`${path}/${e.profile_image}`)){
                    var cover_image  = `${path}/${e.profile_image}`
                }
                else {
                    var cover_image  = ''
                }
            }else{
                var cover_image  = ''
            }
            if(e.file_name  != ''){
                
                const path = process.env.PUBLICVIDEOSURL
                if(fs.existsSync(`${path}/${e.file_name }`)){
                    var video_url   = `${path}/${e.file_name }`
                }
                else {
                    var video_url   = ''
                }
            }else{
                var video_url   = ''
            }
            video_result.push({
                id:e._id,
                cover_image:cover_image,
                video_url:video_url,
                description:e.description
            })
            
        })
    }else{
        video_result = []
    }
   } catch (error) {
    
   }
}