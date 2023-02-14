const followers = require("../model/followers")
const Story = require("../model/story")
const moment = require("moment")

exports.add_story = async(req,res) =>{
    try {
        
    
    if( req?.body?.user_id == '' || !req?.body?.user_id ){ 
        return  res.status(406).json({status:0,message:"please give a proper parameter"})
    }
    if(  !req?.file || req?.file == '' ){ 
        return  res.status(406).json({status:0,message:"please give a proper parameter"})
    }
    
    const newStory = new Story({
        user_id:req.body.user_id,
        attachment:req.file.filename,
        mentions: req.body.mention ?  req.body.mention.split(",") : "",
        collaborator :  req.body.collaborator ?  req.body.collaborator.split(",") : "",
    })
    await newStory.save()
    res.status(201).json({status:1,message:"story uploaded successfully"})
    } catch (error) {
        res.status(502).json({status:0,message:"internal server error"})
        console.log("server error on add story");     
    }
}

exports.delete_story = async(req,res) =>{
    if( req?.body?.id == '' || !req?.body?.id ){ 
        return  res.status(406).json({status:0,message:"please give a proper parameter"})
    }
    const story = await Story.find({_id:req.body._id})
    if(story.length > 0){
        await Story.deleteOne({_id:req.body._id})
        res.status(201).json({status:1,message:"story deleted successfully"})
    }else{
        return  res.status(406).json({status:0,message:"please provide a valid story id"})
    }
}
exports.get_following_story = async(req,res)=>{
    if( req?.body?.user_id == '' || !req?.body?.user_id ){ 
        return  res.status(406).json({status:0,message:"please give a proper parameter"})
    }
    const followings = await followers.find({follower_id:req.body.user_id}).populate("user_id")
    if(followings.length>0){
        followings.map(async(e)=>{

            const story = await story.find({user_id:e.user_id._id,createdAt:{$gte:moment().subtract(1,"day").format()}})
            if(story.length>0){
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
                if(story[0].attachment != ''){
                    const path = process.env.PUBLICSTORYURL
                    if(fs.existsSync(`uploads/user/story/${story[0].attachment}`)){
                        var  story_attachment = `${path}/${story[0].attachment}`
                    }else{
                        
                        var story_attachment = ''
                    }
                }else{
                    var story_attachment = ''
                } 
                return({
                    id:e._id,
                    user_id:e.user_id._id,
                    user_username:e.user_id.username,
                    user_name:e.user_id.name,
                    profile_image:profile_image,
                    story:story_attachment
                })
            }else{
                return
            }
        })
    }
}

exports.get_user_story = (req,res) =>{
    
}