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



exports.upload_video = async(req,res)=>{
    if( req?.body?.user_id == '' || !req?.body?.user_id ){ 
        return  res.status(406).json({status:0,message:"please give a proper parameter"})
    }
    if( req?.body?.is_view == '' || !req?.body?.is_view ){ 
        return  res.status(406).json({status:0,message:"please give a proper parameter"})
    }
    if( req?.body?.is_allow_comment == '' || !req?.body?.is_allow_comment ){ 
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
    })
    const video = await video_data.save()
    var video_id = video._id
    if(req?.body?.mention_ids != ''){
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
    if(req?.body?.hashtag_ids){
        const hashtag_ids =  req?.body?.hashtag_ids.split(",")
        hashtag_ids?.map(async(e)=>{
            const hashtag_data = new Hashtag({
                video_id:video_id,
                hashtag_id:e
            })
            await hashtag_data.save() 
        })
    }
    return res.status(201).json({data:data ,status:1,message:"video uploaded successfully"})
}else{
    return res.status(402).json({status:0,message:"please upload a video file"})
}
}
exports.video_list = async(req,res) =>{

    // type - 1 = following 2=for you 
    if( req?.body?.type == '' || !req?.body?.type ){ 
        return  res.status(406).json({status:0,message:"please give a proper parameter"})
    }

    if(req?.body?.type == 1){
        if(req?.body?.user_id != ''){
            var total_likes  = 0
            var total_comments = 0
            const follower_data =  await Followers.find({user_id:req?.body?.user_id})
            if(follower_data.length > 0){
                follower_data?.map(async(e)=>{
                    const video_data = await videos.find({user_id:e.follower_id,is_view:1,is_save_to_device:0}).populate("song_id").populate("user_id")
                    if(video_data.length> 0){
                        video_data?.map(async(f)=>{
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
                                
                    
                            }
                        })
                    }
                })
            }
        }
    }
}