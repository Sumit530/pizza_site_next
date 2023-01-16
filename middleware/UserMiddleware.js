const jwt = require('jsonwebtoken')
require('dotenv').config()

const UserAuth = (req,res,next)=>{
  if(!req.headers.authorization){
   return res.status(412).json({status:412,message:"invalid credential"})
  }
try {
  let token = req.headers.authorization
  token = token.split(" ")[1]
    if(token){
    //console.log(req.session.user);
   const user = jwt.verify(token,process.env.USER_SECRET);
   console.log(user)
   if(user ){  

        // if(){

          next(); 
        // }
        // else{
        //   res.status(409).json({status:409,message:"invalid session token of admin"});      
        // }
        // console.log(req.session.admin)
   }
   else{   
    return res.status(409).json({status:0,message:"invalid session token of user"});
    }
   }
    
}

catch(e){
        res.status(500).json({status:0,message:"internal server error on admin authentication"})
        console.log("invalid token "+ e);
        
    
}

}

module.exports = UserAuth;
