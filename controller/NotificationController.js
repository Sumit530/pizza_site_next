const Users = require("../model/users")
const Notification = require("../model/notifications")
const Followers = require("../model/followers")
const VideoComments = require("../model/videos_comments")
const videoData = require("../model/video_data")
const VideoLikes = require("../model/video_likes")
const VideoCommentLikes = require("../model/video_comment_likes")
const Videos = require("../model/videos")
const moment = require("moment")
const fs = require("fs")
const push_message = require("../push-message/notification")

exports.notification = async(req,res)=>{
    //var yesterday_more_result  = []
    if( req?.body?.user_id == '' || !req?.body?.user_id ){ 
        return  res.status(406).json({status:0,message:"please give a proper parameter"})
    }
    const all_notidication_data  = await Notification.find({receiver_id:req?.body?.user_id}).sort({createdAt:-1})
    console.log(all_notidication_data)
      if(all_notidication_data?.length > 0){
        var video_all_data =   all_notidication_data?.map(async(e)=>{
            const userdata = await Users.find({_id:e.user_id})
            if(userdata.length > 0){
            if(userdata[0].profile_image != ''){
                const path = process.env.PUBLICPOROFILEIMAGEURL
                if(fs.existsSync(`uploads/user/profile/${userdata[0].profile_image}`)){
                    var  profile_image = `${path}/${userdata[0].profile_image}`
                }else{
                    
                    var profile_image = ''
                }
            }else{
                var profile_image = ''
            }
            var user_name = userdata[0].name
            var user_username = userdata[0].username

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
        var noti_more_data = await Notification.find({receiver_id:req?.body?.user_id,video_id:e.video_id,createdAt:moment().utc().subtract(1,"day")})
        var noti_more_count = await Notification.count({receiver_id:req?.body?.user_id,video_id:e.video_id,createdAt:moment().utc().subtract(1,"day")})

        if(noti_more_data?.length>0){
          var  yesterday_more_result =   noti_more_data?.map(async(f)=>{
            const reciver_data= await Users.find({_id:f.receiver_id})
                if(f.receiver_id.profile_image != ''){

                    const path = process.env.PUBLICPOROFILEIMAGEURL
                    if(fs.existsSync(`uploads/user/profile/${f.receiver_id.profile_image}`)){
                        var  profile_image1 = `${path}/${f.receiver_id.profile_image}`
                    }else{
                        
                        var profile_image1 = ''
                    }
                }else{
                    var profile_image1 = ''
                }
                if(e.type == 1){
                            return({
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
       return({
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
    console.log(video_all_data)
    if(video_all_data){

        Promise.all(video_all_data).then((e)=>{
            if(e){
                return  res.status(201).json({status:1,message:"data found",data:e})
            }else{
                return res.status(406).json({status:0,message:"No data found.!"})
            }
        })
    }else{
        return res.status(406).json({status:0,message:"No data found.!"})
    }

}

exports.follower_notification_list = async(req,res) =>{
    if( req?.body?.user_id == '' || !req?.body?.user_id ){ 
        return  res.status(406).json({status:0,message:"please give a proper parameter"})
    } 
    var today_followers_notification_data  = await Notification.find({receiver_id:req.body.user_id,notification_type:3}).populate("user_id").sort({createdAt:-1})
    if(today_followers_notification_data?.length > 0){
        var today_list = today_followers_notification_data?.map(async(e)=>{
             if(e.user_id.profile_image != ''){

                const path = process.env.PUBLICPOROFILEIMAGEURL
                if(fs.existsSync(`uploads/user/profile/${e.user_id.profile_image}`)){
                    var  profile_image1 = `${path}/${e.user_id.profile_image}`
                }else{
                    
                    var profile_image1 = ''
                }
            }else{
                var profile_image1 = ''
            }
            const follower_data = await Followers.find({user_id:req.body.user_id,follower_id:e.user_id})
            if (follower_data != '') 
            {
                var  is_follow = 1;
            }
            else
            {
                var is_follow = 0;
            }
            return({
                id:e._id,
            user_id:e.user_id._id,
            name:e?.name ? e?.name: '',
            username:e?.username ? e?.username : '',
            profile_image : profile_image,
           is_follow:is_follow,
            created_at:moment(e.createdAt).local()
            })
        })
    }
    var yesterday_followers_notification_data   = await Notification.find({receiver_id:req.body.user_id,notification_type:3}).populate("user_id").sort({createdAt:-1})
    if(today_followers_notification_data?.length > 0){
        var yesterday_list = today_followers_notification_data?.map(async(e)=>{
             if(e.user_id.profile_image != ''){

                const path = process.env.PUBLICPOROFILEIMAGEURL
                if(fs.existsSync(`uploads/user/profile/${e.user_id.profile_image}`)){
                    var  profile_image = `${path}/${e.user_id.profile_image}`
                }else{
                    
                    var profile_image= ''
                }
            }else{
                var profile_image = ''
            }
            const follower_data = await Followers.find({user_id:req.body.user_id,follower_id:e.user_id})
            if (follower_data != '') 
            {
                var  is_follow = 1;
            }
            else
            {
                var is_follow = 0;
            }
            return({
                id:e._id,
            user_id:e.user_id._id,
            name:e?.name ? e?.name: '',
            username:e?.username ? e?.username : '',
            profile_image : profile_image,
           is_follow:is_follow,
            created_at:moment(e.createdAt).local()
            })
        })
        
    }
    var result = []
    Promise.all(today_list).then((e)=>{
        result.push({
            today_list:e
        })
    })
    Promise.all(yesterday_list).then((e)=>{
        yesterday_list:e
    })
    if(result.length > 0){
        return  res.status(201).json({status:1,message:"data found found",data:result})
    }else{
        return res.status(406).json({status:0,message:"No data found.!"})
    }
}

exports.mentions_notification_list = async(req,res) =>{
    if( req?.body?.user_id == '' || !req?.body?.user_id ){ 
        return  res.status(406).json({status:0,message:"please give a proper parameter"})
    } 
    var mention_data  = await Notification.find({receiver_id:req.body.user_id,notification_type:4}).populate("video_id").populate("user_id").sort({createdAt:-1})
    if(mention_data.length > 0){
        var mentionList = mention_data.map((e)=>{
            if(e.user_id.profile_image != ''){

                const path = process.env.PUBLICPOROFILEIMAGEURL
                if(fs.existsSync(`uploads/user/profile/${e.user_id.profile_image}`)){
                    var  profile_image = `${path}/${e.user_id.profile_image}`
                }else{
                    
                    var profile_image= ''
                }
            }else{
                var profile_image = ''
            }

            if(e.video_id.cover_image != ''){
                const path = process.env.PUBLICCOVERIMAGEURL 
                if(fs.existsSync(`uploads/videos/cover_images/${e.video_id.cover_image}`)){
                    var cover_image = `${path}/${e.video_id.cover_image}`;    
                }else{
                    var cover_image = "";    
                }
            }else{
                var cover_image = "";
            }
            if(e.video_id.file_name != ''){
                const path = process.env.PUBLICCOVERIMAGEURL 
                if(fs.existsSync(`uploads/videos/videos/${e.video_id.file_name}`)){
                    var video_url  = `${path}/${e.video_id.file_name}`;    
                }else{
                    var video_url  = "";    
                }
            }else{
                var video_url  = "";
            }
            return({
                id:e._id,
                user_id : e.user_id._id,
                name: e.user_id.name,
                username: f.user_id.username,
                profile_image: profile_image,
                video_url:video_url,
                cover_image:cover_image,
                created_at : moment(f.createdAt).local()
            })

        })
        Promise.all(mentionList).then((e)=>{
            
            return  res.status(201).json({status:1,message:"data found found",data:e})
        })
    }else{
        return res.status(406).json({status:0,message:"No data found.!"})
    }
}

exports.comment_notification_list = async(req,res) =>{
    if( req?.body?.user_id == '' || !req?.body?.user_id ){ 
        return  res.status(406).json({status:0,message:"please give a proper parameter"})
    } 
    var mention_data  = await Notification.find({receiver_id:req.body.user_id,notification_type:2}).populate("video_id").populate("user_id").sort({createdAt:-1})
    if(mention_data.length > 0){
        var mentionList = mention_data.map(async(e)=>{
            if(e.user_id.profile_image != ''){

                const path = process.env.PUBLICPOROFILEIMAGEURL
                if(fs.existsSync(`uploads/user/profile/${e.user_id.profile_image}`)){
                    var  profile_image = `${path}/${e.user_id.profile_image}`
                }else{
                    
                    var profile_image= ''
                }
            }else{
                var profile_image = ''
            }

            if(e.video_id.cover_image != ''){
                const path = process.env.PUBLICCOVERIMAGEURL 
                if(fs.existsSync(`uploads/videos/cover_images/${e.video_id.cover_image}`)){
                    var cover_image = `${path}/${e.video_id.cover_image}`;    
                }else{
                    var cover_image = "";    
                }
            }else{
                var cover_image = "";
            }
            if(e.video_id.file_name != ''){
                const path = process.env.PUBLICCOVERIMAGEURL 
                if(fs.existsSync(`uploads/videos/videos/${e.video_id.file_name}`)){
                    var video_url  = `${path}/${e.video_id.file_name}`;    
                }else{
                    var video_url  = "";    
                }
            }else{
                var video_url  = "";
            }
            const comment_like = await  VideoCommentLikes.find({user_id:req.body.user_id,comment_id:e?.comment_id})
            if(comment_like.length > 0){
                var is_like_comment  = 1
            }else{
                var is_like_comment  = 0
            }
            return({
                id:e._id,
                user_id : e.user_id._id,
                name: e.user_id.name,
                username: f.user_id.username,
                profile_image: profile_image,
                video_url:video_url,
                cover_image:cover_image,
                created_at : moment(f.createdAt).local()
            })

        })
        Promise.all(mentionList).then((e)=>{
            
            return  res.status(201).json({status:1,message:"data found found",data:e})
        })
    }else{
        return res.status(406).json({status:0,message:"No data found.!"})
    }
}
exports.like_notification_list  = (req,res)=>{
    if( req?.body?.user_id == '' || !req?.body?.user_id ){ 
        return  res.status(406).json({status:0,message:"please give a proper parameter"})
    }


} 


exports.like_notification_list = async(req,res)=>{
    //var yesterday_more_result  = []
    if( req?.body?.user_id == '' || !req?.body?.user_id ){ 
        return  res.status(406).json({status:0,message:"please give a proper parameter"})
    }
    const all_notidication_data  = await Notification.find({receiver_id:req?.body?.user_id}).populate({path: 'user_id', model:"users"}).sort({createdAt:-1})
    console.log(all_notidication_data)
      if(all_notidication_data?.length > 0){
        var video_all_data =   all_notidication_data?.map(async(e)=>{
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
        
        if(Object.keys(e.video_id).length > 0){
            if(e.video_id.cover_image != ''){
                const path = process.env.PUBLICCOVERIMAGEURL 
                if(fs.existsSync(`uploads/videos/cover_images/${e.video_id.cover_image}`)){
                    var cover_image = `${path}/${e.video_id.cover_image}`;    
                }else{
                    var cover_image = "";    
                }
            }else{
                var cover_image = "";
            }
            if(e.video_id.file_name != ''){
                const path = process.env.PUBLICCOVERIMAGEURL 
                if(fs.existsSync(`uploads/videos/videos/${e.video_id.file_name}`)){
                    var video_url  = `${path}/${e.video_id.file_name}`;    
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
       return({
            id:e._id,
            video_id:e?.video_id._id ? e?.video_id._id  : '',
            user_id:e.user_id._id,
            name:e.user_id.name,
            username:e.user_id.username,
            profile_image : profile_image,
            type:e.type,
            video_url:video_url,
            cover_image:cover_image,
            created_at:moment(e.createdAt).local()
        })
        })

    }
    var yesterday_data = await Notification.find({receiver_id:req?.body?.user_id,notification_type:1}).populate('user_id').sort({createdAt:-1})
     if(yesterday_data.length > 0){
        var yesterday_video_data = yesterday_data?.map(async(e)=>{

        
     
        var noti_more_data = await Notification.find({receiver_id:req?.body?.user_id,_id:{$ne:e._id},video_id:e.video_id,createdAt:moment().utc().subtract(1,"day")}).populate("receiver_id")
        var noti_more_count = await Notification.count({receiver_id:req?.body?.user_id,_id:{$ne:e._id},video_id:e.video_id,createdAt:moment().utc().subtract(1,"day")}).populate("receiver_id")
        if(noti_more_data?.length>0){
          var  yesterday_more_result =   noti_more_data?.map((f)=>{
                if(f.receiver_id.profile_image != ''){

                    const path = process.env.PUBLICPOROFILEIMAGEURL
                    if(fs.existsSync(`uploads/user/profile/${f.receiver_id.profile_image}`)){
                        var  profile_image = `${path}/${f.receiver_id.profile_image}`
                    }else{
                        
                        var profile_image = ''
                    }
                }else{
                    var profile_image = ''
                }
                
                            return({
                        id:f._id,
                        user_id : f.receiver_id._id,
                        name: f.receiver_id.name,
                        username: f.receiver_id.username,
                        profile_image: profile_image,
                        total_another_like : noti_more_data.length,
                        created_at : moment(f.createdAt).local()



                    })
             })


           if(e.receiver_id.profile_image != ''){

                    const path = process.env.PUBLICPOROFILEIMAGEURL
                    if(fs.existsSync(`uploads/user/profile/${e.receiver_id.profile_image}`)){
                        var  profile_image = `${path}/${e.receiver_id.profile_image}`
                    }else{
                        
                        var profile_image = ''
                    }
                }else{
                    var profile_image = ''
                }

                if(Object.keys(e.video_id).length > 0){
            if(e.video_id.cover_image != ''){
                const path = process.env.PUBLICCOVERIMAGEURL 
                if(fs.existsSync(`uploads/videos/cover_images/${e.video_id.cover_image}`)){
                    var cover_image = `${path}/${e.video_id.cover_image}`;    
                }else{
                    var cover_image = "";    
                }
            }else{
                var cover_image = "";
            }
            if(e.video_id.file_name != ''){
                const path = process.env.PUBLICCOVERIMAGEURL 
                if(fs.existsSync(`uploads/videos/videos/${e.video_id.file_name}`)){
                    var video_url  = `${path}/${e.video_id.file_name}`;    
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
        }
        return({
            id:e._id,
            video_id:e?.video_id._id ? e?.video_id._id  : '',
            user_id:e.user_id._id,
            name:e.user_id.name,
            username:e.user_id.username,
            profile_image : profile_image,
            type:e.type,
            video_url:video_url,
            cover_image:cover_image,
            created_at:moment(e.createdAt).local()
        })
        
           
    })
        
  
var result = []
            Promise.all(video_all_data).then((e)=>{
                result.push({
                    today_list:e
                })
            })
            Promise.all(yesterday_video_data).then((e)=>{
            result.push({
                yesterday_video_data:e
                  })
              })
        if(result.length>0){
            return  res.status(201).json({status:1,message:"data found found",data:result})
        }else{
        return res.status(406).json({status:0,message:"No data found.!"})
    }
        
    }

}