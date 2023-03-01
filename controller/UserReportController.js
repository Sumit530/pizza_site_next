const User = require("../model/users")
const UserReport = require("../model/user_reports")

exports.reportUser = async(req,res)=>{
    if(!req.body.user_id || req.body.user_id == ""){
        return  res.status(406).json({status:0,message:"please give a proper parameter"})
    }
    
    if(!req.body.reporter_id || req.body.reporter_id == ""){
        return  res.status(406).json({status:0,message:"please give a proper parameter"})
    }
    if(!req.body.reason || req.body.reason == ""){
        return  res.status(406).json({status:0,message:"please give a proper parameter"})
    }

    const checkuser = await User.find({_id:req.body.user_id})
    if(checkuser.length > 0){
        const report = new UserReport({
            user_id : req.body.user_id,
            reporter_id:req.body.UserReport,
            reason : req.body.reason,
        })
        await report.save()
        res.status(201).json({status:1,message:"Report Submitted Successfully"})
    }else{
        return  res.status(406).json({status:0,message:"User Not Exist!"})
    }
    
}