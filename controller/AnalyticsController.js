const User = require("../model/users")
const Follow = require("../model/followers")
const Videos = require("../model/videos")
const VideoLikes = require("../model/video_likes")
const VideoData = require("../model/Video")
const VideoWatchHistory = require("../model/video_watch_histories")
const Country = require("../model/countries")
const moment = require("moment")
exports.analytics_overview = (req,res) =>{
    if(!req.body.user_id || req.body.user_id == '' ){
        return res.status(406).json({status:0,message:"please give a user id"})
    } 

    const startdate = moment().format('YYYY-MM-DD hh:mm:ss a')
    const start_time = moment(startdate,"YYYY-MM-DD hh:mm:ss a")
    const seven_time = moment(startdate,"YYYY-MM-DD hh:mm:ss a").add(7,"day")
    const month_time = moment(startdate,"YYYY-MM-DD hh:mm:ss a").add(28,"day")
    const past_seven_views = []
    for(let i = startdate; i<seven_time ; i+=86400){
        past_seven_views.push({
            date:moment(i,"YYYY-MM-DD hh:mm:ss a").format("DD"),
            video_views : 123,
            profile_views : 123,
            followers : 123

        })
    }
    const past_month_views = []
    for(let i = startdate; i<month_time ; i+=86400){
        past_month_views.push({
            date:moment(i,"YYYY-MM-DD hh:mm:ss a").format("DD"),
            video_views : 123,
            profile_views : 123,
            followers : 123

        })
    }
    const data = {past_seven_views,past_month_views}
    return  res.status(201).json({status:1,message:"unFollow successfully!"})
}
