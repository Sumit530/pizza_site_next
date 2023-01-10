const Setting = require("../model/settings")


exports.terms_of_use = async(req,res) =>{
    const data = await Setting.find()
    if(data.length > 0){
        const result = {
            details:data[0].terms_of_use
        }
        return res.status(201).json({status:1,message:"terms of use got successfully",data:result})    
    }else{
        return res.status(402).json({status:0,message:"no data found"})
    }
}

exports.privacy_policy =async(req,res) =>{
    const settingdata = await Setting.find() 
    if(data.length > 0){
        const result = {
            details:data[0].privacy_policy
        }
        return res.status(201).json({status:1,message:"privacy policy got successfully",data:result})    
    }
    else{
        return res.status(402).json({status:0,message:"no data found"})
    }
}
exports.copyright_policy =async(req,res) =>{
    const settingdata = await Setting.find() 
    if(data.length > 0){
        const result = {
            details:data[0].copyright_policy
        }
        return res.status(201).json({status:1,message:"copyright policy got successfully",data:result})    
    }else{
        return res.status(402).json({status:0,message:"no data found"})
    }
}