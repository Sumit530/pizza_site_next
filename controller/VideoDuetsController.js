const Users = require("../model/users")
const Videos = require("../model/videos")
const VideoData = require("../model/video_data")
const VideoDuets = require("../model/video_duets")


exports.add_video_duet = async(req,res) =>{
    try {
        if(!req?.body?.user_id || req?.body?.user_id == '' ){
            return res.status(406).json({status:0,message:"please give a user id"})
        }
        if(!req?.body?.video_id || req?.body?.video_id == '' ){
            return res.status(406).json({status:0,message:"please give a user id"})
        }
    
        const user_data= await Users.find({_id:req?.body?.user_id})
        if(user_data.length > 0){
            const video_data  = await Videos.find({_id:req?.body?.video_id})
            if(video_data.length > 0){
                const video_duet_data  = await videoduets.find({_id:req?.body?.video_id,video_id:req?.body?.video_id})
                if(video_duet_data.length > 0){
    
                    const videoduets = new VideoDuets({
                        user_id:req?.body?.user_id,
                        video_id:req?.body?.video_id
                    })
                    await videoduets.save()
                    return  res.status(201).json({status:1,message:" video duet addedd successfully!"})
                }else{
    
                    return res.status(406).json({status:0,message:"already added in duet"})
                }
            }else{
                return res.status(406).json({status:0,message:"video not found"})
            }
        }else{
    
            return res.status(406).json({status:0,message:"user not found"})
        }
    } catch (error) {
        res.status(502).json({status:0,message:"internal server error"})
        console.log("server error on add duets video"); 
    }
}

exports.get_video_duets = async(req,res)=>{
    try {
        if(!req?.body?.user_id || req?.body?.user_id == '' ){
            return res.status(406).json({status:0,message:"please give a user id"})
        } 
        const data =[]
        const user_data= await Users.find({_id:req?.body?.user_id})
        if(user_data.length>0){
            const video_duets_data = await VideoDuets.find({user_id:req?.body?.user_id })
            if(video_duets_data?.length > 0){
                video_duets_data?.map(async(e)=>{

                    const video_details = await Videos.find({_id:e.video_id})
                    if(video_details.length > 0){
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
                         var video_id = video_details[0]._id
                    }else{
                        var video_id  = ''
                        var video_url  = ''
                        var cover_image  = ''
                    }
                    data.push({
                        duet_id:e._id,
                        video_id:video_id,
                        cover_image:cover_image,
                        video_url:video_url        
                    })
                })
                 return res.status(201).json({status:1,message:" duets found successfully",data:data})
            }else{
                return res.status(201).json({status:1,message:" duets not found"})
            }
           
        }else{
            return res.status(406).json({status:0,message:"user not found"})
        }
    } catch (error) {
        res.status(502).json({status:0,message:"internal server error"})
        console.log("server error on  get duets video"); 
    }
}