const Users = require("../model/users")
const videos = require("../model/videos")
const VideoReport = require("../model/video_reports")
const VideoReportData = require("../model/video_reports_data")
const VideoReportsType = require("../model/video_report_types")
const fs = require('fs')

exports.add_video_report = async(req,res) =>{
    if( req?.body?.type == '' || !req?.body?.type ){ 
        return  res.status(406).json({status:0,message:"please give a proper parameter"})
    }
    if( req?.body?.user_id == '' || !req?.body?.user_id ){ 
        
        return  res.status(406).json({status:0,message:"please give a proper parameter"})
    }

    const user_data = await Users.find({_id:req?.body?.user_id})
    if(user_data.length > 0){
        const video_report_data  = new VideoReport({
            user_id :req?.body?.user_id,
            video_id :req?.body?.user_id ? req?.body?.user_id : ''  ,
            type :req?.body?.type,
            description : req?.body?.description ? req?.body?.description : ''  ,
        })
        const video_report = await video_report.save()
        var report_id = video_report._id
        if(report_id != ''){
           
            const path = process.env.PUBLICREPORTURL
                if(!fs.existsSync(path)){
                    fs.mkdir(path)
                }
                if(req?.files?.report_files){
                    req?.files?.report_files.map(async(e)=>{
                        const video_reports = new VideoReportData({
                            report_id:report_id,
                            filename:e.filename
                        })
                        await  video_reports.save()
                    })
                    return res.status(201).json({status:1,message:"video report addedd successfully"})
                }


        }
        return res.status(402).json({status:0,message:"error occured when adding report"})
    }else{
        return res.status(402).json({status:0,message:"video not found"})
    }
}

exports.get_video_report_types = async(req,res)=>{
    const videoreporttype = await VideoReportData.find()
    var data = [] 
    if(videoreporttype?.length > 0){
        videoreporttype?.map((e)=>{
            data.push({
                id:e._id,
                title:e.title,
                discription:e.description
            })
        })
        return res.status(201).json({data:data,status:1,message:"report type got successfully"})
    }else{
        return res.status(402).json({status:0,message:"video report type not found"})
    }
}