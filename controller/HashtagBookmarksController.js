const hashtags_bookmarks  = require("../model/hashtags_bookmarks")
const Videos= require("../model/videos")
const  User = require("../model/users")
const Hashtags = require("../model/hashtags")


exports.add_hashtag_bookmark = async(req,res) =>{
    try {
        if(!req.body.user_id || req.body.user_id == '' || req.body.hashtag_id == '' || !req.body.hashtag_id){ 
            return  res.status(406).json({status:0,message:"please give proper parameter"})
        }
        const user = await  User.find({_id:req.body.user_id})
        if(user.length > 0){
            const hashtagdata = await Hashtags.find({_id:req.body.hashtag_id})
            if(hashtagdata.length > 0) {
                const hashtagbookmark = await hashtags_bookmarks.find({user_id:req.body.user_id,hashtag_id:req.body.hashtag_id})
                if(hashtagbookmark.length == 0){
                  const  hashtagbookmarkdata = new hashtags_bookmarks({
                        user_id :  req.body.user_id ,
                        hashtag_id : req.body.hashtag_id
                    })
                    await hashtagbookmarkdata.save()
                    return res.status(201).json({status:1,message:"hashtag bookmark add successfully"})
                }else{
                    return  res.status(406).json({status:0,message:"hashtag already bookmarked"})    
                }
            }else{
                return  res.status(406).json({status:0,message:"not found hashtag"})    
            }
        }
        else{
            return  res.status(406).json({status:0,message:"not found user"})
        }

    } catch (error) {
        res.status(502).json({status:0,message:"internal server error"})
    console.log("server error on  add hashtag bookmark" + error); 
    }
}


exports.get_hashtag_bookmarks   = async (req,res) =>{
    try {
        if(!req.body.user_id || req.body.user_id == ''){ 
        return  res.status(406).json({status:0,message:"please give proper parameter"})
    }
        const hashtagdata = await hashtags_bookmarks.find({user_id:req?.body?.user_id},{user_id:1,hashtag_id:1})
        if(hashtagdata.length>0){
            return res.status(201).json({status:1,message:"hashtag bookmark add successfully",data:hashtagdata})
        }else{
            return  res.status(406).json({status:0,message:"not found of hashtag bookmark"})
        }
    } catch (error) {
        res.status(502).json({status:0,message:"internal server error"})
        console.log("server error on  get hashtag bookmark" + error); 
    }
}
exports.remove_hashtag_bookmark = async(req,res) =>{
    try {
        if(!req.body.user_id || req.body.user_id == '' || req.body.hashtag_id == '' || !req.body.hashtag_id){ 
            return  res.status(406).json({status:0,message:"please give proper parameter"})
        }
       hashtags_bookmarks.exists({user_id:req.body.user_id ,hashtag_id:req.body.hashtag_id },async(err,result)=>{
        if(err) return  res.status(406).json({status:0,message:"internal error "})    
        else{
            await hashtags_bookmarks.deleteOne({hashtag_id:req.body.hashtag_id,user_id:req.body.user_id})
            return res.status(201).json({status:1,message:"hashtag bookmark add successfully"})
        }
       })
       
    } catch (error) {
        res.status(502).json({status:0,message:"internal server error"})
    console.log("server error on  add hashtag bookmark" + error); 
    }
}