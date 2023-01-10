const Banner_image = require("../model/banner_images")
const User = require("../model/users")
const fs = require("fs")


exports.Index = (req,res)=>{

}
exports.create = (req,res)=>{

}
exports.create = (req,res)=>{

}
exports.store = async(req,res)=>{
    if(req?.file?.filename){
        const path = process.env.PUBLICBANNERIMAGE
        if(fs.existsSync(`${path}/${req.file.filename}`)){
            return res.status(406).json({status:0,message:"not present"})
        }
        else{
            banner = new Banner_image({
                image_name : req.file.filename
            })
            await banner.save()
            return  res.status(201).json({status:1,message:"banner image added  successfully!"})
        }
    }
    else{
        return res.status(406).json({status:0,message:"please give a image"})
    }

}
exports.update = async(req,res)=>{
    if(!req?.body?.id){
        return res.status(406).json({status:0,message:"please give a id"})
    }
    
    if(req?.file?.filename  ){
        const path = process.env.PUBLICBANNERIMAGE
        const image  = await Banner_image.find({_id : req.body.id})
        if(image.length > 0){

            if(fs.existsSync(`${path}/${image[0].image_name}`)){
                fs.unlink(`${path}/${image[0].image_name}`)
                 await Banner_image.findOneAndUpdate({_id : req.body.id},{image_name : req.file.filename})
                return  res.status(201).json({status:1,message:"banner image updated  successfully!"})
            }
            else{
                return res.status(406).json({status:0,message:"not  present"})    
            }
        }else{
            return res.status(406).json({status:0,message:"not  present"})
        }
    }
    else{
        return res.status(406).json({status:0,message:"please give a image"})
    }

}
exports.status = async(req,res)=>{
    if(req?.body?.id){
        const path = process.env.PUBLICBANNERIMAGE
        const image  = await Banner_image.findOneAndUpdate({_id : req.body.id})
        if(image.length > 0){
            if(image[0].status == 0){

                await Banner_image.findOneAndUpdate({_id : req.body.id},{status:1})
            }else{
                await Banner_image.findOneAndUpdate({_id : req.body.id},{status:0})
            }

return  res.status(201).json({status:1,message:"status updated successfully!"})
        }
        else{
            return res.status(406).json({status:0,message:"not found"})    
        }
    }else{
        return res.status(406).json({status:0,message:"please give a image"})
    }
}

exports.delete = async(req,res)=>{
    if(!req?.body?.id){
        return res.status(406).json({status:0,message:"please give a id"})
    }
    
    
        const path = process.env.PUBLICBANNERIMAGE
        const image  = await Banner_image.find({_id : req.body.id})
        if(image.length > 0){

            if(fs.existsSync(`${path}/${image[0].image_name}`)){
                fs.unlink(`${path}/${image[0].image_name}`)
                 await Banner_image.deleteOne({_id : req.body.id})
                return  res.status(201).json({status:1,message:"banner image deleted  successfully!"})
            }
            else{
                return res.status(406).json({status:0,message:"not  present"})    
            }
        }else{
            return res.status(406).json({status:0,message:"not  present"})
        }
    

}
