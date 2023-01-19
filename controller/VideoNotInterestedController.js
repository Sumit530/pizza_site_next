const Users = require("../model/users")
const videos = require("../model/videos")
const VideoData = require("../model/video_data")
const videoNotInterested = require("../model/video_not_intersted")
const fs = require("fs")
const e = require("express")

exports.add_video_not_interested = async(req,res) =>{
    if( req?.body?.video_id == '' || !req?.body?.video_id ){ 
        return  res.status(406).json({status:0,message:"please give a proper parameter"})
    }
    if( req?.body?.user_id == '' || !req?.body?.user_id ){ 
        return  res.status(406).json({status:0,message:"please give a proper parameter"})
    }
    const user_data = await Users.find({_id:req?.body?.user_id})
    if(user_data.length > 0){
        const video_data = await videos.find({_id:req?.body?.video_id})
        if(video_data.length > 0){
            const video_notint_data = await videoNotInterested.find({user_id:req?.body?.user_id,video_id:req?.body?.video_id})
            if(video_notint_data.length > 0){
                return res.status(402).json({status:0,message:"this video already added to not interest"})
            }else{
                const video_not_interest_data = new videoNotInterested({
                    user_id:req?.body?.user_id,
                    video_id:req?.body?.video_id
                })
                await video_not_interest_data.save()
                return res.status(201).json({status:1,message:"video added in not interest successfully"})
            }
        }else{
            return res.status(402).json({status:0,message:"video not found"})
        
        }
    }else{
        return res.status(402).json({status:0,message:"user not found"})

    }

}

exports.remove_video_not_interested = async (req,res) =>{
    if( req?.body?.id == '' || !req?.body?.id ){ 
        return  res.status(406).json({status:0,message:"please give a proper parameter"})
    }

    const video_notint_data = await videoNotInterested.find({_id:req?.body?.id})
            if(video_notint_data.length > 0){
                await videoNotInterested.deleteOne({_id:req?.body?.id})
                return res.status(201).json({status:1,message:"video removed from not interest successfully"})
            }else{
                
                return res.status(402).json({status:0,message:"this video not found in video interest "})
                
            }

}

exports.get_video_not_interested = async (req,res) =>{
    if( req?.body?.user_id == '' || !req?.body?.user_id ){ 
        return  res.status(406).json({status:0,message:"please give a proper parameter"})
    }
                var data = []
    const video_notint_data = await videoNotInterested.find({user_id:req?.body?.user_id})
            if(video_notint_data.length > 0){
             const promisedata =  video_notint_data?.map(async(e)=>{
                    const video_details = await videos.find({_id:e.video_id})
                    if(video_details.length > 0){

                    
                    if(video_details[0].cover_image != ''){
                        const path = process.env.PUBLICCOVERIMAGEURL
                        if(fs.existsSync(`${path}/${video_details[0].cover_image}`)){
                            var cover_image = `${path}/${video_details[0].cover_image}`
                        }else{
                            var cover_image = ''
                        }
                    }else{
                        var cover_image = ''
                        
                    }
                    if(video_details[0].file_name != ''){
                        const path = process.env.PUBLICVIDEOURL
                        if(fs.existsSync(`${path}/${video_details[0].file_name}`)){
                            var video_url = `${path}/${video_details[0].file_name}`
                        }else{
                            var video_url = ''
                        }
                    }else{
                        var video_url = ''
                    }
                    var video_id = e._id
                }else{
                    var video_url = ''
                    var cover_image = ''
                    var video_id = ''
                }
                return({
                    id:e._id,
                    video_id:video_id,
                    video_url:video_url,
                    cover_image:cover_image,

                })
                })
                Promise.all(promisedata).then((e)=>{

                    return res.status(201).json({data:e, status:1,message:"video not interest data get successfully "})
                })
                }else{
                    return res.status(402).json({status:0,message:"data not found in video not interest "})
                    
                }


}