const Users = require("../model/users")
const videos = require("../model/videos")
const videoData = require("../model/video_data")
const Followers = require("../model/followers")
const VideoComments = require("../model/videos_comments")
const VideoCommentLikes = require("../model/video_comment_likes")
const VideoCommentPinneds = require("../model/video_comment_pinneds")
const VideoLikes = require("../model/video_likes")
const VideoReport = require("../model/video_reports")
const VideoDuets= require("../model/video_duets")
const VideoBookmark = require("../model/video_bookmarks")
const VideoFavorites = require("../model/video_favorites")
const videoNotInterested = require("../model/video_not_intersted")
const videoWatchHistories = require("../model/video_watch_histories")
const VideoReportData = require("../model/video_reports_data")
const Notification = require("../model/notifications")
const Hashtag = require("../model/hashtag_data")
const fs = require('fs')
const notifications = require("../model/notifications")
const moment = require("moment")
const push_message = require("../push-message/notification")
require("dotenv").config()


exports.upload_video = async(req,res)=>{
    if( req?.body?.user_id == '' || !req?.body?.user_id ){ 
        return  res.status(406).json({status:0,message:"please give a proper parameter"})
    }
    if( req?.body?.is_view == '' || !req?.body?.is_view ){ 
        return  res.status(406).json({status:0,message:"please give a proper parameter"})
    }
    if( req?.body?.is_allow_comments == '' || !req?.body?.is_allow_comments ){ 
        return  res.status(406).json({status:0,message:"please give a proper parameter"})
    }
    if( req?.body?.is_allow_duet == '' || !req?.body?.is_allow_duet ){ 
        return  res.status(406).json({status:0,message:"please give a proper parameter"})
    }
    if( req?.files?.cover_image == '' || !req?.files?.cover_image ){ 
        return  res.status(406).json({status:0,message:"please give a proper parameter"})
    }
    if( req?.files?.video_file == '' || !req?.files?.video_file ){ 
        return  res.status(406).json({status:0,message:"please give a proper parameter"})
    }
    const user_id = req?.body?.user_id
    const song_id = req?.body?.song_id
    const description = req?.body?.description
    const is_view = req?.body?.is_view
    const is_allow_comments = req?.body?.is_allow_comments
    const is_allow_duet = req?.body?.is_allow_duet
    const is_save_to_device = req?.body?.is_save_to_device
    const friends_id = req?.body?.friends_id
    const mention_ids = req?.body?.mention_ids
if(req?.files?.video_file ){

    const video_data = new videos({
        user_id,
        song_id : song_id ? song_id : '',
        description : description ? description : '',
        is_view,
        is_save_to_device : is_save_to_device   ? is_save_to_device  : '',
        friends_id : friends_id ? friends_id : '',
        cover_image : req?.files?.cover_image[0].filename,
        file_name : req?.files?.video_file[0].filename
    })
    const video = await video_data.save()
    console.log(video)
    var video_id = video._id
    console.log(req?.body?.mention_ids)
    if(req?.body?.mention_ids && req?.body?.mention_ids != ''){
        const mention_user_id = req?.body?.mention_ids.split(",") 
        const user_data = await Users.find({_id:user_id}).select("name")
        mention_user_id?.map(async(e)=>{
            const mention_data  = await Users.find({_id:user_id}).select("fcm_id")
            if(mention_data.length > 0){
                const notification_id = Math.floor(1000 + Math.random() * 9000)
                const find_reciever_id   = mention_user_id[0].fcm_id
                const title = `${user_data[0].name} mention you to video`
                const message = `${user_data[0].name} mention you to video ${moment().format('DD-MM-YYYY HH:mm A')}`
                if(find_reciever_id != ''){
                    let img = ''
                    push_message.sendPushNotification(find_reciever_id,title,message,message,notification_id,1,e,img,1,1)
                    const notification_data = new Notification({
                        user_id:user_id,
                        receiver_id : e,
                        video_id:video_id,
                        comment:title,
                        type:4
                    })
                    await notification_data.save()
                    
                }
            }
        })
    }
    if(req?.body?.hashtag_ids && req?.body?.hashtag_ids != ''){
        const hashtag_ids =  req?.body?.hashtag_ids.split(",")
        hashtag_ids?.map(async(e)=>{
            const hashtag_data = new Hashtag({
                video_id:video_id,
                hashtag_id:e
            })
            await hashtag_data.save() 
        })
    }
    return res.status(201).json({status:1,message:"video uploaded successfully"})
}else{
    return res.status(402).json({status:0,message:"please upload a video file"})
}
}
exports.video_list = async(req,res) =>{

    // type - 1 = following 2=for you 
    if( req?.body?.type == '' || !req?.body?.type ){ 
        return  res.status(406).json({status:0,message:"please give a proper parameter"})
    }
    global.data = new Array()  

    if(req?.body?.type == 1){
        if(req?.body?.user_id != ''){
            var total_likes  = 0
            var total_comments = 0
           
            const follower_data =  await Followers.find({user_id:req?.body?.user_id})
            if(follower_data.length > 0){
                follower_data?.map(async(e)=>{
                    const video_data = await videos.find({user_id:e.follower_id,is_view:1,is_save_to_device:0}).populate("song_id").populate("user_id")
                    if(video_data.length> 0){
                        var s = []
                        const promisedata = video_data?.map(async(f)=>{
                            const video_interest = await videos.count({user_id:req?.body?.user_id,video_id:f._id})
                            if(video_interest == 0 || video_interest == '0' ){
                                if(Object.keys(f.user_id).length > 0){

                                    if(f.user_id.profile_image != ''){
                                        const path = process.env.PUBLICPOROFILEIMAGEURL
                                        if(fs.existsSync(`uploads/user/profile/${f.user_id.profile_image}`)){
                                            var  profile_image = `${path}/${f.user_id.profile_image}`
                                        }else{
                                            
                                            var profile_image = ''
                                        }
                                    }else{
                                        var profile_image = ''
                                    }
                                    var user_name = f.user_id.name
                                    var user_username = f.user_id.username
                    
                                }else{
                                    var user_name = ''
                                    var user_username = ''
                                    var profile_image = ''
                                }
                                total_likes += await VideoLikes.count({video_id:f._id})
                                var total_this_likes = await VideoLikes.count({video_id:f._id})
                                total_comments += await VideoComments.count({video_id:f._id})
                                var total_this_comments = await VideoComments.count({video_id:f._id})
                                var total_views = await videoWatchHistories.count({videp_id:f._id})

                                    if(f.cover_image != ''){
                                        const path = process.env.PUBLICCOVERIMAGEEURL
                                        if(fs.existsSync(`${path}/${f.cover_image}`)){
                                            var cover_image    = `${path}/${f.cover_image}`
                                        }
                                        else {
                                            var cover_image   = ''
                                        }
                                    }else{
                                        var cover_image   = ''
                                    }
                                    if(f.file_name  != ''){
                                        const path = process.env.PUBLICVIDEOSURL
                                        if(fs.existsSync(`${path}/${e.file_name }`)){
                                            var  video_url     = `${path}/${f.file_name}`
                                        }
                                        else {
                                            var video_url    = ''
                                        }
                                    }else{
                                        var  video_url    = ''
                                     } 
                                     var video_id = video_details[0]._id
                                     var user_like_data = await VideoLikes.find({user_id:req?.body?.user_id,video_id:e._id})
                                     if(user_like_data.length > 0){
                                        var is_video_like = 1
                                     }else{
                                            var is_video_like = 0
                                     }
                                      var is_follow_data  = await Followers.find({user_id:req?.body?.user_id,video_id:e.user_id})
                                     if(is_follow_data.length > 0){
                                        var is_follow  = 1
                                     }else{
                                            var is_follow  = 0
                                     }
                                      var video_bookmark_data  = await VideoBookmark.find({user_id:req?.body?.user_id,video_id:e._id})
                                     if(video_bookmark_data .length > 0){
                                        var is_bookmark  = 1
                                     }else{
                                            var is_bookmark  = 0
                                     }
                                      var video_favorites_data  = await VideoFavorites.find({user_id:req?.body?.user_id,video_id:e._id})
                                     if(video_favorites_data .length > 0){
                                        var is_favorite  = 1
                                     }else{
                                            var is_favorite  = 0
                                     }
                                   global.data.push({
                                        video_id : e._id,
                                        user_id:req?.body?.user_id,
                                        name:user_name,
                                        username:user_username,
                                        profile_image:profile_image,
                                        song_name : e?.song_id?.name ? e?.song_id?.name : '',
                                        description:e.description,
                                        is_follow:is_follow,
                                        is_video_like:is_video_like,
                                        is_bookmark:is_bookmark,
                                        is_favorite:is_favorite,
                                        total_likes:total_this_likes,
                                        total_comments:total_this_comments,
                                        total_views:parseInt(total_views),
                                        is_allow_comment:e.is_allow_comment,
                                        is_allow_duet:e.is_allow_duet,
                                        cover_image:cover_image,
                                        video_url:video_url

                                     })
                                     
                            }
                        })
                        Promise.all(promisedata).then((e)=>{

                            return res.status(201).json({data:e, status:1,message:"data got successfully"})
                        })
                        console.log(data)
                    }else{
                        return res.status(402).json({status:0,message:"no data found"})
                    }
                })
            }else{
                return res.status(402).json({status:0,message:"no data found"})
            }
        }else{
            return res.status(402).json({status:0,message:"please provide a user login id"})
        }
    }else if (req?.body?.type == 2 && req?.body?.user_id != '' ){
       
        var total_likes = 0
        var total_comments = 0
        const unshuffle_video_data = await videos.find({is_view:1,is_save_to_device:0})
        if(unshuffle_video_data.length > 0){

            var video_data =  unshuffle_video_data
            .map(value => ({ value, sort: Math.random() }))
            .sort((a, b) => a.sort - b.sort)
            .map(({ value }) => value)
                 const promisedata =  video_data?.map(async(f)=>{
                     const video_interest = await videos.count({user_id:req?.body?.user_id,video_id:f._id})
                           
                            if(video_interest == 0 || video_interest == '0' ){
                                const user_data = await Users.find({_id:f.user_id})
                                if(user_data.length > 0){

                                    if(user_data[0].profile_image != ''){
                                        const path = process.env.PUBLICPOROFILEIMAGEURL
                                        if(fs.existsSync(`uploads/user/profile/${user_data[0].profile_image}`)){
                                            var  profile_image = `${path}/${user_data[0].profile_image}`
                                        }else{
                                            
                                            var profile_image = ''
                                        }
                                    }else{
                                        var profile_image = ''
                                    }
                                    var user_name = user_data[0].name
                                    var user_username = user_data[0].username
                    
                                }else{
                                    var user_name = ''
                                    var user_username = ''
                                    var profile_image = ''
                                }
                                total_likes += await VideoLikes.count({video_id:f._id})
                                var total_this_likes = await VideoLikes.count({video_id:f._id})
                                total_comments += await VideoComments.count({video_id:f._id})
                                var total_this_comments = await VideoComments.count({video_id:f._id})
                                var total_views = await videoWatchHistories.count({videp_id:f._id})

                                    if(f.cover_image != ''){
                                        const path = process.env.PUBLICCOVERIMAGEEURL
                                        if(fs.existsSync(`${path}/${f.cover_image}`)){
                                            var cover_image    = `${path}/${f.cover_image}`
                                        }
                                        else {
                                            var cover_image   = ''
                                        }
                                    }else{
                                        var cover_image   = ''
                                    }
                                    if(f.file_name  != ''){
                                        console.log(f.file_name)
                                        const path = process.env.PUBLICVIDEOSURL
                                        if(fs.existsSync(`${path}/${f.file_name }`)){
                                            var  video_url     = `${path}/${f.file_name}`
                                        }
                                        else {
                                            var video_url    = ''
                                        }
                                    }else{
                                        var  video_url    = ''
                                     } 
                                     
                                     var user_like_data = await VideoLikes.find({user_id:req?.body?.user_id,video_id:f._id})
                                     if(user_like_data.length > 0){
                                        var is_video_like = 1
                                     }else{
                                            var is_video_like = 0
                                     }
                                      var is_follow_data  = await Followers.find({user_id:req?.body?.user_id,follower:f.user_id})
                                     if(is_follow_data.length > 0){
                                        var is_follow  = 1
                                     }else{
                                            var is_follow  = 0
                                     }
                                      var video_bookmark_data  = await VideoBookmark.find({user_id:req?.body?.user_id,video_id:f._id})
                                     if(video_bookmark_data .length > 0){
                                        var is_bookmark  = 1
                                     }else{
                                            var is_bookmark  = 0
                                     }
                                      var video_favorites_data  = await VideoFavorites.find({user_id:req?.body?.user_id,video_id:f._id})
                                     if(video_favorites_data .length > 0){
                                        var is_favorite  = 1
                                     }else{
                                            var is_favorite  = 0
                                     }
                                     return ({
                                        video_id : f._id,
                                        user_id:req?.body?.user_id,
                                        name:user_name,
                                        username:user_username,
                                        profile_image:profile_image,
                                        song_name : f?.song_id?.name ? f?.song_id?.name : '',
                                        description:f.description,
                                        is_follow:is_follow,
                                        is_video_like:is_video_like,
                                        is_bookmark:is_bookmark,
                                        is_favorite:is_favorite,
                                        total_likes:total_this_likes,
                                        total_comments:total_this_comments,
                                        total_views:parseInt(total_views),
                                        is_allow_comment:f.is_allow_comment,
                                        is_allow_duet:f.is_allow_duet,
                                        cover_image:cover_image,
                                        video_url:video_url
                                     })
                                     
                                    }
                                }) 
                                Promise.all(promisedata).then((e)=>{
                                    return res.status(201).json({data:e, status:1,message:"data got successfully"})
                                })

                        }else{
                                    return res.status(402).json({status:0,message:"no data found"})
                              }

    }
    else{
       var total_views = 0;
       var total_comments = 0
       var unshuffle_video_data = await videos.find({is_view:1,is_save_to_device:0}).populate('user_id').populate("song_id") 
       if(unshuffle_video_data.length>0){

        var video_data =  unshuffle_video_data
        .map(value => ({ value, sort: Math.random() }))
        .sort((a, b) => a.sort - b.sort)
        .map(({ value }) => value)
      const promisedata =  video_data?.map(async(f)=>{
            const video_interest = await videos.count({user_id:req?.body?.user_id,video_id:f._id})
            if(video_interest == 0 || video_interest == '0' ){
                const user_data = await User.find({_id:f.user_id})
                if(user_data.length > 0){

                    if(user_data[0].profile_image != ''){
                        const path = process.env.PUBLICPOROFILEIMAGEURL
                        if(fs.existsSync(`uploads/user/profile/${user_data[0].profile_image}`)){
                            var  profile_image = `${path}/${user_data[0].profile_image}`
                        }else{
                            
                            var profile_image = ''
                        }
                    }else{
                        var profile_image = ''
                    }
                    var user_name = user_data[0].name
                    var user_username = user_data[0].username
    
                }else{
                    var user_name = ''
                    var user_username = ''
                    var profile_image = ''
                }
                total_likes += await VideoLikes.count({video_id:f._id})
                var total_this_likes = await VideoLikes.count({video_id:f._id})
                var total_this_comments = await VideoComments.count({video_id:f._id})
                total_comments += await VideoComments.count({video_id:f._id})
                var total_views = await videoWatchHistories.count({videp_id:f._id})

                    if(f.cover_image != ''){
                        const path = process.env.PUBLICCOVERIMAGEEURL
                        if(fs.existsSync(`${path}/${f.cover_image}`)){
                            var cover_image    = `${path}/${f.cover_image}`
                        }
                        else {
                            var cover_image   = ''
                        }
                    }else{
                        var cover_image   = ''
                    }
                    if(f.file_name  != ''){
                        const path = process.env.PUBLICVIDEOSURL
                        if(fs.existsSync(`${path}/${e.file_name }`)){
                            var  video_url     = `${path}/${f.file_name}`
                        }
                        else {
                            var video_url    = ''
                        }
                    }else{
                        var  video_url    = ''
                     } 
                     
                     var user_like_data = await VideoLikes.find({user_id:req?.body?.user_id,video_id:e._id})
                     if(user_like_data.length > 0){
                        var is_video_like = 1
                     }else{
                            var is_video_like = 0
                     }
                      var is_follow_data  = await Followers.find({user_id:req?.body?.user_id,follower:e.user_id})
                     if(is_follow_data.length > 0){
                        var is_follow  = 1
                     }else{
                            var is_follow  = 0
                     }
                      var video_bookmark_data  = await VideoBookmark.find({user_id:req?.body?.user_id,video_id:e._id})
                     if(video_bookmark_data .length > 0){
                        var is_bookmark  = 1
                     }else{
                            var is_bookmark  = 0
                     }
                      var video_favorites_data  = await VideoFavorites.find({user_id:req?.body?.user_id,video_id:e._id})
                     if(video_favorites_data .length > 0){
                        var is_favorite  = 1
                     }else{
                            var is_favorite  = 0
                     }
                     data.push({
                        video_id : e._id,
                        user_id:req?.body?.user_id,
                        name:user_name,
                        username:user_username,
                        profile_image:profile_image,
                        song_name : e?.song_id?.name ? e?.song_id?.name : '',
                        description:e.description,
                        is_follow:is_follow,
                        is_video_like:is_video_like,
                        is_bookmark:is_bookmark,
                        is_favorite:is_favorite,
                        total_likes:total_this_likes,
                        total_comments:total_this_comments,
                        total_views:parseInt(total_views),
                        is_allow_comment:e.is_allow_comment,
                        is_allow_duet:e.is_allow_duet,
                        cover_image:cover_image,
                        video_url:video_url
                     })
                     
            }



        })
        Promise.all(promisedata).then((e)=>{

            return res.status(201).json({data:e, status:1,message:"data got successfully"})
        })


       }else{
        return res.status(402).json({status:0,message:"no data found"})
       }
    }
}

exports.video_details = async(req,res) => {
    if( req?.body?.user_id == '' || !req?.body?.user_id ){ 
        return  res.status(406).json({status:0,message:"please give a proper parameter"})
    }
    if( req?.body?.video_id == '' || !req?.body?.video_id ){ 
        return  res.status(406).json({status:0,message:"please give a proper parameter"})
    }
var total_likes = 0
var total_comments = 0
var data = []
    const video_data = await videos.find({_id:req?.body?.video_id,is_view:1,is_save_to_device:0}).populate("song_id").populate("user_id")
    if(video_data.length >0 ){
        if(Object.keys(video_data[0].user_id).length > 0){

            if(video_data[0].user_id.profile_image != ''){
                const path = process.env.PUBLICPOROFILEIMAGEURL
                if(fs.existsSync(`uploads/user/profile/${video_data[0].user_id.profile_image}`)){
                    var  profile_image = `${path}/${video_data[0].user_id.profile_image}`
                }else{
                    
                    var profile_image = ''
                }
            }else{
                var profile_image = ''
            }
            var user_name = video_data[0].user_id.name
            var user_username = video_data[0].user_id.username

        }else{
            var user_name = ''
            var user_username = ''
            var profile_image = ''
        }
        total_likes += await VideoLikes.count({video_id:video_data[0]._id})
        var total_this_likes = await VideoLikes.count({video_id:video_data[0]._id})
        total_comments += await VideoComments.count({video_id:video_data[0]._id})
        var total_this_comments = await VideoComments.count({video_id:video_data[0]._id})
        var total_views = await videoWatchHistories.count({videp_id:video_data[0]._id})
        if(video_data[0].cover_image != ''){
            const path = process.env.PUBLICCOVERIMAGEEURL
            if(fs.existsSync(`${path}/${video_data[0].cover_image}`)){
                var cover_image    = `${path}/${video_data[0].cover_image}`
            }
            else {
                var cover_image   = ''
            }
        }else{
            var cover_image   = ''
        }
        if(video_data[0].file_name  != ''){
            const path = process.env.PUBLICVIDEOSURL
            if(fs.existsSync(`${path}/${video_data[0].file_name }`)){
                var  video_url     = `${path}/${video_data[0].file_name}`
            }
            else {
                var video_url    = ''
            }
        }else{
            var  video_url    = ''
         } 
         
         var user_like_data = await VideoLikes.find({user_id:req?.body?.user_id,video_id:video_data[0]._id})
         if(user_like_data.length > 0){
            var is_video_like = 1
         }else{
                var is_video_like = 0
         }
          var is_follow_data  = await Followers.find({user_id:req?.body?.user_id,follower:video_data[0].user_id._id})
         if(is_follow_data.length > 0){
            var is_follow  = 1
         }else{
                var is_follow  = 0
         }
          var video_bookmark_data  = await VideoBookmark.find({user_id:req?.body?.user_id,video_id:video_data[0]._id})
         if(video_bookmark_data .length > 0){
            var is_bookmark  = 1
         }else{
                var is_bookmark  = 0
         }
          var video_favorites_data  = await VideoFavorites.find({user_id:req?.body?.user_id,video_id:video_data[0]._id})
         if(video_favorites_data .length > 0){
            var is_favorite  = 1
         }else{
                var is_favorite  = 0
         }
         data.push({
            video_id : video_data[0]._id,
            user_id:req?.body?.user_id,
            name:user_name,
            username:user_username,
            profile_image:profile_image,
            song_name : video_data[0]?.song_id?.name ? video_data[0]?.song_id?.name : '',
            description:video_data[0].description,
            is_follow:is_follow,
            is_video_like:is_video_like,
            is_bookmark:is_bookmark,
            is_favorite:is_favorite,
            total_likes:total_this_likes,
            total_comments:total_this_comments,
            total_views:parseInt(total_views),
            is_allow_comment:video_data[0].is_allow_comment,
            is_allow_duet:video_data[0].is_allow_duet,
            cover_image:cover_image,
            video_url:video_url
    })
    return res.status(201).json({data:data, status:1,message:"data got successfully"})
}else{
    return res.status(402).json({status:0,message:"no data found"})
}
}

exports.add_video_like = async(req,res)=>{
    if( req?.body?.user_id == '' || !req?.body?.user_id ){ 
        return  res.status(406).json({status:0,message:"please give a proper parameter"})
    }
    if( req?.body?.video_id == '' || !req?.body?.video_id ){ 
        return  res.status(406).json({status:0,message:"please give a proper parameter"})
    }

    var user_data = await Users.find({_id:req?.body?.user_id})
    if(user_data.length >0){
        const like_data = await VideoLikes.find({user_id:req?.body?.user_id,video_id:req?.body?.video_id})
        if(like_data.length>0){
            return res.status(402).json({status:0,message:"already liked video"})
        }else{
            const video_data = await videos.find({_id:req?.body?.video_id}).populate("user_id")
            if(video_data.length>0){
                if(Object.keys(video_data[0].user_id).length > 0){
                    const notification_id = Math.floor(1000 + Math.random() * 9000)
                    const find_reciever_id   = video_data[0].user_id.fcm_id
                    const title = `${user_data[0].name} like your video`
                    const message = `${user_data[0].name} like your video at ${moment().format('DD-MM-YYYY HH:mm A')}`
                    if(find_reciever_id != ''){
                        let img = ''
                        push_message.sendPushNotification(find_reciever_id,title,message,message,notification_id,1,e,img,1,1)
                        const notification_data = new Notification({
                            user_id:user_id,
                            receiver_id : video_data[0].user_id._id,
                            video_id:video_id,
                            comment:title,
                            type:1
                        })
                        await notification_data.save()
                        
                    }  
                } 
                const video_like_data = new VideoLikes({
                    user_id:req?.body?.user_id,
                    video_id:req?.body?.video_id
                })  
                await video_like_data.save()
                return res.status(201).json({status:1,message:"video liked successfully"})
            }else{
                return res.status(402).json({status:0,message:"video not found"})
            }
        }
    }else{
        return res.status(402).json({status:0,message:"user not found"})
    }
}

exports.remove_video_like = async(req,res)=>{
    if( req?.body?.user_id == '' || !req?.body?.user_id ){ 
        return  res.status(406).json({status:0,message:"please give a proper parameter"})
    }
    if( req?.body?.video_id == '' || !req?.body?.video_id ){ 
        return  res.status(406).json({status:0,message:"please give a proper parameter"})
    }

    var user_data = await Users.find({_id: req?.body?.user_id})
    if(user_data.length> 0){
        const like_data = await VideoLikes.find({user_id:req?.body?.user_id,video_id:req?.body?.video_id})
        if(like_data.length>0){
             await VideoLikes.deleteOne({user_id:req?.body?.user_id,video_id:req?.body?.video_id})
             return res.status(201).json({status:1,message:"video unliked successfully"})
        }else{
            return res.status(402).json({status:0,message:"this video is not liked by user"})
        }
    }else{
        return res.status(402).json({status:0,message:"user not found"})
    }
}

exports.get_video_likes = async(req,res)=>{
    if( req?.body?.user_id == '' || !req?.body?.user_id ){ 
        return  res.status(406).json({status:0,message:"please give a proper parameter"})
    }
    if( req?.body?.video_id == '' || !req?.body?.video_id ){ 
        return  res.status(406).json({status:0,message:"please give a proper parameter"})
    }
            var data = []
    var video_likes_data = await VideoLikes.find({video_id: req?.body?.video_id}).populate("user_id")
    if(video_likes_data.length>0){
        video_likes_data?.map(async(e)=>{

            if(Object.keys(e.user_id).length > 0){
                if(e.user_id.profile_image != ''){
                    const path = process.env.PUBLICPOROFILEIMAGEURL
                    if(fs.existsSync(`uploads/user/profile/${e.user_id.profile_image}`)){
                        var  profile_image = `${path}/${e.user_id.profile_image}`
                    }else{
                        
                        var profile_image = ''
                    }
                }else{
                    var profile_image = ''
                } 
                var user_name  = e.user_id.name 
                var user_username  = e.user_id.username 
            }else{
                var profile_image = ''
                var user_username  = ''
                var user_name = ''
            }
            if(req?.body?.user_id == e.user_id._id){
                var is_like = 1
            }else{
                var is_like = 0
            }

        data.push({
            id:e._id,
            user_id : e.user_id._id,
            name:user_name,
            username : user_username,
            profile_image:profile_image
        })
        })
        return res.status(201).json({data : data , status:1,message:"video like get successfully"})
        }else{
            return res.status(402).json({status:0,message:"no data found"})
        }
}

exports.add_video_comments = async(req,res)=>{
    if( req?.body?.user_id == '' || !req?.body?.user_id ){ 
        return  res.status(406).json({status:0,message:"please give a proper parameter"})
    }
    if( req?.body?.video_id == '' || !req?.body?.video_id ){ 
        return  res.status(406).json({status:0,message:"please give a proper parameter"})
    }
    const user_data = await Users.find({_id:req?.body?.user_id})
    if(user_data.length > 0){
        const video_data = await videos.find({_id:req?.body?.video_id}).populate("user_id")
        if(video_data.length>0){
            video_comment = new VideoComments({
                user_id:req?.body?.user_id,
                video_id:req?.body?.video_id,
                mention_user : req?.body?.mention_user ? req?.body?.mention_user : '',
                comment : req?.body?.comment ? req?.body?.comment : '',
            })
            const comment = await video_comment.save()
            
            //console.log(video_data)
            if(Object.keys(video_data[0].user_id).length > 0){
                if(video_data[0].user_id.fcm_id != ''){
                    const notification_id = Math.floor(1000 + Math.random() * 9000)
                    const find_reciever_id   = video_data[0].user_id.fcm_id
                    const title = `${user_data[0].name} like your video`
                    const message = `${user_data[0].name} like your video at ${moment().format('DD-MM-YYYY HH:mm A')}`
                    if(find_reciever_id != ''){
                        let img = ''
                        push_message.sendPushNotification(find_reciever_id,title,message,message,notification_id,1,e,img,1,1)
                        const notification_data = new Notification({
                            user_id:user_id,
                            receiver_id :video_data[0].user_id._id ,
                            video_id:req?.body?.video_id,
                            comment:title,
                            type:2
                        })
                        await notification_data.save()
                        
                    }  
                }
            }
            
            return res.status(201).json({ status:1,message:"comment added  successfully"})

        }else{
            return res.status(402).json({status:0,message:"no data found"})
        }
    }else{
        return res.status(402).json({status:0,message:"user data not found"})
    }
}

exports.add_parent_comment = async(req,res)=>{
    if( req?.body?.user_id == '' || !req?.body?.user_id ){ 
        return  res.status(406).json({status:0,message:"please give a proper parameter"})
    }
    if( req?.body?.video_id == '' || !req?.body?.video_id ){ 
        return  res.status(406).json({status:0,message:"please give a proper parameter"})
    }
    if( req?.body?.comment_id == '' || !req?.body?.comment_id ){ 
        return  res.status(406).json({status:0,message:"please give a proper parameter"})
    }
    if( req?.body?.mention_user == '' || !req?.body?.mention_user ){ 
        return  res.status(406).json({status:0,message:"please give a proper parameter"})
    }
    const user_data = await Users.find({_id:req?.body?.user_id})
    if(user_data.length > 0){
        const video_data = await videos.find({_id:req?.body?.video_id}).populate("user_id")
        if(video_data.length>0){
            video_comment = new VideoComments({
                user_id:req?.body?.user_id,
                video_id:req?.body?.video_id,
                mention_user : req?.body?.mention_user ? req?.body?.mention_user : '',
                comment : req?.body?.comment ? req?.body?.comment : '',
                parent_id : req?.body?.comment_id
            })
            await video_comment.save()
            return res.status(201).json({ status:1,message:"comment added  successfully"})

        }else{
            return res.status(402).json({status:0,message:"no data found"})
        }
    }else{
        return res.status(402).json({status:0,message:"user data not found"})
    }
}

exports.private_position_video_list = async(req,res)=>{
    if( req?.body?.user_id == '' || !req?.body?.user_id ){ 
        return  res.status(406).json({status:0,message:"please give a proper parameter"})
    }
    if( req?.body?.video_id == '' || !req?.body?.video_id ){ 
        return  res.status(406).json({status:0,message:"please give a proper parameter"})
    }
    if( req?.body?.login_id == '' || !req?.body?.login_id ){ 
        return  res.status(406).json({status:0,message:"please give a proper parameter"})
    }
        var data = []
    const video_data  = await videos.find({user_id:req?.body?.user_id,is_view:3,is_save_to_device:0,video_id:{$ne:req?.body?.video_id}}).populate("user_id").populate("song_id").sort({createdAt:-1})
    if(video_data.length > 0 ){
        video_data?.map(async(e)=>{
            if(Object.keys(e.user_id).length > 0){
                if(e.user_id.profile_image != ''){
                    const path = process.env.PUBLICPOROFILEIMAGEURL
                    if(fs.existsSync(`uploads/user/profile/${e.user_id.profile_image}`)){
                        var  profile_image = `${path}/${e.user_id.profile_image}`
                    }else{
                        
                        var profile_image = ''
                    }
                }else{
                    var profile_image = ''
                } 
                var user_name  = e.user_id.name 
                var user_username  = e.user_id.username 
            }else{
                var profile_image = ''
                var user_username  = ''
                var user_name = ''
            }
            var total_this_likes = await VideoLikes.count({video_id:e._id})
            var total_this_comments = await VideoComments.count({video_id:e._id})
            var like_data = await VideoLikes.find({user_id:req?.body?.login_id,video_id:e._id})
            if(like_data.length > 0){
                var is_video_like  = 1
            }else{
                var is_video_like  = 0
            }
            if(e.cover_image != ''){
                const path = process.env.PUBLICCOVERIMAGEEURL
                if(fs.existsSync(`${path}/${e.cover_image}`)){
                    var cover_image    = `${path}/${e.cover_image}`
                }
                else {
                    var cover_image   = ''
                }
            }else{
                var cover_image   = ''
            }
            if(e.file_name  != ''){
                const path = process.env.PUBLICVIDEOSURL
                if(fs.existsSync(`${path}/${e.file_name }`)){
                    var  video_url     = `${path}/${e.file_name}`
                }
                else {
                    var video_url    = ''
                }
            }else{
                var  video_url    = ''
             }
             data.push({
                video_id : e._id,
                user_id:e.user_id._id,
                name:user_name,
                username:user_username,
                profile_image:profile_image,
                song_name : e?.song_id?.name ? e?.song_id?.name : '',
                description:e.description,
                total_likes:total_this_likes,
                total_comments:total_this_comments,
                is_allow_comment:e.is_allow_comment,
                is_allow_duet:e.is_allow_duet,
                cover_image:cover_image,
                video_url:video_url
        }) 

        })
    }else{
        data = []
    }
    var video_details = await videos.find({_id:req?.body?.video_id}).populate("user_id")
    if(video_details.length>0){
            
    }

}