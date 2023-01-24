const Language = require("../model/languages")
const User = require("../model/users")


exports.Index = async(req,res ) =>{
    try {
        const language  = await Language.find()
        if(language.length > 0){
            return res.status(201).json({status:1,message:"language got successfully",data:language})    
        }
        else{
            return res.status(402).json({status:0,message:"no data found"})
        }

    } catch (error) {   
        res.status(502).json({status:0,message:"internal server error"})
        console.log("server error on get language " +error ); 
    }
}

exports.get_user_language = async(req,res )=>{
    try {
        if(!req.body.user_id || req.body.user_id == '' ){ 
            return  res.status(406).json({status:0,message:"please give proper parameter"})
        }
        const userlangauegedata = await User.find({_id:req.body.user_id}).populate("language_id","language_name")
        if(userlangauegedata.length > 0){
            return res.status(201).json({status:1,message:"language got successfully", data:userlangauegedata[0].language_id})    
        }
        else{
            return res.status(402).json({status:0,message:"no data found"})
        }
    } catch (error) {
        res.status(502).json({status:0,message:"internal server error"})
        console.log("server error on get user language" +error ); 
    }
}