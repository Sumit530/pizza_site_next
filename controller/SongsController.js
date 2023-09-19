const User = require("../model/users")
const Songs = require("../model/songs")
const Categories = require("../model/categories")
const SoundBookmark = require("../model/sound_bookmarks")
const Banner_images = require("../model/banner_images")
const Videos = require("../model/videos")
const Singers = require("../model/singers")
const VideoData = require("../model/video_data")
const VideoBookmarks = require("../model/video_bookmarks")
const VideoFavorite = require("../model/video_favorites")
const VideoLikes = require("../model/video_likes")
const VideoComments = require("../model/videos_comments")
const VideoWatchHistory = require("../model/video_watch_histories")
const favorite_songs = require("../model/favorite_songs")
const Country = require("../model/countries")
const fs = require("fs")

exports.add_banner_image = async(req,res) =>{
    const banner_image = req?.file?.filename

    if(banner_image){
    const banner_image_data = new Banner_images({
        image_name : banner_image ? banner_image : ""
    })
    await banner_image_data.save()
    return  res.status(201).json({status:1,message:"banner image added successfully successfully!"})
    }
    else {
        return res.status(406).json({status:0,message:"please give a banner image"})
    }

}
exports.get_categories = async(req,res) =>{
    const cat = await Categories.find()
    if(cat.length > 0){
        const data  = cat.map((e)=>{
            return ({
                id:e._id,
                name:e.name     
                })
        })
        return  res.status(201).json({status:1,message:"category data list get successfully!",data:data})
    }else{
        return res.status(406).json({status:0,message:"no data found"})
    }
}
exports.add_song = async(req,res) =>{
    if(!req?.body?.cat_id || req?.body?.cat_id == ''  ){
        return res.status(406).json({status:0,message:"please give a user id"})
    }
    if(!req?.body?.name || req?.body?.name == ''  ){
        return res.status(406).json({status:0,message:"please give a user id"})
    }
    // if(!req?.file?.user_id || req?.body?.user_id == ''  ){
    //     return res.status(406).json({status:0,message:"please give a user id"})
    // }
    // if(!req?.body?.user_id || req?.body?.user_id == ''  ){
    //     return res.status(406).json({status:0,message:"please give a user id"})
    // }
    const songdata = new Songs({
        cat_id:req?.body?.cat_id ,
        name:req?.body?.name ,
        banner_image:req?.files?.banner_image[0].filename ,
        attachment:req?.files?.attachment[0].filename ,
        singer_id:req?.body?.singer_id ? req?.body?.singer_id : null,
        description:req?.body?.description ? req?.body?.description : "",
        duration : req?.body?.duration ? req?.body?.duration : ""


    })
    const d = await songdata.save()
    console.log(d)
    return  res.status(201).json({status:1,message:"song added successfully!"})
}

exports.get_singers = async(req,res) =>{
    const singers  = await Singers.find()
    if(singers.length > 0){
        const data = []
        singers.map((e)=>{
            if(e.image != ''){
                
                const path = process.env.PUBLICSINGERURL
                if(fs.existsSync(`uploads/singers/${e.image}`)){
                    var filepath = `${path}/${e.image}`
                }
                else {
                    var filepath = ''
                }
            }else{
                var filepath = ''
            }
           data.push({
            id:e._id,
            name:e.name,
            description : e.description,
            image:filepath
           }) 
        })
        return  res.status(201).json({status:1,message:"singers list get successfully!",data:data})
    }else{
        return res.status(406).json({status:0,message:" data not found"})
    }
} 

exports.get_song =async(req,res) =>{
    const catData = await Categories.find()
    var data = []
    if(catData.length > 0){
      const songdata =  catData.map(async(e)=>{
            const songData = await Songs.find({cat_id:e._id})
            if(songData.length > 0){
               var d =  songData.map((f)=>{
                    if(f.attachment != ''){
                
                        const path = process.env.PUBLICSONGURL
                        if(fs.existsSync(`uploads/songs/${f.attachment}`)){
                            var attachment  = `${path}/${f.attachment}`
                        }
                        else {
                            var attachment = ''
                        }
                    }else{
                        var attachment = ''
                    }       
                    if(f.banner_image != ''){
                        
                        const path = process.env.PUBLICSONGBANNERIMAGE
                        if(fs.existsSync(`uploads/song_banner_image/${f.banner_image}`)){
                            var banner_image  = `${path}/${f.banner_image}`
                        }
                        else {
                            var banner_image = ''
                        }
                    }else{
                        var banner_image = ''
                    }
                    return({
                        id:f._id,
                        name:f.name,
                        description:f.description,
                        duration:f.duration,
                        attachment:attachment,
                        banner_image:banner_image
                    })
                })
            }
            return({
                id:e._id,
                name:e.name,
                song_data:d
            })
        })
        Promise.all(songdata).then((e)=>{
           // console.log(e)
            return  res.status(201).json({status:1,message:"song list get successfully!",data:e})
        })
    }else{
        return res.status(406).json({status:0,message:"data not found"})
    }
}


exports.add_favortie_song = async(req,res) =>{
    if(!req?.body?.user_id || req?.body?.user_id == ''  || !req?.body?.sound_id || req?.body?.sound_id == ''){
        return res.status(406).json({status:0,message:"please give a user id"})
    }
    const check = await favorite_songs.find({song_id:req.body.sound_id,user_id:req.body.user_id})
    if(check.length == 0){

        const favsongdata = new SoundBookmark({
            sound_id:req.body.sound_id,
            user_id : req.body.user_id
        })
        await favsongdata.save()
        return  res.status(201).json({status:1,message:"sound added as favorite successfully!"})
    }else{
        return res.status(406).json({status:0,message:"already added as favorite"})
    }
}
exports.removed_favortie_song = async(req,res) =>{
    if(!req?.body?.user_id || req?.body?.user_id == ''  || !req?.body?.song_id || req?.body?.song_id == ''){
        return res.status(406).json({status:0,message:"please give a user id"})
    }
    const check = await fa.find({song_id:req.body.sound_id,user_id:req.body.user_id})
    if(check.length > 0){

        await favorite_songs.deleteOne({_id:check[0]._id})
        return  res.status(201).json({status:1,message:"sound remove from favorite successfully!"})
    }else{
        return res.status(406).json({status:0,message:"not added as favorite"})
    }
}
exports.get_favorties_song = async(req,res) =>{
try {
    if(!req?.body?.user_id || req?.body?.user_id == '' ){
        return res.status(406).json({status:0,message:"please give a user id"})
    }
    if(req?.body?.keyword && req?.body?.keyword != ''  ){
        var songdata = await favorite_songs.find({user_id:req.body.user_id,name:`/${req.body.keyword}/`}).populate({ 
            path: 'sound_id',
            populate: {
              path: 'cat_id'
            } 
         })
    }else{
        var songdata = await favorite_songs.find({user_id:req.body.user_id}).populate({ 
            path: 'sound_id',
            populate: {
              path: 'cat_id'
            } 
         })
    }
    var data = []
    if(songdata.length > 0){
        songdata?.map((f)=>{
            if(f.sound_id.attachment != ''){
                const path = process.env.PUBLICSONGURL
                if(fs.existsSync(`uploads/songs/${f.sound_id.attachment}`)){
                    var attachment  = `${path}/${f.sound_id.attachment}`
                }
                else {
                    var attachment = ''
                }
            }else{
                var attachment = ''
            }       
            if(f.banner_image != ''){
                
                const path = process.env.PUBLICSONGBANNERIMAGE
                if(fs.existsSync(`uploads/song_banner_image/${f.sound_id.banner_image}`)){
                    var song_banner_image  = `${path}/${f.sound_id.banner_image}`
                }
                else {
                    var song_banner_image = ''
                }
            }else{
                var song_banner_image = ''
            }
            data.push({
                id:f._id,
                song_id:f.sound_id._id,
                cat_id:f.sound_id.cat_id._id,
                cat_name:f.sound_id.cat_id.name,
                name:f.name,
                description:f.description,
                duration:f.duration,
                singer_id : f?.singer_id,
                attachment:attachment,
                banner_image:song_banner_image,

            })
        })
    }else{
        data = []
    }
    var banner_data = []
    const banner_images_data  = await Banner_images.find()
    console.log("hey")
    console.log(banner_images_data)
    if(banner_images_data.length > 0){
        banner_images_data?.map((f)=>{
            if(f.image_name != ''){
                const path = process.env.PUBLICBANNERIMAGE
                if(fs.existsSync(`uploads/song_banner_image/${f.image_name}`)){
                    var banner_image  = `${path}/${f.image_name}`
                }
                else {
                    var banner_image = ''
                }

            }else{
                var banner_image = ''
            }
            banner_data.push({
                id:f._id,
                banner_image:banner_image
            })
        })
    }
    else{
        banner_data = []
    }
    return  res.status(201).json({status:1,message:" favorite song found!",result:data,banner_result :banner_data})
    
} catch (error) {
    res.status(502).json({status:0,message:"internal server error"})
    console.log("server error on get favorite" + error);   
}
}

exports.get_song_to_video = async(req,res) =>{
    try {
        var  songData = []
        var  singleSongData = []
        if(!req?.body?.user_id || req?.body?.user_id == '' ){
            return res.status(406).json({status:0,message:"please give a user id"})
        }
        if(!req?.body?.song_id || req?.body?.song_id == '' ){
            return res.status(406).json({status:0,message:"please give a user id"})
        }
        const soundbookmark = await SoundBookmark.find({user_id:req?.body?.user_id ,sound_id:req?.body?.song_id})
        if(soundbookmark.length > 0){
            var is_song_bookmark  = 1
        }else{
            var is_song_bookmark  = 0
        }
        let single_song_data = await Songs.find({_id:req?.body?.song_id}).populate("singer_id")
        console.log(single_song_data)
        if(single_song_data.length >0 ){
            if(single_song_data[0].attachment != ''){
                const path = process.env.PUBLICSONGURL
                if(fs.existsSync(`uploads/songs/${single_song_data[0].attachment}`)){
                    var attachment  = `${path}/${single_song_data[0].attachment}`
                }
                else {
                    var attachment = ''
                }
            }else{
                var attachment = ''
            }       
            if(single_song_data[0].banner_image != ''){
                
                const path = process.env.PUBLICSONGBANNERIMAGE
                if(fs.existsSync(`uploads/song_banner_image/${single_song_data[0].banner_image}`)){
                    var song_banner_image  = `${path}/${single_song_data[0].banner_image}`
                }
                else {
                    var song_banner_image = ''
                }
            }else{
                var song_banner_image = ''
            }

            if(single_song_data[0].singer_id.image != ''){
                const path = process.env.PUBLICSINGERURL
                if(fs.existsSync(`uploads/singer/${single_song_data[0].singer_id.image}`)){
                    var singer_image   = `${path}/${single_song_data[0].singer_id.image}`
                }
                else {
                    var singer_image  = ''
                }
            }else{
                var singer_image  = ''
            }

            var total_videos  = await Videos.count({song_id:single_song_data[0]._id})
            if(!req?.body?.user_id && req?.body?.user_id?.length > 0 ){
                var song_data   = await Videos.find().populate("song_id")

            }
            else{
                var song_data = await Videos.find({song_id:req?.body?.song_id}).populate("song_id")
            }
            if(song_data.length > 0){
                song_data?.map(async(e)=>{

                    var total_views  = await VideoWatchHistory.count({video_id:e._id})
                    
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
                    var video_url     = `${path}/${e.file_name}`
                }
                else {
                    var video_url    = ''
                }
            }else{
                var video_url    = ''
            }
            var user_details  = await User.find({_id:e.user_id})
            if(user_details.length >0 ){
                if(user_details[0].profile_image  != ''){
                    const path = process.env.PUBLICPROFILEURL
                    if(fs.existsSync(`${path}/${user_details[0].profile_image }`)){
                        var profile_image      = `${path}/${user_details[0].profile_image}`
                    }
                    else {
                        var profile_image     = ''
                    }
                }else{
                    var profile_image     = ''
                } 
                var user_name = user_details[0].name
                var user_username = user_details[0].username

            }else{
                var user_name =''
                var user_username =''
                var profile_image =''
            }
            var total_likes  = VideoLikes.count({video_id:e._id})
            var total_comments  = VideoComments.count({video_id:e._id})
            const user_like_data = await VideoLikes.find({video_id:e._id,user_id:req?.body?.user_id})
            if(user_like_data.length > 0 ){
                var is_video_like = 1
            }else{
                var is_video_like = 0
            }
            const user_bookmark_data = await VideoBookmarks.find({video_id:e._id,user_id:req?.body?.user_id})
            if(user_bookmark_data.length > 0 ){
                var is_video_bookmark  = 1
            }else{
                var is_video_bookmark  = 0
            }
            const video_favorites_data  = await VideoFavorite.find({video_id:e._id,user_id:req?.body?.user_id})
            if(video_favorites_data.length > 0 ){
                var is_favorite  = 1
            }else{
                var is_favorite  = 0
            }
            songData.push({
                video_id : e._id,
                user_id:e.user_id,
                name:user_name,
                username : user_username,
                cover_image : cover_image,
                total_views : parseInt(total_views),
                is_bookmark : is_video_bookmark,
                is_favorite : is_favorite,
                is_video_like : is_video_like
            })

                })
            }
        
        if(req?.body?.video_id != '' && req?.body?.video_id?.length > 0){
             single_song_data = await Videos.find({_id:req?.body?.video_id}).populate("song_id")
            const total_views  = await VideoWatchHistory.count({video_id:single_song_data[0]._id})
            if(single_song_data[0].cover_image != ''){
                const path = process.env.PUBLICCOVERIMAGEEURL
                if(fs.existsSync(`uploads/videos/cover_image/${single_song_data[0].cover_image}`)){
                    var cover_image    = `${path}/${single_song_data[0].cover_image}`
                }
                else {
                     var cover_image   = ''
                }
            }else{
               var cover_image   = ''
            }
            if(single_song_data[0].file_name  != ''){
                const path = process.env.PUBLICVIDEOSURL
                if(fs.existsSync(`${path}/${single_song_data[0].file_name }`)){
                    var video_url     = `${path}/${single_song_data[0].file_name}`
                }
                else {
                    var video_url    = ''
                }
            }else{
               var video_url    = ''
             }
             var user_details  = await User.find({_id:single_song_data[0].user_id})
            if(user_details.length >0 ){
                if(user_details.profile_image  != ''){
                    const path = process.env.PUBLICPROFILEURL
                    if(fs.existsSync(`${path}/${user_details[0].profile_image }`)){
                        var  profile_image      = `${path}/${user_details[0].profile_image}`
                    }
                    else {
                        var    profile_image     = ''
                    }
                }else{
                    var profile_image     = ''
                } 
                user_name = user_details[0].name
                user_username = user_details[0].username

            }else{
                 user_name =''
                 user_username =''
                 profile_image =''
            }
              total_likes  = VideoLikes.count({video_id:single_song_data[0]._id})
             total_comments  = VideoComments.count({video_id:single_song_data[0]._id})
            const user_like_data = await VideoLikes.find({video_id:single_song_data[0]._id,user_id:req?.body?.user_id})
            if(user_like_data.length > 0 ){
                var is_video_like = 1
            }else{
                var  is_video_like = 0
            }
            const user_bookmark_data = await VideoBookmarks.find({video_id:single_song_data[0]._id,user_id:req?.body?.user_id})
            if(user_bookmark_data.length > 0 ){
                var  is_video_bookmark    = 1
            }else{
                var  is_video_bookmark  = 0
            }
            const video_favorites_data  = await VideoFavorite.find({video_id:single_song_data[0]._id,user_id:req?.body?.user_id})
            if(video_favorites_data.length > 0 ){
                var   is_favorite  = 1
            }else{
                var  is_favorite  = 0
            }
            singleSongData.push({
                video_id : single_song_data[0]._id,
                user_id:single_song_data[0].user_id,
                name:user_name,
                username : user_username,
                cover_image : cover_image,
                total_views : parseInt(total_views),
                is_bookmark : is_video_bookmark,
                is_favorite : is_favorite,
                is_video_like : is_video_like
            })
            
    

    }else{
        singleSongData = []
    }
    const mainarray = []
    mainarray.push(singleSongData)
    mainarray.push(songData)
    return res.status(201).json({song_id:single_song_data[0]._id,song_name:single_song_data[0].name,song_banner_image:song_banner_image,song_url:attachment,total_videos:total_videos,singer_id:single_song_data[0].song_id._id,singer_description:single_song_data[0].song_id.description,is_song_bookmark:is_song_bookmark, data:mainarray,status:1,message:"data found"})

    }else{
        res.status(402).json({status:0,message:"this song not found"}) 
    }   
    } catch (error) {
        res.status(502).json({status:0,message:"internal server error"})
        console.log("server error on get song to video");    
    }
}
