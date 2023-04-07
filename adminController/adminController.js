const Admin = require("../model/admins")
const bcrypt = require("bcryptjs");

exports.Login = async(req,res) =>{
    if(!req.body.email || req.body.email == ""){
        return  res.status(406).json({status:0,message:"please give a proper parameter"})
    }
    if(!req.body.password || req.body.password == ""){
        return  res.status(406).json({status:0,message:"please give a proper parameter"})
    }

    const checkUser = await Admin.find({email:req.body.email})
    if(checkUser.length > 0){
    
        if(bcrypt.compare(req.body.password,checkUser[0].password)==false){
            return res.status(406).json({status:-1,message:"Invlaid Password!"})
        }
        else{
            const token = jwt.sign({id:checkUser[0]._id},keysecret)
            return res.status(201).json({status:1,message:"Logged In Successfully!",token:token})
        }

    }else{
        return  res.status(406).json({status:0,message:"Invalid Email!"})       
    }
}

exports.create_account = async(req,res) =>{
    const pass = await bcrypt.hash(req.body.password,10)
    const newAccount = new Admin({
        email:req.body.email,
        name:req.body.name,
        password:pass,
        role:req.body.role
    })
    await newAccount.save()

    return res.status(201).json({status:1,message:"Account Created Successfully!"})

}