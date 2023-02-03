
const { default: mongoose } = require("mongoose")
const Chat = require("../model/chats")
const Message = require("../model/messages")
const User = require('../model/users')
const Chat_Setting = require('../model/chat_setting')
global.onlineusers = new Map()
const users = []
 exports = module.exports  = (io) =>{
    io.on("connection",(socket)=>{
        //console.log(socket.id)
    socket.on("add-user-online",(user_id)=>{
       // console.log(userid)
       if(!onlineusers.get(user_id)){

               User.findOneAndUpdate({_id:user_id},{is_online:true}).then((e)=>{
                    onlineusers.set( user_id,socket.id)
                    socket.broadcast.emit('userisonline',user_id)
            }) 
        }
        
    })
    socket.on("joinchat",(chat_id,user_id)=>{
        socket.join(chat_id)
        socket.broadcast.to(chat_id).emit("joinchat",user_id)
    })
    socket.on("message", (message) => {
        io.to(roomId).emit("createMessage", message, userName);
      });
    socket.on("leavechat",async(chat_id)=>{
        const ChatSetting = await Chat_Setting.find({chat_id:chat_id})
        if(ChatSetting[0].delete_chats == 1){
            const checkSeen  = await Chat.aggregate([{$match: {_id: mongoose.Types.ObjectId(chat_id)}}, {$project: {users: {$size: '$users'}}}])
            await Message.deleteMany({chat_id: mongoose.Types.ObjectId(chat_id),[`seenBy.${checkSeen[0].users - 2}`]:{"$exists":true}})
        }
    })

    socket.on("delete-message",async(user_id,message_id)=>{
        const checkChat = await Message.find({_id:message_id,deletedBy : {$in : [user_id]}})
        if(checkChat.length == 0){
            await Message.findOneAndUpdate({_id:message_id},{$push : {deletedBy : user_id}})
            socket.emit("message-deleted",(message_id,user_id))
        }
    })
    socket.on("unsend-message",async(user_id,message_id)=>{
        const checkChat = await Message.find({_id:message_id,user_id:user_id})
        if(checkChat.length > 0){
            await Message.deleteOne({_id:message_id})
            socket.emit("message-unsent",(message_id,user_id))
        }
    })
    socket.on("typing",(user_id,chat_id)=>{
        socket.broadcast.to(chat_id).emit("typing",user_id)
    })
    socket.on("send-message",async(stypmsg,user_id,chat_id,isGroupChat)=>{
        //const getuser = onlineusers.get(destid)
        var checkchat = null
        var chatid = chat_id
            if(isGroupChat == false){
                checkchat = await Chat.find({_id:chat_id})
                if(checkchat.length <= 0){
                    const user_data = await User.find({_id:chat_id})
                    if(user_data.length>0){

                        const chatdata = new Chat({
                            users : [user_id,chat_id],
                            name : user_data[0].name,
                            profile_image:user_data[0].profile_image
                        })
                        const savedchat = await chatdata.save()
                        const chatSetting = new Chat_Setting({
                            chat_id:savedchat._id
                        })
                        await chatSetting.save()
                        checkchat = await Chat.find({_id:savedchat._id}) 
                        chatid = savedchat._id
                        socket.join(chatid)
                    }

                }   
            }else{

                checkchat = await Chat.find({_id:chatid})   
            }
        if(  checkchat != null && checkchat?.length  > 0  ){
            const chatusers =  checkchat[0]?.users?.map((e)=>{
                return e
            }) 
            const inchatuser = Array.from(socket.adapter.rooms.get(chatid))
            var send = []
            chatusers.map((e)=>{
                if(onlineusers.get(e.toString())){
                    send.push(onlineusers.get(e.toString()))
                }
                else{
             console.log("sending notification to the " +e )
            }
        })
        if(send.length > 0){

            var difference = send.filter(x => inchatuser.indexOf(x) === -1);
            function getByValue(map, searchValue) {
                for (let [key, value] of map.entries()) {
                    if (value === searchValue)
                    return key;
                }
            }
            if(difference.length > 0){
                difference.map((e)=>{
                    console.log("sending notification to "+getByValue(onlineusers,difference[0]))
                })
            }
        }
        const newmsg = new Message({
            chat_id:chatid,
            user_id:user_id,
            message:stypmsg
        })
        newmsg.save().then((e)=>{
            
            socket.broadcast.to(chatid).emit("message-recieve",stypmsg,user_id,{message_id:e._id})
        })
        
    }
    })
   socket.on('seen-message',async(user_id,message_id,chat_id)=>{
        const checkseen = await Message.find({_id:message_id,seenBy:[user_id]})
        if(checkseen.length == 0){
            const check = await Message.find({_id:message_id,user_id:user_id})

            if(check.length==0){

                await Message.findOneAndUpdate({_id:message_id},{$push:{ seenBy : mongoose.Types.ObjectId(user_id)}})
                socket.broadcast.to(chat_id).emit('seen-message',user_id,message_id)
            }
        }
   })

   socket.on('save-message',async(user_id,message_id,chat_id)=>{
    await Message.findOneAndUpdate({_id:message_id},{isSaved:true})
    socket.broadcast.to(chat_id).emit('save-message',user_id,message_id,chat_id)
   })
   socket.on('unsave-message',async(user_id,message_id,chat_id)=>{
    await Message.findOneAndUpdate({_id:message_id},{isSaved:false})
    socket.broadcast.to(chat_id).emit('unsave-message',user_id,message_id,chat_id)
   })
    
})
}
