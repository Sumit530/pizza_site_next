const Chat = require("../model/chats")
const Message = require("../model/messages")
const User = require('../model/users')
const Chat_Setting = require("../model/chat_setting")
const moment = require("moment")



exports.ShowMessage = async(req,res) =>{
try {
    if(!req.body.chat_id || req.body.chat_id == ''){
        return  res.status(406).json({status:0,message:"please give proper parameter"})
    }
    const checkChatSetting = await Chat_Setting.find({chat_id:req?.body?.chat_id})
    if(checkChatSetting[0].delete_chats == 2){
        
       await  Message.deleteMany({chat_id:req.body.chat_id,isSaved:false,createdAt:{$lte : moment().utc().subtract(1,"day").toDate()}})
        const message = await Message.find({chat_id:req.body.chat_id,deletedBy:{$nin:[req.body.user_id]}}).populate("user_id","username,name,profile") 
        if(message.length>0){
            var data =   message?.map((e)=>{
                if(e.user_id.profile_image != ''){
                    if(fs.existsSync(`uploads/user/profile/${e.user_id.profile_image}`)){
                        const path = process.env.PUBLICPOROFILEIMAGEURL
                        var  profile_image = `${path}/${e.user_id.profile_image}`
                    }
                    else if (fs.existsSync(`uploads/cahts/profile/${e.user_id.profile_image}`)){
                        const path = process.env.PUBLICPOROFILEIMAGEURL
                        var  profile_image = `${path}/${e.user_id.profile_image}`
                    }
                    else{
                        
                        var profile_image = ''
                    }
                }else{
                    var profile_image = ''
                }
                if(e.attachment != ''){
                    const path = process.env.PUBLICPOROFILEIMAGEURL
                    if(fs.existsSync(`uploads/chat/${e.attachment}`)){
                        var  attachment = `${path}/${e.attachment}`
                    }else{
                        
                        var attachment = ''
                    }
                }else{
                    var attachment = ''
                }
                return({
                    id:e._id,
                    user_id:e.user_id._id,
                    username:e.user_id.username,
                    profile_image:profile_image,
                    attachment:attachment,
                    message:e.message,
                    is_saved : e.isSaved == true ? true : false
                    
                })
            })
            return res.status(201).json({data:data,status:1,message:"message found"})  
        }else{
            return  res.status(406).json({status:0,message:"message not found"})    
        }
    }
    else if (checkChatSetting[0].delete_chats == 1){
        const message = await Message.find({chat_id:req.body.chat_id}).populate("user_id","username,name,profile") 
        if(message.length>0){
            var data =   message?.map((e)=>{
                if(e.user_id.profile_image != ''){
                    if(fs.existsSync(`uploads/user/profile/${e.user_id.profile_image}`)){
                        const path = process.env.PUBLICPOROFILEIMAGEURL
                        var  profile_image = `${path}/${e.user_id.profile_image}`
                    }
                    else if (fs.existsSync(`uploads/cahts/profile/${e.user_id.profile_image}`)){
                        const path = process.env.PUBLICPOROFILEIMAGEURL
                        var  profile_image = `${path}/${e.user_id.profile_image}`
                    }
                    else{
                        
                        var profile_image = ''
                    }
                }else{
                    var profile_image = ''
                }
                if(e.attachment != ''){
                    const path = process.env.PUBLICPOROFILEIMAGEURL
                    if(fs.existsSync(`uploads/chat/${e.attachment}`)){
                        var  attachment = `${path}/${e.attachment}`
                    }else{
                        
                        var attachment = ''
                    }
                }else{
                    var attachment = ''
                }
                return({
                    id:e._id,
                    user_id:e.user_id._id,
                    username:e.user_id.username,
                    profile_image:profile_image,
                    attachment:attachment,
                    message:e.message,
                    is_saved : e.isSaved == true ? true : false
                    
                })
            })
            return res.status(201).json({data:data,status:1,message:"message found"})  
        }else{
            return  res.status(406).json({status:0,message:"message not found"})    
        }
    }
} catch (error) {
    res.status(502).json({status:0,message:"internal server error"})
        console.log("server error on create group chat" + error);  
}
}
exports.showChat = async(req,res)=>{
    if(!req.body.user_id || req.body.user_id == ''){
        return  res.status(406).json({status:0,message:"please give proper parameter"})
    }
    const chats = await Chat.find({users:[req.body.user_id]})
    if(chats.length>0){
       var data =  chats?.map(async(e)=>{
        const lastmessage = await Message.find({chat_id:e._id}).limit(1).sort({$natural:-1})
            if(e.profile_image != ''){

                if(fs.existsSync(`uploads/users/profile/${e.profile_image}`)){
                    const path = process.env.PUBLICPOROFILEIMAGEURL
                    var profile_image = `${path}/${e.profile_image}`
                }
                else if(fs.existsSync(`uploads/chats/profile/${e.profile_image}`)){
                    const path = process.env.PUBLICPOROFILEIMAGEURL
                    var profile_image = `${path}/${e.profile_image}`
                }else{
                    var profile_image = ''
                }
            }else{
                var profile_image = ''
            }
            return({
                id:e._id,
                profile_image:profile_image, 
                name:e.name,
                type:e.type,
                lastmessage:e.message,
                attachment:e.attachment
            })
        })
        Promise.all(data).then((e)=>{

            if(e.length > 0){
                return  res.status(201).json({status:1,message:"data found",data:e})
            }else{
                return res.status(406).json({status:0,message:"No data found.!"})
            }
        })
    }
}
exports.CreateGroup = async(req,res)=>{
    try {
        if(!req.body.user_ids || req.body.user_ids == ''){
            return  res.status(406).json({status:0,message:"please give proper parameter"})
        }
        if(!req.body.creater_id || req.body.creater_id == ''){
            return  res.status(406).json({status:0,message:"please give proper parameter"})
        }
        if(!req.body.group_name || req.body.group_name == ''){
            return  res.status(406).json({status:0,message:"please give proper parameter"})
        }
            const users = req.body.user_ids.split(",")
        const grpdata = new Chat({
            users:users,
            creater:req.body.creater_id,
            is_group_chat:true,
            name:req.body.group_name 

        })
         const group = await grpdata.save()
        return res.status(201).json({data:group,status:1,message:"group created successfully"})
    } catch (error) {
        res.status(502).json({status:0,message:"internal server error"})
        console.log("server error on create group chat" + error);  
    }
}

exports.DeleteMessages = (req,res)=>{
    try {
        if(!req.body.message_ids || req.body.message_ids == ''){
            return  res.status(406).json({status:0,message:"please give proper parameter"})
        }  
        if(!req.body.message_ids || req.body.message_ids == ''){
            return  res.status(406).json({status:0,message:"please give proper parameter"})
        } 

    } catch (error) {
        res.status(502).json({status:0,message:"internal server error"})
        console.log("server error on delete messsage chat" + error);  
    }
}
exports.DeleteChat = async(req,res)=>{
    try {
        if(!req.body.chat_id || req.body.chat_id == ''){
            return  res.status(406).json({status:0,message:"please give proper parameter"})
        }
            
       
         const group = await Chat.find({_id:req.body.chat_id})
         if(group.length>0){
                await Chat.deleteOne({_id:req?.body?.chat_id})
             return res.status(201).json({data:group,status:1,message:"group deleted successfully"})
         }else{
            return  res.status(406).json({status:0,message:"group not found"})  
         }
    } catch (error) {
        res.status(502).json({status:0,message:"internal server error"})
        console.log("server error on delete group" + error);  
    }
}
exports.AddGroupChatMembers = async(req,res)=>{
    try {
        if(!req.body.group_chat_id || req.body.group_chat_id == ''){
            return  res.status(406).json({status:0,message:"please give proper parameter"})
        }
        if(!req.body.user_id || req.body.user_id == ''){
            return  res.status(406).json({status:0,message:"please give proper parameter"})
        }
        const group = await Chat.find({_id:req.body.group_chat_id}).populate("users")
        if(group.length>0){
            const user = await User.find({_id:req?.body?.user_id})
            if(user.length>0){
                const updategrp = await GroupChat.findOneAndUpdate({_id:req.body.group_chat_id},{users:{$push:req?.body?.user_id}})
                return res.status(201).json({data:updategrp,status:1,message:"member added successfully"})
            }else{
                return  res.status(406).json({status:0,message:"user not found"})      
            }
        }else{
            return  res.status(406).json({status:0,message:"group not found"})  
        }
    } catch (error) {
        res.status(502).json({status:0,message:"internal server error"})
        console.log("server error on add chat memeber" + error);  
    }
}
exports.ShowGroupChatMembers = async(req,res)=>{
    try {
        if(!req.body.group_chat_id || req.body.group_chat_id == ''){
            return  res.status(406).json({status:0,message:"please give proper parameter"})
        }
         const group = await Chat.find({_id:req.body.group_chat_id}).populate("users")
         if(group.length>0){
                const data = group[0]?.users?.map((e)=>{
                        if(e.profile_image != ''){
                            const path = process.env.PUBLICPOROFILEIMAGEURL
                            if(fs.existsSync(`uploads/user/profile/${e.profile_image}`)){
                                var  profile_image = `${path}/${e.profile_image}`
                            }else{
                                
                                var profile_image = ''
                            }
                        }else{
                            var profile_image = ''
                        } 
                        var user_name  = e.name 
                        var user_username  = e.username 
                   return ({name:user_name,username:user_username,profile_image:profile_image})
                })
             return res.status(201).json({data:data,status:1,message:"group member found successfully"})
         }else{
            return  res.status(406).json({status:0,message:"group not found"})  
         }
    } catch (error) {
        res.status(502).json({status:0,message:"internal server error"})
        console.log("server error on add show group chat" + error);  
    }
}
