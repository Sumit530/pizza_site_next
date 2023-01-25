const User = require("../model/users")
const Videos = require("../model/videos")
const Songs = require("../model/songs")
const Categries = require("../model/categories")
const Singers = require("../model/singers")
const Sound_Bookmarks= require("../model/sound_bookmarks")
const fs = require("fs")
exports.add_sound_bookmark = async(req,res) =>{
    try {
        if(!req?.body?.user_id || req?.body?.user_id == ""){
            return  res.status(406).json({status:0,message:"please give proper parameter"})
        }
        if(!req?.body?.sound_id || req?.body?.sound_id == ""){
            return  res.status(406).json({status:0,message:"please give proper parameter"})
        } 
        const user_id  = req?.body?.user_id
        const sound_id = req?.body?.sound_id
        const userdata = await User.find({_id:user_id})
        if(userdata.length > 0){
            const songdata = await Songs.find({_id:sound_id}) 
            if(songdata.length > 0){
                const soundbookmark = await Sound_Bookmarks.find({user_id:user_id,sound_id:sound_id})
                if(soundbookmark.length > 0){
                    return  res.status(406).json({status:0,message:"already bookmarked sound"})  
                }else{
                    const sound = new Sound_Bookmarks({
                        user_id:user_id,
                        sound_id:sound_id
                    })
                     await sound.save()

                    return  res.status(201).json({status:1,message:"sound bookmarked successfully"})
                }
            }else{
                return  res.status(406).json({status:0,message:"sound not found"})  
            }
        }else{
            return  res.status(406).json({status:0,message:"user not found"})  
        }
    } catch (error) {
        res.status(502).json({status:0,message:"internal server error"})
    console.log("server error on add song bookmark"); 
    }
}

exports.remove_song_bookmark = async(req,res) =>{
    try {
        if(!req?.body?.user_id || req?.body?.user_id == ""){
            return  res.status(406).json({status:0,message:"please give proper parameter"})
        }
        if(!req?.body?.sound_id || req?.body?.sound_id == ""){
            return  res.status(406).json({status:0,message:"please give proper parameter"})
        } 
        const user_id  = req?.body?.user_id
        const sound_id = req?.body?.sound_id
        
                const soundbookmark = await Sound_Bookmarks.find({user_id:user_id,sound_id:sound_id})
                if(soundbookmark.length > 0){
                     await Sound_Bookmarks.deleteOne({user_id:user_id,sound_id:sound_id})
                    return  res.status(201).json({status:1,message:"sound bookmark removed successfully"})
                }else{
                    
                    return  res.status(406).json({status:0,message:"bookmark sound not found"})  

                }
    } catch (error) {
        res.status(502).json({status:0,message:"internal server error"})
    console.log("server error on remove song bookmark"); 
    }
}

exports.get_song_bookmarks = async(req,res) =>{
    try {
        if(!req?.body?.user_id || req?.body?.user_id == ""){
            return  res.status(406).json({status:0,message:"please give proper parameter"})
        }  
        const user_id = req?.body?.user_id
        const song_bookmark_data  = await Sound_Bookmarks.find({user_id:user_id}).populate('sound_id')
        if(song_bookmark_data.length>0){
          var data =   song_bookmark_data?.map(async(e)=>{

                const totalvideos = await Videos.count({song_id:e.sound_id._id})
                if(e.sound_id.attachment != ''){
                
                    const path = process.env.PUBLICSONGURL
                    if(fs.existsSync(`uploads/songs/${e.sound_id.attachment}`)){
                        var attachment  = `${path}/${e.sound_id.attachment}`
                    }
                    else {
                        var attachment = ''
                    }
                }else{
                    var attachment = ''
                }       
                if(e.sound_id.banner_image != ''){
                    
                    const path = process.env.PUBLICSONGBANNERIMAGE
                    if(fs.existsSync(`uploads/song_banner_image/${e.sound_id.banner_image}`)){
                        var banner_image  = `${path}/${e.sound_id.banner_image}`
                    }
                    else {
                        var banner_image = ''
                    }
                }else{
                    var banner_image = ''
                }
                return({
                    id:e._id,
                    total_videos:totalvideos,
                    song_id:e.sound_id._id,
                    cat_id:e.sound_id.cat_id,
                    name:e.sound_id.name,
                    description:e.sound_id.description,
                    duration:e.sound_id.duration,
                    singer_id : e.sound_id.singer_id,
                    attachment:attachment,
                    banner_image:banner_image,

                })
                
            })
            Promise.all(data).then((e)=>{

                res.status(201).json({status:201,message:"bookmarked songs find successfully",data:e})
            })
        }else{
            return  res.status(406).json({status:0,message:"bookmark sound not found"})  
        }
    } catch (error) {
        res.status(502).json({status:0,message:"internal server error"})
        console.log("server error on get song bookmark"); 
    }
}