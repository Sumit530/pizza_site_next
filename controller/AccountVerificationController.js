const AccountVerifaction = require("../model/account_verification")
const fs= require("fs")

exports.add_account_verification  = async(req,res) =>{
    try {
        if( req.body.user_id == '' || !req.body.user_id || req.body.full_name == '' || !req.body.full_name  || !req.file || req.body.category_id == '' || !req.body.category_id || req.body.country_id == '' || !req.body.country_id){ 
            return  res.status(406).json({status:0,message:"please give a proper parameter"})
        } 
        const checkverify = await AccountVerifaction.find({user_id:req.body.user_id})
        if(checkverify.length > 0){
            fs.unlink(`uploads/users/verification_documents/${req.file.filename}`,(err)=>{
                if(err){

                    console.log(err)
                }
            })
            return res.status(402).json({status:0,message:"Already send request for verification"})
        }
        const accounverifydata = new AccountVerifaction({
            user_id:req.body.user_id,
            full_name:req.body.full_name,
            document:req.file.filename,
            document_type : req.body.document_type,
            url1 : req.body.url1 ? req.body.url1 : "",
            link_type3:req.body.link_type3 ? req.body.link_type3 : "",
            url3:req.body.url3 ? req.body.url3 : "",
            link_type4:req.body.link_type4 ? req.body.link_type4       : "",
            url4:req.body.url4 ? req.body.url4 : "",
            link_type5:req.body.link_type5 ? req.body.link_type5 : "",
            url5:req.body.url5 ? req.body.url5 : "",
             
        })
        await accounverifydata.save()
         return res.status(201).json({status:1,message:"New request for verification add successfully"})
    } catch (error) {
        res.status(502).json({status:0,message:"internal server error",})
        console.log("server error on account verification" + error); 
    }
}