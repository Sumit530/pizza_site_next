const Admin = require("../model/admins")
const bcrypt = require("bcryptjs");
const jwt = require('jsonwebtoken')

exports.Login = async(req,res) =>{
    const data = JSON.parse(req.body.data)
    const checkUser = await Admin.find({email:data.email})
    if(checkUser.length > 0){
        const checkpass = await bcrypt.compare(data.password,checkUser[0].password)
        
        if(checkpass==false){
            return res.status(406).json({status:-1,message:"Invlaid Password!"})
        }
        else{
            console.log("HEY")
            const keysecret = process.env.ADMIN_SECRET
            const token = jwt.sign({id:checkUser[0]._id},keysecret)
            return res.status(201).json({status:1,message:"Logged In Successfully!",token:token})
        }

    }else{
        return  res.status(406).json({status:0,message:"Invalid Email!"})       
    }
}

exports.create_account = async(req,res) =>{
    const data = JSON.parse(req.body.data)
    const pass = await bcrypt.hash(data.password,10)
    data.password = pass
        const checkEmail = await Admin.find({email:data.email})
        if(checkEmail.length>0){
            return res.json({status:-1,message:"Email Already Exist"})
        }
        const newAccount = new Admin(data)
        await newAccount.save()
        return res.status(201).json({status:1,message:"Account Created Successfully!"})

}