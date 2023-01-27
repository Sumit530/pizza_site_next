const RestrictAcoount = require("../model/restrict_accounts")

exports.add_restrict_accounts = async(req,res) =>{
    if(!req.body.user_id || req.body.user_id == '' ){ 
        return  res.status(406).json({status:0,message:"please give proper parameter"})
    } 
    if(!req.body.login_id || req.body.login_id == '' ){ 
        return  res.status(406).json({status:0,message:"please give proper parameter"})
    }

    restrict_data = await RestrictAcoount.find({login_id: req.body.login_id,user_id:req.body.user_id})
    if(restrict_data.length > 0){
        return res.status(402).json({status:0,message:"This account you have a already restrict applied."})
    }else{
        const restrict = new RestrictAcoount({
            login_id: req.body.login_id,
            user_id:req.body.user_id,
            content:req.body.content ? req.body.content : ''
        }) 
        await restrict.save()
        return res.status(201).json({status:1,message:"Account restrict add successfully!."})    
    }
}