const password_policies = require("../model/password_policies")

exports.getPasswordPolicy = async(res,res) =>{
        const password_policy = await password_policies.find()
        if(password_policy.length>0){
            res.status(201).json({status:1,message:"password policy got successfully",result:password_policies})
        }else{
            res.status(402).json({status:0,message:"Password Policy Not Found",})

        }
}

exports.changePasswrodPolicy = async(req,res)=>{
    if(!req.body.id || req.body.id == '' || req.body.minimum_length == '' || !req.body.minimum_length || !req.body.complexity || req.body.complexity == '' || !req.body.expire || req.body.expire == ''){ 
        return  res.status(406).json({status:0,message:"please give proper parameter"})
    }
    await password_policies.findOneAndUpdate({_id:req.body.id},{minimum_length:req.body.minimum_length,complexity:req.body.complexity,expire:req.body.complexity})
    res.status(201).json({status:1,message:"password policy successfully Updated"})
}