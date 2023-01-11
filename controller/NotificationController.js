const Followers = require("../model/followers")
const VideoComments = require("../model/videos_comments")
const Users = require("../model/users")
const videoData = require("../model/video_data")
const VideoLikes = require("../model/video_likes")
const VideoCommentLikes = require("../model/video_comment_likes")
const notifications = require("../model/notifications")
const Videos = require("../model/videos")
const moment = require("moment")
const fs = require("fs")
const push_message = require("../push-message/notification")
const { count } = require("console")

exports.notification = async(req,res)=>{
    var video_all_data = []
    var yesterday_more_result  = []
    if( req?.body?.user_id == '' || !req?.body?.user_id ){ 
        return  res.status(406).json({status:0,message:"please give a proper parameter"})
    }
    const all_notidication_data  = await Notification.find({receiver_id:req?.body?.user_id}).populate('user_id').sort({createdAt:-1})
    if(all_notidication_data?.length > 0){
        all_notidication_data?.map(async(e)=>{
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
            var user_name = e.user_id.name
            var user_username = e.user_id.username

        }else{
            var user_name = ''
            var user_username = ''
            var profile_image = ''
        }
        const video_data = await Videos.find({_id:e.video_id})
        if(video_data.length > 0){
            if(video_data[0].cover_image != ''){
                const path = process.env.PUBLICCOVERIMAGEURL 
                if(fs.existsSync(`uploads/videos/cover_images/${video_data[0].cover_image}`)){
                    var cover_image = `${path}/${video_data[0].cover_image}`;    
                }else{
                    var cover_image = "";    
                }
            }else{
                var cover_image = "";
            }
            if(video_data[0].file_name != ''){
                const path = process.env.PUBLICCOVERIMAGEURL 
                if(fs.existsSync(`uploads/videos/videos/${video_data[0].file_name}`)){
                    var video_url  = `${path}/${video_data[0].file_name}`;    
                }else{
                    var video_url  = "";    
                }
            }else{
                var video_url  = "";
            }
        }else{
            var video_url  = "";
            var cover_image = "";
        }
        const follower_data = await Followers.find({user_id:req?.body?.user_id,follower_id:e.user_id._id})
        if(follower_data.length>0){
            var is_follow = 1
        }else{
            var is_follow = 0
        }
        var noti_more_data = await Notification.find({receiver_id:req?.body?.user_id,video_id:e.video_id,createdAt:moment().utc().subtract(1,"day")}).populate("receiver_id")
        var noti_more_count = await Notification.count({receiver_id:req?.body?.user_id,video_id:e.video_id,createdAt:moment().utc().subtract(1,"day")}).populate("receiver_id")
        if(noti_more_data?.length>0){
            noti_more_data?.map((f)=>{
                if(f.receiver_id.profile_image != ''){

                    const path = process.env.PUBLICPOROFILEIMAGEURL
                    if(fs.existsSync(`uploads/user/profile/${f.user_id.profile_image}`)){
                        var  profile_image1 = `${path}/${f.user_id.profile_image}`
                    }else{
                        
                        var profile_image1 = ''
                    }
                }else{
                    var profile_image1 = ''
                }
                if(e.type == 1){
                    yesterday_more_result.push({
                        id:f._id,
                        user_id : f.receiver_id._id,
                        name: f.receiver_id.name,
                        username: f.receiver_id.username,
                        profile_image: profile_image1,
                        total_another_like : noti_more_data.length,
                        created_at : moment(f.createdAt).local()



                    })
                }else{
                    yesterday_more_result = []
                }
        })
        }
        var is_like_comment = 0
        if(e.type == 2){
            var comment_like_data = await VideoCommentLikes.find({user_id:req?.body?.user_id,comment_id:e.comment_id})
            if(comment_like_data.length > 0 ){
                is_like_comment = 1
            }else{
                is_like_comment = 0
            }
        }
        video_all_data.push({
            id:e._id,
            user_id:e.user_id._id,
            video_id:e?.video_id ? e?.video_id  : '',
            profile_image : profile_image,
            type:e.type,
            total_another_like:noti_more_count,
            more_result:yesterday_more_result,
            created_at:moment(e.createdAt).local()


        })
        })

    }
    if(video_all_data.length > 0){
        return  res.status(201).json({status:1,message:"data found found",data:video_all_data})
    }else{
        return res.status(406).json({status:0,message:"No data found.!"})
    }

}