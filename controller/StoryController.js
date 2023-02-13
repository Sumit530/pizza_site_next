const Story = require("../model/story")

exports.add_story = (req,res) =>{
    if( req?.body?.user_id == '' || !req?.body?.user_id ){ 
        return  res.status(406).json({status:0,message:"please give a proper parameter"})
    }
    if(  !req?.file || req?.file == '' ){ 
        return  res.status(406).json({status:0,message:"please give a proper parameter"})
    }
    if(req?.body.mention){ 
        return  res.status(406).json({status:0,message:"please give a proper parameter"})
    }

}