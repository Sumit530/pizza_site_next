 const VideoEffect  = require("../model/video_effects")
const fs = require("fs")

 exports.add_effect = async(req,res) =>{
    if(!req?.body?.name || req?.body?.name == '' ){
        return res.status(406).json({status:0,message:"please give proper parameter"})
    } 
    if(!req?.file?.filename || req?.file?.filename == '' ){
        return res.status(406).json({status:0,message:"please give proper parameter"})
    } 
    const video_effects = new VideoEffect({
            name:req.body.name,
            attachment:req.file.filename
    })
    await video_effects.save()
    return  res.status(201).json({status:1,message:" video effects addedd successfully!"})
 }
 exports.get_effect = async(req,res) =>{
   
    const video_effects = await VideoEffect.find()
    if(video_effects.length > 0){
     var data =    video_effects?.map((e)=>{

            if(e.attachment != ''){
                const path = process.env.PUBLICEFFECTSURL
                if(fs.existsSync(`uploads/effects/${e.attachment}`)){
                   var cover_image    = `${path}/${e.attachment}`
                }
                else {
                   var cover_image   = ''
                }
            }else{
               var cover_image   = ''
            }
            return({
                id:e._id,
                name:e.name,
                attachment:cover_image
            })
        })
        return  res.status(201).json({data:data , status:1,message:" video effects found !"})
    }else{
        return res.status(406).json({status:0,message:"please give proper parameter"})
    }
    
 }