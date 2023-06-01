const search_histories = require('../model/search_histories')
const Songs = require("../model/songs")
const Followers = require("../model/followers")
const Videos = require("../model/videos")
const VideoData = require("../model/video_data")
const VideoLikes = require("../model/video_likes")
const VideoComments = require("../model/videos_comments")
const VideoWatchHistory = require("../model/video_watch_histories")
const VideoBookmark = require("../model/video_bookmarks")
const HashtagBookmarks = require("../model/hashtags_bookmarks")
const Hashtag = require("../model/hashtags")
const HashtagData = require("../model/hashtag_data")
const VideoFavorite = require("../model/video_favorites")
const Users = require('../model/users')



exports.add_search_history = async(req,res)=>{
    if(!req?.body?.user_id || req?.body?.user_id == ''){
        return  res.status(406).json({status:0,message:"please give proper parameter"})
    }
    if(!req?.body?.keyword || req?.body?.keyword == ""){
        return  res.status(406).json({status:0,message:"please give proper parameter"})
    }
    const getuser = await search_histories.find({user_id:req?.body?.user_id})
   if(getuser.length > 0){
    const searchdata = await search_histories.find({user_id:req?.body?.user_id,"keyword.key":req?.body?.keyword})
    console.log(searchdata)
    if(searchdata.length==0){

        await  search_histories.findOneAndUpdate({
            user_id:req?.body?.user_id   
        },{$push:{keyword:{key:req.body.keyword}}})


        return  res.status(201).json({status:1,message:"search history added successfully"})
    }
    else{
        return  res.status(406).json({status:0,message:"already has data"})  
    }
    }else{
        const data = new search_histories({
            user_id:req?.body?.user_id ,  
            keyword:[{key:req.body.keyword}]
        })
        await data.save()
        return  res.status(201).json({status:1,message:"search history added successfully"})
    }
}

exports.get_search_history = async(req,res)=>{
    if(!req?.body?.user_id || req?.body?.user_id == ''){
        return  res.status(406).json({status:0,message:"please give proper parameter"})
    }
    const getuser = await search_histories.find({user_id:req?.body?.user_id})
   if(getuser.length > 0){
  const t =   getuser[0].keyword.map((e,i)=>{

         e.keyword_id = e._id
        delete e._id
        return e
    }) 
console.log(t)
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
    if(!req?.body?.keyword ||  req?.body?.keyword == ""){
        return  res.status(406).json({status:0,message:"please give proper parameter"})
    }
    const users = await Users.find({"$expr": {
        "$regexMatch": {
          "input": { "$concat": ["$name", " ", "$username"] },
          "regex": req.body.keyword,  //Your text search here
          "options": "i"
        }
      }})
      var arr = []
    // const getFollwerById = async(id,count,arr,list) => { 
    //     if(list.find((e)=>{e==id})){
    //         console.log("hey")
    //         return "hey"
    //     }else{

    //         list.push(id)
    //     }
    //     if(count == 5){
    //         return
    //     }
        
    //     const follower = await Followers.find({follower_id:id}).populate("user_id")
    //     console.log(follower.length)
    //     if(follower.length>0){

    //         follower.map((e)=>{
    //             if(e.user_id.username.includes(req.body.keyword)){
    //                 arr.push(e)
    //                 //  console.log(e)
    //             }
    //             return getFollwerById(e.user_id._id,count+1,arr,list)
    //         })
    //     }else{
    //         return arr
    //     }
    // }
    //   const s = await getFollwerById(req.body.user_id,1,[],[])
    // console.log(s)
    const Video = await HashtagData.find({"$expr": {
        "$regexMatch": {
          "input": { "$concat": ["$video_id.description", " ", "$hashtag_id.name"] },
          "regex": req.body.keyword,  //Your text search here
          "options": "i"
        }
    }}).populate("hashtag_id").populate("video_id")
    console.log(Video)       
   } catch (error) {
    
   }
}