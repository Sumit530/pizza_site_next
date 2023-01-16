const Admin = require("../model/admins")
const User = require("../model/users")
const Videos = require("../model/videos")
const Setting = require("../model/settings")
const Categories = require("../model/categories")
const Songs = require("../model/songs")

exports.Index = async(req,res)=>{
    const lastuser = await User.aggregate([
        {
            $sort:{createdAt:-1}
        },
        {
            limit:7
        }
    ])
    const total_active_users = await User.find({status:1})
    const total_block_users = await User.find({status:0})
    const total_users = await User.find()
    const total_videos = await Videos.find()
    const total_songs = await Songs.find()
    const total_categories = await Categories.find()
}
