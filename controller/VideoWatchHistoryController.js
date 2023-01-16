const Users = require("../model/users")
const videos = require("../model/videos")
const videoData = require("../model/video_data")

const fs = require('fs')
const e = require("express")

exports.add_watch_video_history = async(req,res)=>{
    if( req?.body?.video_id == '' || !req?.body?.video_id ){ 
        return  res.status(406).json({status:0,message:"please give a proper parameter"})
    }
    if( req?.body?.user_id == '' || !req?.body?.user_id ){ 
        
        return  res.status(406).json({status:0,message:"please give a proper parameter"})
    }
    const user_data = await Users.find({_id:req?.body?.user_id})
    if(user_data.length > 0){
        const video_watch_data = await videoWatchHistories.find({user_id:req?.body?.user_id,video_id:req?.body?.video_id})
        if(video_watch_data.length > 0){
             return res.status(402).json({status:0,message:"already watched video"})
        }else{
            const video_data = new videoWatchHistories({
                user_id:req?.body?.user_id,
                video_id:req?.body?.video_id
            })
            await video_data.save()
            return res.status(201).json({status:1,message:"video watch history added successfully"})
        }
    }else{
        return res.status(402).json({status:0,message:"user not found"})
    }
}
exports.get_watch_video_history = async(req,res)=>{
    if( req?.body?.video_id == '' || !req?.body?.video_id ){ 
        return  res.status(406).json({status:0,message:"please give a proper parameter"})
    }
        var data = []
    const video_watch_data = await videoWatchHistories.find({video_id:req?.body?.video_id}).polulate("user_id")
    if(video_watch_data.length> 0){
        video_watch_data?.map((e)=>{
            
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

            data.push({
                id:e._id,
                user_id : e.user_id._id,
                name:user_name,
                username:user_username,
                profile_image:profile_image
            })
        })
        return res.status(201).json({data:data ,status:1,message:"video watch history got successfully"})
    }else{
        return res.status(402).json({status:0,message:"watch history data not found"})
    }
}