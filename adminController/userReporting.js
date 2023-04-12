const Complaint = require("../model/complaints")
const followers = require("../model/followers")
const videos = require("../model/videos")
const User = require("../model/users")
const fs = require("fs")
exports.get_complaint = async(req,res) =>{
    var page = parseInt(req.body.page)
    var limit = parseInt(req.body.limit)
    page = (page-1)*limit
    var complaint = await Complaint.aggregate([
        {$group:{
            _id:"$user_id", count:{$sum:1},complaint:{$push:'$description'}
            
        }},
        {$setWindowFields: {output: {totalCount: {$count: {}}}}},
        {$sort:{count:-1}},
        {$skip:isNaN(page) ? 0:page},
        {$limit:limit}
    ])
    complaint = await complaint.map(async(e)=>{
        const follower = await followers.count({follower_id:e._id}) 
        const following = await followers.count({user_id:e._id}) 
        const post = await videos.count({user_id:e._id}) 
        const user = await User.find({_id:e._id})
        if(user.length>0){

        
        if(user[0].profile_image  != ''){
            const path = process.env.PUBLICPROFILEURL
            if(fs.existsSync(`uploads/users/profile/${user[0].profile_image }`)){
                var profile_image      = `${path}/${user[0].profile_image}`
            }
            else {
                var profile_image     = ''
            }
        }else{
            var profile_image     = ''
        } 
        return ({
            social_id:user[0].social_id,
            username:user[0].username,
            name:user[0].name,
            _id:user[0]._id,
            profile_image:profile_image,
            videos : post,
            follower,
            username:user[0].username,
            bio:user[0].bio,
            mobile_no:user[0].mobile_no,
            following,
            email:user[0].email,
            status:user[0].status,
            createdAt:user[0].createdAt,
            count : e.count,
            description:e.complaint,
            totalCount:e.totalCount,
            deActivated:user[0].deActivated

        })
        }
    })
    complaint = await Promise.all(complaint)
    if(complaint.length>0){
        return res.status(201).json({status:1,message:"User Data found!",result:complaint,total:complaint[0].totalCount})
        }else{
        return res.status(404).json({status:0,message:"User Data Not found."}) 
        }
}