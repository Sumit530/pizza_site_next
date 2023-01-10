const Notification  = require("../model/notifications")
const User = require("../model/users")
const Videos = require("../model/videos")
const videos_comments = require("../model/videos_comments")
const video_comment_likes = require("../model/video_comment_likes")
const video_data = require("../model/video_data")
const video_likes = require("../model/video_likes")
const followers = require("../model/followers")

exports.notification = async(req,res) =>{
    if(!req.body.user_id || req.body.user_id == '' ){ 
        return  res.status(406).json({status:0,message:"please give proper parameter"})
    }
    const all_notification = await Notification.find({receiver_id:req.body.user_id}).sort({createdAt:"desc"})
    if(all_notification.length > 0) {
        all_notification.map(async(e)=>{
            const user = await User.find({_id:e.user_id})
            if(user.length > 0) {
                if(user[0].profile_image != ''){
                
                    const path = process.env.PUBLICPROFILEURL
                    if(fs.existsSync(`uploads/profile/${user[0].profile_image}`)){
                        var profile_image  = `${path}/${user[0].profile_image}`
                    }
                    else {  
                        var profile_image  = ''
                    }
                }else{
                    var profile_image  = ''
                }
                const videodata = await Videos.find({_id:e.vidoe_id})
                if(videodata.length > 0){
                    const path = process.env.PUBLICCOVERPAGELEURL
                    if(fs.existsSync(`uploads/videos/cover/${videodata[0].cover_image}`)){
                        var cover_image = `${path}/${videodata[0].cover_image}`
                    }
                    else {  
                        var cover_image = ''
                    }
                }else{
                    var cover_image = ''
                }
                 if(videodata[0].file_name  != ''){
                    const path = process.env.PUBLICCOVERPAGELEURL
                    if(fs.existsSync(`uploads/videos/cover/${videodata[0].file_name}`)){
                        var video_url  = `${path}/${videodata[0].file_name}`
                    }
                    else {  
                        var video_url  = ''
                    }
                }else{
                    var video_url  = ''
                }
                 
            }
            else{
                var video_url  = '' 
                var cover_image = ''
            }

            const followerdata  = await followers.find({user_id:req.body.user_id,follower_id:e.user_id})
            if(followerdata.length > 0){
                var is_follow = 1
            }else {
                var is_follow = 0
            }
            // more likes
            const noti_more_data = await Notification.find({receiver_id:req.body.user_id,video_id:e.video_id,createdAt:moment().subtract(1,"day")}).populate("receiver_id","username profile_image")
            //const noti_more_count = await 
            if(noti_more_data.length > 0){
                noti_more_data.map((f)=>{
                    if(f.profile_image != ''){
                
                        const path = process.env.PUBLICPROFILEURL
                        if(fs.existsSync(`uploads/profile/${f.profile_image}`)){
                            var profile_image  = `${path}/${f.profile_image}`
                        }
                        else {  
                            var profile_image  = ''
                        }
                    }else{
                        var profile_image  = ''
                    } 
                })
            }
        })
    }
}