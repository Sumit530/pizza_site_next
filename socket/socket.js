
const Chat = require("../model/chats")
const Message = require("../model/messages")
const User = require('../model/users')
global.onlineusers = new Map()
const users = []
 exports = module.exports  = (io) =>{
    io.on("connection",(socket)=>{
        //console.log(socket.id)
    socket.on("add-user-online",(userid)=>{
       // console.log(userid)
       if(!onlineusers.get(userid)){

               User.findOneAndUpdate({_id:userid},{is_online:true}).then((e)=>{
                    onlineusers.set( userid,socket.id)
                    socket.broadcast.emit('userisonline',userid)
            }) 
        }
        
    })
    socket.on("joinchat",(chatid,userid)=>{
        socket.join(chatid)
        socket.broadcast.to(chatid).emit("joinchat",userid)
    })
    socket.on("leavechat",(roomid)=>{
        socket.leave(roomid)
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
        newmsg.save().then(()=>{

            socket.broadcast.to(chatid).emit("message-recieve",stypmsg,user_id)
        })
        
    }
    })
   socket.on('seen-message',async(userid,messageid)=>{
        const checkseen = await Message.find({_id:messageid,isSeen:[userid]})
        if(checkseen.length == 0){
            await Message.findOneAndUpdate({_id:messageid},{isSeen:[userid]})
        }
        socket.emit('seen-message',userid,messageid)
   })
    
    socket.emit("get-user",users)
    socket.on("join-room",(roomid,name,id)=>{
        socket.join(roomid);
        
       // socket.broadcast.to(roomid).emit("user-connected",userid)
        socket.on("message",(message)=>{
            io.to(roomid).emit("sendmessage",message,roomid)
        })
    })
})
}
